package com.redhat.vax.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Index;
import javax.persistence.NamedQuery;

@Entity
@Table(
    name = "cs_covid_positive_log",
    indexes = {
        @Index(name = "idx_cs_covid_positive_log_employee_id", columnList = "employee_id"),
        @Index(name = "idx_cs_covid_positive_log_covid_submitted_by", columnList = "submitted_by"),
        @Index(name = "idx_cs_covid_positive_log_employee_agency_code", columnList = "agency_code"),
        @Index(name = "idx_cs_covid_positive_log_employee_agency_name", columnList = "agency_name")
    }
)
@NamedQuery(
    name = "covid_positive_by_agency", 
    query = "SELECT d FROM PositiveTestResultLog d WHERE d.agencyCode=:agency"
)
@NamedQuery(
    name = "covid_positive_by_agency_name", 
    query = "SELECT d FROM PositiveTestResultLog d WHERE d.agencyName=:agencyName"
)
public class PositiveTestResultLog implements Serializable {

    @Id
    @GeneratedValue(generator = "COVID_POSITIVE_LOG_ID_GENERATOR", strategy = javax.persistence.GenerationType.AUTO)
    @SequenceGenerator(name = "COVID_POSITIVE_LOG_ID_GENERATOR", sequenceName = "COVID_POSITIVE_LOG_ID_SEQ", allocationSize = 1)
    protected Long id;

    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "covid_test_date")
    private LocalDate covidTestDate;
    
    @Column(name = "recorded_date")
    private LocalDateTime recordedDate = LocalDateTime.now();

    @Column(name = "submitted_by")
    private String submittedBy;

    @Column(name = "agency_code")
    private String agencyCode;

    @Column(name = "agency_name")
    private String agencyName;

    @Column(name = "division_code")
    private String divisionCode;

    @Column(name = "division_name")
    private String divisionName;

    @Embedded
    private Attachment attachment;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDate getCovidTestDate() {
        return covidTestDate;
    }

    public void setCovidTestDate(LocalDate covidTestDate) {
        this.covidTestDate = covidTestDate;
    }

    public LocalDateTime getRecordedDate() {
        return recordedDate;
    }

    public void setRecordedDate(LocalDateTime recordedDate) {
        this.recordedDate = recordedDate;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getAgencyCode() {
        return agencyCode;
    }

    public void setAgencyCode(String agencyCode) {
        this.agencyCode = agencyCode;
    }

    public String getAgencyName() {
        return agencyName;
    }

    public void setAgencyName(String agencyName) {
        this.agencyName = agencyName;
    }

    public String getDivisionCode() {
        return divisionCode;
    }

    public void setDivisionCode(String divisionCode) {
        this.divisionCode = divisionCode;
    }

    public String getDivisionName() {
        return divisionName;
    }

    public void setDivisionName(String divisionName) {
        this.divisionName = divisionName;
    }

    public Attachment getAttachment() {
        return attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }

    @Override
    public String toString() {
        return "PositiveTestResultLog [agencyCode=" + agencyCode + ", agencyName=" + agencyName + ", attachment="
                + attachment + ", covidTestDate=" + covidTestDate + ", divisionCode=" + divisionCode + ", divisionName="
                + divisionName + ", employeeId=" + employeeId + ", id=" + id + ", recordedDate=" + recordedDate
                + ", submittedBy=" + submittedBy + "]";
    }

}
