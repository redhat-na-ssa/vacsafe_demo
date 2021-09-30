package com.redhat.service.email;

public class EmailServiceException extends RuntimeException {

    public EmailServiceException() {
    }

    public EmailServiceException(String message) {
        super(message);
    }

    public EmailServiceException(Throwable cause) {
        super(cause);
    }

    public EmailServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
