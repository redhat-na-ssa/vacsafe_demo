package com.redhat.service;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;
import java.util.UUID;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import software.amazon.awssdk.services.s3.model.Bucket;

//@Ignore
@RunWith(SpringRunner.class)
@Import(TestContextConfiguration.class)
@PropertySource("classpath:application.properties")
public class S3ServiceTest {

    public static final String AWS_ACCESS_KEY_ID="aws.accessKeyId";
    public static final String AWS_SECRET_ACCESS_KEY="aws.secretAccessKey";

    @Autowired
    private S3Service s3;
    
    @Test
    public void listBuckets() {
        System.out.println("testPutAndGet() AWS_ACCESS_KEY_ID = "+System.getProperty(AWS_ACCESS_KEY_ID)+" : AWS_SECRET_ACCESS_KEY = "+System.getProperty(AWS_SECRET_ACCESS_KEY));
        List<Bucket> buckets = s3.listBuckets();
        System.out.println("listBuckets() # of buckets = "+buckets.size());
        for(Bucket bucket : buckets){
            System.out.println("\nbucket = "+bucket.name());
        }
    }
    
    @Test
    public void testPutAndGet() {

        byte [] expected = UUID.randomUUID().toString().getBytes();

        String key = s3.put(expected);
        assertNotNull(key);

        byte [] actual = s3.get(key);
        assertArrayEquals(expected, actual);
    }
}
