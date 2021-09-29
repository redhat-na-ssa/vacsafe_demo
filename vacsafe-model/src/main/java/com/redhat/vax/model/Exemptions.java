package com.redhat.vax.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Index;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;

@Entity
@Table(
    name = "cs_exemptions",
    indexes = {
        @Index(name = "idx_cs_exemptions_employee_id", columnList = "employee_id", unique = true),
        @Index(name = "idx_cs_exemptions_agency_code", columnList = "agency_code"),
        @Index(name = "idx_cs_exemptions_agency_name", columnList = "agency_name"),
    }
)
@NamedQuery(
    name = "exemptions_by_employee_id", 
    query = "SELECT d FROM Exemptions d WHERE d.employeeId=:employeeId"
)
@NamedQuery(
    name = "exemptions_by_employee_id_and_agency_name", 
    query = "SELECT d FROM Exemptions d WHERE d.employeeId=:employeeId and d.agencyName=:agencyName"
)
public class Exemptions implements Serializable {

    static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "EXEMPTION_TABLE_ID_GENERATOR", strategy = javax.persistence.GenerationType.AUTO)
    @SequenceGenerator(name = "EXEMPTION_TABLE_ID_GENERATOR", sequenceName = "EXEMPTION_TABLE_ID_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "agency_code")
    private String agencyCode;

    @Column(name = "agency_name")
    private String agencyName;

    private boolean vaccine = false;

    private boolean mask = false;

    private boolean test = false;


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

    public boolean isVaccine() {
        return vaccine;
    }

    public void setVaccine(boolean vaccine) {
        this.vaccine = vaccine;
    }

    public boolean isMask() {
        return mask;
    }

    public void setMask(boolean mask) {
        this.mask = mask;
    }

    public boolean isTest() {
        return test;
    }

    public void setTest(boolean test) {
        this.test = test;
    }

    @Override
    public String toString() {
        return "Exemptions [agencyCode=" + agencyCode + ", agencyName=" + agencyName + ", employeeId=" + employeeId
                + ", id=" + id + ", mask=" + mask + ", test=" + test + ", vaccine=" + vaccine + "]";
    }

}
