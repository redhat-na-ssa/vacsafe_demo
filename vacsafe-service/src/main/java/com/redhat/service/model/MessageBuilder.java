package com.redhat.service.model;

public class MessageBuilder {

    private String id;
    private String subject;
    private StringBuilder textBuilder = new StringBuilder();
    private boolean hasParams = false;

    public MessageBuilder id(String id) {
        this.id = id;
        return this;
    }
    
    public MessageBuilder subject(String subject) {
        this.subject = subject;
        return this;
    }

    public MessageBuilder text(String text) {
        this.textBuilder = new StringBuilder(text);
        return this;
    }

    public MessageBuilder appendText(String text) {
        this.textBuilder.append(text);
        return this;
    }

    public MessageBuilder hasParams(boolean hasParams) {
        this.hasParams = hasParams;
        return this;
    }

    public Message build() {
        return new Message(id, subject, textBuilder.toString(), hasParams);
    }
}
