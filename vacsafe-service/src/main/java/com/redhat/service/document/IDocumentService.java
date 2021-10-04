package com.redhat.service.document;

public interface IDocumentService {

    public String put(byte[] file);
    public byte [] get(String key);

}
