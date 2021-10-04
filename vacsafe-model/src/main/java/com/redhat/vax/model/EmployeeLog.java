package com.redhat.vax.model;

import java.io.Serializable;
import java.time.LocalDateTime;

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
    name = "cs_employee_log",
    indexes = {
        @Index(name = "idx_cs_employee_log_employee_id", columnList = "employee_id"),
        @Index(name = "idx_cs_employee_log_employee_workforce_id", columnList = "workforce_id"),
        @Index(name = "idx_cs_employee_log_email", columnList = "email"),
        @Index(name = "idx_cs_employee_log_agency_code", columnList = "agency_code"),
        @Index(name = "idx_cs_employee_log_agency_name", columnList = "agency_name"),
        @Index(name = "idx_cs_employee_log_division_code", columnList = "division_code")
    }
)
@NamedQuery(
    name = "employee_log_by_employee_id", 
    query = "SELECT d FROM EmployeeLog d WHERE d.employeeId=:employeeId"
)
@NamedQuery(
    name = "employee_log_by_employee_id_and_agency_name", 
    query = "SELECT d FROM EmployeeLog d WHERE d.employeeId=:employeeId and d.agencyName=:agencyName"
)
public class EmployeeLog implements Serializable {

    static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "EMPLOYEE_LOG_ID_GENERATOR", strategy = javax.persistence.GenerationType.AUTO)
    @SequenceGenerator(name = "EMPLOYEE_LOG_ID_GENERATOR", sequenceName = "EMPLOYEE_LOG_ID_SEQ", allocationSize = 1)
    protected Long id;

    @Column(name = "employee_id")
    private String employeeId;

    // Fields retrieved from LDAP
    @Column(name = "workforce_id")
    private String workforceId;

    private String username;

    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;

    @Column(name = "middle_name")
    private String middleName;

    private String email;

    @Column(name = "agency_code")
    private String agencyCode;

    @Column(name = "agency_name")
    private String agencyName;

    @Column(name = "division_code")
    private String divisionCode;

    @Column(name = "division_name")
    private String divisionName;

    private String supervisor;

    @Column(name = "is_hr")
    private boolean isHR;

    @Column(name = "full_time_part_time")
    private String fullTimePartTime;

    @Column(name = "user_type")
    private String userType;

    private String ncid;

    private LocalDateTime timestamp = LocalDateTime.now();

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

    public String getWorkforceId() {
        return workforceId;
    }

    public void setWorkforceId(String workforceId) {
        this.workforceId = workforceId;
        this.setEmployeeId(workforceId);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(String supervisor) {
        this.supervisor = supervisor;
    }

    public boolean isHR() {
        return isHR;
    }

    public void setHR(boolean isHR) {
        this.isHR = isHR;
    }

    public String getFullTimePartTime() {
        return fullTimePartTime;
    }

    public void setFullTimePartTime(String fullTimePartTime) {
        this.fullTimePartTime = fullTimePartTime;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getNcid() {
        return ncid;
    }

    public void setNcid(String ncid) {
        this.ncid = ncid;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return "EmployeeLog [agencyCode=" + agencyCode + ", agencyName=" + agencyName + ", divisionCode=" + divisionCode
                + ", divisionName=" + divisionName + ", email=" + email + ", firstName=" + firstName
                + ", fullTimePartTime=" + fullTimePartTime + ", id=" + id + ", isHR=" + isHR + ", lastName=" + lastName
                + ", timestamp=" + timestamp + ", middleName=" + middleName + ", ncid=" + ncid
                + ", supervisor=" + supervisor + ", userType=" + userType + ", username=" + username + ", workforceId="
                + workforceId + "]";
    }

}

