package com.redhat.service;

import com.redhat.service.document.S3Service;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestContextConfiguration {
    
    @Bean
    public S3Service s3Service() {
        return new S3Service();
    }

}
