package com.redhat.service.email;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.redhat.vax.model.Utils;

@Component
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    @Value("${vacsafe.email.from}")
    private String defaultFrom;

    //@Value("${vacsafe.email.enable}")
    private boolean emailEnabled = Boolean.valueOf(System.getProperty("vacsafe.email.enable", "false"));

    private void validate(String ... emailAddresses) {
        for (String s: emailAddresses) {
            if(!Utils.isEmailValid(s)) {
                throw new EmailServiceException("Invalid email address" + s);
            }
        }
    }

    private void sendEmail(String from, String to, String subject, String text) {
        validate(from, to);
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom(from);
        message.setTo(to); 
        message.setSubject(subject); 
        message.setText(text);
        try {
            emailSender.send(message);
            log.debug("Email successfully sent to {}. Subject: {}", to, subject);    
        } catch(Exception e) {
            log.debug("Error while sending email", e);
            throw new EmailServiceException("Error while sending email", e);
        }
    }

    public void sendEmail(String to, String subject, String text) {
        if(emailEnabled) {
            sendEmail(defaultFrom, to, subject, text);
        } else {
            log.warn("Email notification is disabled. Set vacsafe.email.enable=true to enable it.");
        }
    }

    public void sendEmail(List<String> recipients, String subject, String text) {
        if(recipients != null) {
            recipients.forEach(to -> sendEmail(to, subject, text));
        }
    }
}
