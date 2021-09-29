package com.redhat.vax.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Index;
import javax.persistence.NamedQuery;

@Entity
@Table(
    name = "cs_document_task_mapping",
    indexes = {
        @Index(name = "idx_cs_document_task_mapping_document_id", columnList = "document_id", unique = true),
        @Index(name = "idx_cs_document_task_mapping_task_id", columnList = "task_id", unique = true),
        @Index(name = "idx_cs_document_task_mapping_process_instance_id", columnList = "process_instance_id", unique = true),
        @Index(name = "idx_cs_document_task_mapping_agency_code", columnList = "agency_code"),
        @Index(name = "idx_cs_document_task_mapping_agency_name", columnList = "agency_name")
    }
)
@NamedQuery(
    name = "document_task_mapping_by_document_id", 
    query = "SELECT d FROM DocumentTaskMapping d WHERE d.documentId=:documentId"
)
@NamedQuery(
    name = "document_task_mapping_by_document_id_and_agency_name", 
    query = "SELECT d FROM DocumentTaskMapping d WHERE d.documentId=:documentId and d.agencyName=:agencyName"
)
public class DocumentTaskMapping implements Serializable {

    @Id
    @GeneratedValue(generator = "DOCUMENT_TASK_MAPPING_ID_GENERATOR", strategy = javax.persistence.GenerationType.AUTO)
    @SequenceGenerator(name = "DOCUMENT_TASK_MAPPING_ID_GENERATOR", sequenceName = "DOCUMENT_TASK_MAPPING_ID_SEQ", allocationSize = 1)
    protected Long id;

    @Column(name = "document_id")
    private Long documentId;

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "process_instance_id")
    private Long processInstanceId;

    @Column(name = "agency_code")
    private String agencyCode;

    @Column(name = "agency_name")
    private String agencyName;

    @Column(name = "division_code")
    private String divisionCode;

    @Column(name = "division_name")
    private String divisionName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(Long processInstanceId) {
        this.processInstanceId = processInstanceId;
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

    @Override
    public String toString() {
        return "DocumentTaskMapping [agencyCode=" + agencyCode + ", agencyName=" + agencyName + ", divisionCode="
                + divisionCode + ", divisionName=" + divisionName + ", documentId=" + documentId + ", id=" + id
                + ", processInstanceId=" + processInstanceId + ", taskId=" + taskId + "]";
    }

}
