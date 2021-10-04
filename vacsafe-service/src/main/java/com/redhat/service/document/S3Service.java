package com.redhat.service.document;

import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.Bucket;
import software.amazon.awssdk.services.s3.model.ListBucketsRequest;
import software.amazon.awssdk.services.s3.model.ListBucketsResponse;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.CreateBucketResponse;

@Component("S3Service")
public class S3Service implements IDocumentService {

    private static final Logger log = LoggerFactory.getLogger(S3Service.class);

    @Value("${s3.bucket.name}")
    private String bucketName;

    @Value("${s3.region.name}")
    private String regionName;

    private S3Client s3;

    /*
     * Credentials will be picked up using various methods.
     * See: https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html
     */
    @PostConstruct
    public void S3Service()  {
        log.info("constructor() s3 region = "+regionName);
        s3 = S3Client.builder()
            .region(Region.of(regionName))
            .build();
    }

    /**
     * Save the file to S3 and return the object uuid
     */
    public String put(byte[] file) throws S3Exception {
        String objectKey = UUID.randomUUID().toString();

        try {
            PutObjectRequest putOb = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();
    
            PutObjectResponse response = s3.putObject(putOb, RequestBody.fromBytes(file));
            log.debug("Successfully saved object to AWS S3. S3 uuid: {}, Response: {}", objectKey, response);
    
            return objectKey;

        }catch(S3Exception x){
            log.error("put() unable to put object to bucket: "+bucketName);
            throw x;
        }
    }

    public byte [] get(String key) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
    
            ResponseBytes<GetObjectResponse> o = s3.getObject(getObjectRequest, ResponseTransformer.toBytes());
            log.debug("Successfully retrieve object with key {} from AWS S3", key);
            return o.asByteArray();

        }catch(S3Exception x){
            log.error("put() unable to get object to bucket: "+bucketName);
            throw x;
        }
    }

    public List<Bucket> listBuckets() {
        ListBucketsRequest bucketsRequest = ListBucketsRequest.builder().build();
        ListBucketsResponse response = s3.listBuckets(bucketsRequest);
        
        return response.buckets();
    }

    public void createBucket(String bucketName) {
        CreateBucketRequest createBucket = CreateBucketRequest.builder()
            .bucket(bucketName)
            .build();
        
        CreateBucketResponse createBucketResponse = s3.createBucket(createBucket);
        log.info("createBucket() createBucketResponse() = "+createBucketResponse.toString());
    }
}
