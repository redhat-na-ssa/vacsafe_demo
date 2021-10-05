package com.redhat.service.document;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component("LocalFileService")
public class LocalFileService implements IDocumentService {

    private static final Logger log = LoggerFactory.getLogger(LocalFileService.class);

    @Value("${com.redhat.vacsafe.document.base.dir}")
    private String documentStorageBaseDir;

    private File baseDir;

    @PostConstruct
    public void init() {
        String objectKey = UUID.randomUUID().toString();
        log.info("Base path for document mgmt = "+documentStorageBaseDir+"/"+objectKey);
        baseDir = new File(documentStorageBaseDir+"/"+objectKey);
        baseDir.mkdir();
    }

    @Override
    public String put(byte[] file) {
        String objectKey = UUID.randomUUID().toString();
        FileOutputStream fStream = null;
        try {
            File fileObj = new File(baseDir, objectKey);
            fStream = new FileOutputStream(fileObj);
            fStream.write(file);
            
        }catch(Exception x){
            x.printStackTrace();

        }finally {
            if(fStream != null)
                try {
                    fStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
        return objectKey;
    }

    @Override
    public byte[] get(String key) {
    
        File fileObj = new File(baseDir, key);
        if(!fileObj.exists())
          throw new RuntimeException("get() The following file does not exist: "+fileObj.getAbsolutePath());

        byte[] bytes = new byte[(int) fileObj.length()];
        FileInputStream fStream = null;
        try {
            fStream = new FileInputStream(fileObj);
            fStream.read(bytes);
  
        } catch(Exception x) {
            x.printStackTrace();
        } finally {
            if (fStream != null) {
                try {
                    fStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return bytes;
    }

}
