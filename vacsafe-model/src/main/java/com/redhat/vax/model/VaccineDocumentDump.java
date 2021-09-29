package com.redhat.vax.model;

import java.io.Serializable;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Index;

@Entity
@Table(
    name = "cs_vax_document_dump",
    indexes = {
        @Index(name = "idx_cs_vax_document_dump_employee_id", columnList = "employee_id", unique = true)
    }
)
public class VaccineDocumentDump implements Serializable {

    static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "DOCUMENT_DUMP_ID_GENERATOR", strategy = javax.persistence.GenerationType.AUTO)
    @SequenceGenerator(name = "DOCUMENT_DUMP_ID_GENERATOR", sequenceName = "DOCUMENT_DUMP_ID_SEQ", allocationSize = 1)
    protected Long id;


    //FIXME: Review this with the team
    // Not making this a foreign key in order to allow document for employee not in the system
    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "brand")
    @Enumerated(EnumType.STRING)
    private VaccineBrand vaccineBrand;

    @Column(name = "agency_code")
    private String agencyCode;

    @Column(name = "agency_name")
    private String agencyName;

    @Column(name = "last_dose_date")
    private LocalDate lastDoseDate;

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

    public VaccineBrand getVaccineBrand() {
        return vaccineBrand;
    }

    public void setVaccineBrand(VaccineBrand vaccineBrand) {
        this.vaccineBrand = vaccineBrand;
    }

    public LocalDate getLastDoseDate() {
        return lastDoseDate;
    }

    public void setLastDoseDate(LocalDate lastDoseDate) {
        this.lastDoseDate = lastDoseDate;
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

    @Override
    public String toString() {
        return "VaccineDocumentDump [agencyCode=" + agencyCode + ", agencyName=" + agencyName + ", employeeId="
                + employeeId + ", id=" + id + ", lastDoseDate=" + lastDoseDate + ", vaccineBrand=" + vaccineBrand + "]";
    }
}
