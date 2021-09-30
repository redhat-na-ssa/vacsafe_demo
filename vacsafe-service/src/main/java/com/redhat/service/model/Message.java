package com.redhat.service.model;

public class Message {

    private String id;
    private String subject;
    private String text;
    private boolean hasParans = false;

    public Message(String id, String subject, String text) {
        this(id, subject, text, false);
    }

    public Message(String id, String subject, String text, boolean hasParams) {
        this.id = id;
        this.subject = subject;
        this.text = text;
        this.hasParans = hasParams;
    }

    public String getId() {
        return id;
    }

    public String getSubject() {
        return subject;
    }

    public String getText() {
        return text;
    }

    public boolean hasParans() {
        return hasParans;
    }

    public String getText(String ... params) {
        return String.format(text, params);
    }

    @Override
    public String toString() {
        return "Message [id=" + id + ", subject=" + subject + ", text=" + text + "]";
    }
}
