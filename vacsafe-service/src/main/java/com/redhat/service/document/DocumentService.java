package com.redhat.service.document;

import javax.annotation.PostConstruct;

import com.redhat.service.Constants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DocumentService implements IDocumentService{

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    private S3Service s3Service;

    @Autowired
    private LocalFileService lfService;

    @Value("${com.redhat.vacsafe.document.provider.type}")
    private String documentProviderType;

    private IDocumentService docService;

    @PostConstruct
    public void init(){

        if(Constants.S3_DOCUMENT_PROVIDER_TYPE.equals(documentProviderType)) {
            docService = s3Service;
        }else if(Constants.LOCAL_DOCUMENT_PROVIDER_TYPE.equals(documentProviderType)){
            docService = lfService;
        }else {
            throw new RuntimeException("init() unknown file provider type = "+documentProviderType);
        }
        log.info("init() Will use the following storage provider: "+documentProviderType);

    }

    @Override
    public String put(byte[] file) {
        return docService.put(file);
    }

    @Override
    public byte[] get(String key) {
        return docService.get(key);
    }
    
}
