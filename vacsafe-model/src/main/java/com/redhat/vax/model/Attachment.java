package com.redhat.vax.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Attachment {

    @Column(name = "attachment_file_name")
    private String originalFileName;
    
    @Column(name = "attachment_size")
    private long size;

    @Column(name = "attachment_content_type")
    private String contentType;

    @Column(name = "s3_bucket")
    private String s3BucketName;

    @Column(name = "s3_uuid")
    private String s3UUID;

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getS3BucketName() {
        return s3BucketName;
    }

    public void setS3BucketName(String s3BucketName) {
        this.s3BucketName = s3BucketName;
    }

    public String getS3UUID() {
        return s3UUID;
    }

    public void setS3UUID(String s3uuid) {
        s3UUID = s3uuid;
    }

    @Override
    public String toString() {
        return "Attachment [contentType=" + contentType + ", originalFileName=" + originalFileName + ", s3BucketName="
                + s3BucketName + ", s3UUID=" + s3UUID + ", size=" + size + "]";
    }

}
