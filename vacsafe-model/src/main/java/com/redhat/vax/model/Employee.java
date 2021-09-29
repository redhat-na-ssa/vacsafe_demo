package com.redhat.vax.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Index;
import javax.persistence.NamedQuery;

@Entity
@Table(
    name = "cs_employee",
    indexes = {
        @Index(name = "idx_cs_employee_employee_email", columnList = "email"),
        @Index(name = "idx_cs_employee_employee_agency_code", columnList = "agency_code"),
        @Index(name = "idx_cs_employee_employee_agency_name", columnList = "agency_name"),
        @Index(name = "idx_cs_employee_employee_division_code", columnList = "division_code")
    }
)
@NamedQuery(
    name = "employee_by_employee_id_and_agency_name", 
    query = "SELECT d FROM Employee d WHERE d.id=:employeeId and d.agencyName=:agencyName"
)
public class Employee implements Serializable {

    static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String email;

    @Column(name = "alternate_email")
    private String alternateEmail;

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

    public int getAge() {
        if (dateOfBirth != null) {
            LocalDate today = LocalDate.now();
            Period p = Period.between(dateOfBirth, today);
            return p.getYears();
        } else {
            return -1;
        }
    }

    public int getAgeInMonth() {
        if (dateOfBirth != null) {
            LocalDate today = LocalDate.now();
            Period p = Period.between(dateOfBirth, today);
            return p.getMonths();
        } else {
            return -1;
        }
    }

    public List<String> validate() {
        List<String> errors = new ArrayList<>();

        if (Utils.isBlank(id)) {
            errors.add("Employee id is missing.");
        }
        if (Utils.isBlank(agencyCode)) {
            errors.add("Employee agency is missing.");
        }
        if (! Utils.isEmailBlankOrValid(email)) {
            errors.add("Invalid email address '" + email + "'");
        }
        if (! Utils.isEmailBlankOrValid(alternateEmail)) {
            errors.add("Invalid alternate email address '" + alternateEmail + "'");
        }
        if( Utils.isBlank(email) && Utils.isBlank(alternateEmail) ) {
            errors.add("Both email and alternate email are missing");
        }

        return errors;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAlternateEmail() {
        return alternateEmail;
    }

    public void setAlternateEmail(String alternateEmail) {
        this.alternateEmail = alternateEmail;
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

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((agencyCode == null) ? 0 : agencyCode.hashCode());
        result = prime * result + ((agencyName == null) ? 0 : agencyName.hashCode());
        result = prime * result + ((alternateEmail == null) ? 0 : alternateEmail.hashCode());
        result = prime * result + ((dateOfBirth == null) ? 0 : dateOfBirth.hashCode());
        result = prime * result + ((divisionCode == null) ? 0 : divisionCode.hashCode());
        result = prime * result + ((divisionName == null) ? 0 : divisionName.hashCode());
        result = prime * result + ((email == null) ? 0 : email.hashCode());
        result = prime * result + ((firstName == null) ? 0 : firstName.hashCode());
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + (isHR ? 1231 : 1237);
        result = prime * result + ((lastName == null) ? 0 : lastName.hashCode());
        result = prime * result + ((supervisor == null) ? 0 : supervisor.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Employee other = (Employee) obj;
        if (agencyCode == null) {
            if (other.agencyCode != null)
                return false;
        } else if (!agencyCode.equals(other.agencyCode))
            return false;
        if (agencyName == null) {
            if (other.agencyName != null)
                return false;
        } else if (!agencyName.equals(other.agencyName))
            return false;
        if (alternateEmail == null) {
            if (other.alternateEmail != null)
                return false;
        } else if (!alternateEmail.equals(other.alternateEmail))
            return false;
        if (dateOfBirth == null) {
            if (other.dateOfBirth != null)
                return false;
        } else if (!dateOfBirth.equals(other.dateOfBirth))
            return false;
        if (divisionCode == null) {
            if (other.divisionCode != null)
                return false;
        } else if (!divisionCode.equals(other.divisionCode))
            return false;
        if (divisionName == null) {
            if (other.divisionName != null)
                return false;
        } else if (!divisionName.equals(other.divisionName))
            return false;
        if (email == null) {
            if (other.email != null)
                return false;
        } else if (!email.equals(other.email))
            return false;
        if (firstName == null) {
            if (other.firstName != null)
                return false;
        } else if (!firstName.equals(other.firstName))
            return false;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (isHR != other.isHR)
            return false;
        if (lastName == null) {
            if (other.lastName != null)
                return false;
        } else if (!lastName.equals(other.lastName))
            return false;
        if (supervisor == null) {
            if (other.supervisor != null)
                return false;
        } else if (!supervisor.equals(other.supervisor))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Employee [id="+id+", agencyCode=" + agencyCode + ", agencyName=" + agencyName + ", alternateEmail="
                + alternateEmail + ", dateOfBirth=" + dateOfBirth + ", divisionCode=" + divisionCode + ", divisionName="
                + divisionName + ", email=" + email + ", firstName=" + firstName
                + ", isHR=" + isHR + ", lastName=" + lastName + ", supervisor=" + supervisor + "]";
    }
}

