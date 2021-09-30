package com.redhat.service.cmd;

import java.util.List;

import org.kie.api.executor.Command;
import org.kie.api.executor.CommandContext;
import org.kie.api.executor.ExecutionResults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.redhat.service.SpringContextConfig;
import com.redhat.service.email.EmailService;

public class EmailNotificationCommand implements Command {

    private final static Logger log = LoggerFactory.getLogger(EmailNotificationCommand.class);

    private EmailService emailService ;

    public EmailNotificationCommand() {
        this.emailService = SpringContextConfig.getBean(EmailService.class);
    }


    @Override
    public ExecutionResults execute(CommandContext ctx) throws Exception {
        log.debug(">>> " + ctx);

        String subject = (String) ctx.getData("subject");
        String text    = (String) ctx.getData("text");
        List<String> recipients = (List<String>) ctx.getData("recipients");
        
        emailService.sendEmail(recipients, subject, text);
        
        log.debug("Email notification has been sent to recipient(s) {}", recipients);
        return new ExecutionResults();
    }

}
