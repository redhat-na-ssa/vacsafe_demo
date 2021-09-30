package com.redhat.service.cmd;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

import org.kie.api.runtime.process.ProcessInstance;
import org.jbpm.runtime.manager.impl.jpa.EntityManagerFactoryManager;
import org.jbpm.services.api.ProcessService;
import org.jbpm.services.api.RuntimeDataService;
import org.jbpm.services.api.model.ProcessInstanceDesc;
import org.jbpm.workflow.instance.impl.WorkflowProcessInstanceImpl;
import org.kie.api.executor.Command;
import org.kie.api.executor.CommandContext;
import org.kie.api.executor.ExecutionResults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.redhat.service.Constants;
import com.redhat.service.SpringContextConfig;
import com.redhat.service.email.EmailService;
import com.redhat.vax.model.VaccineCardDocument;

public class ProcessReplayCommand implements Command {

    private final static Logger log = LoggerFactory.getLogger(ProcessReplayCommand.class);

    private final String PROCESS_DEF = "vax_card_review_workflow";

    private final boolean enabled = 
        System.getenv("PROCESS_REPLAY_CMD_ENABLED") !=  null ?
        Boolean.valueOf(System.getenv("PROCESS_REPLAY_CMD_ENABLED")) : false;

    @Override
    public ExecutionResults execute(CommandContext ctx) throws Exception {

        if(!enabled) {
            log.warn("{} is disabled.", this.getClass().getName());
            return new ExecutionResults();
        }

        if( ctx.getData("cutOfDateTime") == null ) {
            throw new RuntimeException("cutOfDateTime is missing");
        }

        Boolean dryRun = ctx.getData("dryRun") != null ? (Boolean) ctx.getData("dryRun") : true;
        LocalDateTime startDateTime = LocalDateTime.parse((String) ctx.getData("startDateTime"));
        LocalDateTime endDateTime = LocalDateTime.parse((String) ctx.getData("endDateTime"));
        List<Long> processInstanceList = (List) ctx.getData("processInstanceList");
        //LocalDateTime cutOfDateTime = LocalDateTime.parse((String) ctx.getData("cutOfDateTime"));
        List<String> emails = getEmails(ctx);

        EmailService emailService = SpringContextConfig.getBean(EmailService.class);
        ProcessService processService = SpringContextConfig.getBean(ProcessService.class);
        RuntimeDataService runtimeDataService = SpringContextConfig.getBean(RuntimeDataService.class);

        EntityManagerFactory emf = getEmf(ctx);
        
        List<String> restarted = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        // Disable email notifications
        System.setProperty("vacsafe.email.enable", "false");
        log.info(">>> Email enabled {}", System.getProperty("vacsafe.email.enable"));

        Collection<ProcessInstanceDesc> processInstances = 
            runtimeDataService.getProcessInstancesByProcessDefinition(PROCESS_DEF, Arrays.asList(ProcessInstance.STATE_ACTIVE), null);

        for(ProcessInstanceDesc p : processInstances) {
            Long pid = p.getId();

            Map<String, Object> params = processService.getProcessInstanceVariables(p.getDeploymentId(), pid);
            VaccineCardDocument document = (VaccineCardDocument) params.get("document");
            
            WorkflowProcessInstanceImpl pi = (WorkflowProcessInstanceImpl) processService.getProcessInstance(pid);

            LocalDateTime piStartDate = LocalDateTime.ofInstant(pi.getStartDate().toInstant(), ZoneId.systemDefault());

            if( piStartDate.isBefore(startDateTime) || piStartDate.isAfter(endDateTime) ) {
                continue;
            }

            if(processInstanceList != null 
                    && ! processInstanceList.isEmpty() 
                    && ! processInstanceList.contains(pi.getId())) {
                continue;
            }

            if(document == null) {
                errors.add("PID: " + pid +". Document is null");
                continue;
            }

            EntityManager em = emf.createEntityManager();
            try {
                if( !params.containsKey("document") ) {
                    throw new RuntimeException("Document id is missing");
                }
                
                if(! dryRun) {
                    // remove doc entry from cs_document_task_mapping
                    em.getTransaction().begin();
                    deleteTaskDocumentMapping(em, document.getId(), dryRun);

                    long newPid = processService.startProcess(Constants.KJAR_DEPLOYMENT_ID, PROCESS_DEF, params);
                    processService.abortProcessInstance(pid);
                    em.getTransaction().commit();
                }
                restarted.add(" PID: " + pid + ", Document ID: " + document.getId());
                log.info(">>> Process {} successfully restarted", pid);
            } catch(Exception e) {
                errors.add("PID: " + pid + ". " + e.getMessage() + ", Document Id: " + document.getId());
                log.error(">>> Error while restarting Process " + e +".", e);
                em.getTransaction().rollback();
            }
        }

        genReport(restarted, errors);

        // Enable email notifications and send report
        System.setProperty("vacsafe.email.enable", "true");
        log.info(">>> Email enabled {}", System.getProperty("vacsafe.email.enable"));


        // String report = genReport(restarted, errors);
        // System.out.println("\n\n" + report +"\n");

        // // Enable email notifications and send report
        // System.setProperty("vacsafe.email.enable", "true");
        // log.info(">>> Email enabled {}", System.getProperty("vacsafe.email.enable"));
        // if(emails != null && ! emails.isEmpty()) {
        //     emailService.sendEmail(emails, "Process Replay Command - Report", report);
        // }
        return new ExecutionResults();
    }

