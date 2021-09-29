package com.redhat.vax.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;

@MappedSuperclass
public abstract class Document {

    @Id
    @GeneratedValue(generator = "DOCUMENT_ID_GENERATOR", strategy = javax.persistence.GenerationType.AUTO)
    @SequenceGenerator(name = "DOCUMENT_ID_GENERATOR", sequenceName = "DOCUMENT_ID_SEQ", allocationSize = 1)
    protected Long id;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

    @Embedded
    private Attachment attachment;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate = LocalDateTime.now();

    @Embedded
    private DocumentReview review;

    @Column(name = "submitted_by")
    private String submittedBy;

    @Column(name = "auto_approved")
    private Boolean autoApproved = true;

    public List<String> validate() {
        return new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
 
    public Attachment getAttachment() {
        return attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public DocumentReview getReview() {
        return review;
    }

    public void setReview(DocumentReview review) {
        if(review != null) {
            review.setReviewDate(LocalDateTime.now());
        }
        this.review = review;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public Boolean getAutoApproved() {
        return autoApproved;
    }

    public void setAutoApproved(Boolean autoApproved) {
        this.autoApproved = autoApproved;
    }

    @Override
    public String toString() {
        return "Document [id=" + id + ", submissionDate=" + submissionDate +" # " + employee 
            + " # " + attachment + " # " + review + ", submittedBy=" + submittedBy 
            + ", autoApproved=" + autoApproved + "]";
    }

}
