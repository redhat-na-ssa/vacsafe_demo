package com.redhat.service.email;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.jbpm.process.workitem.core.AbstractLogOrThrowWorkItemHandler;
import org.jbpm.process.workitem.core.util.Wid;
import org.jbpm.process.workitem.core.util.WidParameter;
import org.kie.api.executor.CommandContext;
import org.kie.api.executor.ExecutorService;
import org.kie.api.runtime.process.WorkItem;
import org.kie.api.runtime.process.WorkItemManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.redhat.service.cmd.EmailNotificationCommand;
import com.redhat.service.model.Message;

@Wid(widfile = "CustomEmailDefinitions.wid", name = "CustomEmail",
        displayName = "Email",
        icon = "defaultemailicon.png",
        parameters = {
                @WidParameter(name = "ScheduleDate"),
                @WidParameter(name = "Recipients"),
                @WidParameter(name = "Template"),
                @WidParameter(name = "TemplateParam1"),
                @WidParameter(name = "TemplateParam2"),
                @WidParameter(name = "TemplateParam3"),
                @WidParameter(name = "TemplateParam4"),
                @WidParameter(name = "TemplateParam5")
        })
@Component("CustomEmail")
public class CustomEmailWorkItemHandler extends AbstractLogOrThrowWorkItemHandler {

    private final static Logger log = LoggerFactory.getLogger(CustomEmailWorkItemHandler.class);

    private static final String COMMAND_ID = EmailNotificationCommand.class.getName();

    @Autowired
    private ExecutorService executorService;

    @Override
    public void executeWorkItem(WorkItem workItem, WorkItemManager manager) {
        try {
            if(isHrNotification(workItem) && isRecipientMissing(workItem)) {
                log.warn(">>> Skipping email notification. HR mailing list is not available. Environment: " 
                        + System.getProperty("vacsafe.environment") );
            } else {
                Date scheduleDate  = getScheduleDate(workItem);
                CommandContext ctx = buildCommandContext(workItem);

                log.debug(">>> Scheduling email command. Schedule Date: {}, {}", scheduleDate, ctx);
                Long cid = executorService.scheduleRequest(COMMAND_ID, scheduleDate, ctx);
                log.debug(">>> {} successfully scheduled. ID: {}", COMMAND_ID, cid);
            }
            manager.completeWorkItem(workItem.getId(), null);
        } catch (Exception e) {
            log.error("Error while executing the workitem", e);
            handleException(e);
        }
    }

    @Override
    public void abortWorkItem(WorkItem workItem, WorkItemManager manager) {
        // No op
    }

    private Date getScheduleDate(WorkItem workItem) {
        Date scheduleDate  = (Date) workItem.getParameter("ScheduleDate");
        return scheduleDate == null ? new Date() : scheduleDate;
    }

    private CommandContext buildCommandContext(WorkItem workItem) {

        String templateId = (String) workItem.getParameter("Template");
        String param1     = (String) workItem.getParameter("TemplateParam1");
        String param2     = (String) workItem.getParameter("TemplateParam2");
        String param3     = (String) workItem.getParameter("TemplateParam3");
        String param4     = (String) workItem.getParameter("TemplateParam4");
        String param5     = (String) workItem.getParameter("TemplateParam5");

        Message template =  EmailTemplates.get(templateId);
        if(template == null) {
            throw new RuntimeException("Cannot find email template '" + templateId+"'");
        }

        List<String> recipients = getRecipients(workItem);
        String subject = template.getSubject();
        String text    = template.getText(param1, param2, param3, param4, param5);

        CommandContext ctx = new CommandContext();
        ctx.setData("recipients", recipients);
        ctx.setData("subject", subject);
        ctx.setData("text", text);

        return ctx;
    }

    private List<String> getRecipients(WorkItem workItem) {
        if(isRecipientMissing(workItem)) {
            throw new RuntimeException("Email recipient(s) is missing");
        }
        String recipientsCSV = (String) workItem.getParameter("Recipients");
        return Arrays.asList(recipientsCSV.split(","));
    }

    private boolean isHrNotification(WorkItem workItem) {
        boolean b = EmailTemplates.POSITIVE_RESULT_HR
        .equals((String) workItem.getParameter("Template"));
        
        if(b) {
            log.debug(">>>>>>>>> HR Notification. Mailing List");
        }
        return b;
    }

    private boolean isRecipientMissing(WorkItem workItem) {
        String recipientsCSV = (String) workItem.getParameter("Recipients");
        return recipientsCSV == null || recipientsCSV.trim().isEmpty();
    }
}