    private List<String> getEmails(CommandContext ctx) {
        String emailAsString = (String) ctx.getData("emails");
        List<String> result = new ArrayList<>();
        if(emailAsString != null) {
            for(String s: emailAsString.split(",")) {
                result.add(s.trim());
            }
        }
        return result;
    }


    private void genReport(List<String> restarted, List<String> errors ) {
        System.out.println("### ProcessReplayCommand\n");
        System.out.println("Total: " + restarted.size() + errors.size());
        System.out.println(", Success: " + restarted.size());
        System.out.println(", Failures: " + errors.size());
        System.out.println("\n");
        
        System.out.println("## Success: " + restarted.size());
        restarted.forEach(e -> System.out.println("\t-" + e ));

        System.out.println("## Failures: " + errors.size());
        errors.forEach(e -> System.out.println("\t-" + e ));
    }


    // private String genReport(List<String> restarted, List<String> errors ) {
    //     StringBuilder sb = new StringBuilder();
    //     sb.append("### ProcessReplayCommand\n\n");
    //     sb.append("Total: ").append(restarted.size() + errors.size())
    //         .append(", Success: ").append(restarted.size())
    //         .append(", Failures: ").append(errors.size())
    //         .append("\n\n");
        
    //     sb.append("## Success: ").append(restarted.size()).append("\n");
    //     restarted.forEach(e -> sb.append("\t-").append(e).append("\n"));

    //     sb.append("## Failures: ").append(errors.size()).append("\n");
    //     errors.forEach(e -> sb.append("\t-").append(e).append("\n"));

    //     return sb.toString();
    // }

    private EntityManagerFactory getEmf(CommandContext ctx) {
        String emfName = (String) ctx.getData("EmfName");
        if (emfName == null) {
            emfName = "org.jbpm.domain";
        }
        return EntityManagerFactoryManager.get().getOrCreate(emfName);
    }

    private void deleteTaskDocumentMapping(EntityManager em, Long documentId, boolean dryRun) {
        if(! dryRun) {
           javax.persistence.Query q = em.createQuery("delete from DocumentTaskMapping d where d.documentId=:id");
           q.setParameter("id", documentId);
           q.executeUpdate();
           log.info(">>>> DocumentTaskMapping with document_id {} deleted", documentId);
        }
    }
}
