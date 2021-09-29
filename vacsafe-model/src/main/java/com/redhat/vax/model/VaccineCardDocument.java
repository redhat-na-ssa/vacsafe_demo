package com.redhat.vax.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.persistence.Index;
import javax.persistence.NamedQuery;

@Entity
@Table(
    name = "cs_vaccine_document",
    indexes = {
        @Index(name = "idx_cs_vaccine_document_submitted_by", columnList = "submitted_by"),
        @Index(name = "idx_cs_vaccine_document_fully_vaccinated", columnList = "fully_vaccinated_flag"),
        @Index(name = "idx_cs_vaccine_document_brand", columnList = "brand"),
        @Index(name = "idx_cs_vaccine_document_administration_date", columnList = "administration_date"),
        @Index(name = "idx_cs_vaccine_document_shot_number", columnList = "shot_number")
    }
)
@NamedQuery(
    name = "vax_doc_by_employee_id", 
    query = "SELECT d FROM VaccineCardDocument d WHERE d.employee.id=:employeeId"
)
@NamedQuery(
    name = "vax_doc_by_employee_id_and_agency_name", 
    query = "SELECT d FROM VaccineCardDocument d WHERE d.employee.id=:employeeId and d.employee.agencyName=:agencyName"
)
@NamedQuery(
    name = "vax_doc_by_employee_id_and_status", 
    query = "SELECT d FROM VaccineCardDocument d WHERE d.employee.id=:employeeId and d.review.outcome=:status"
)
@NamedQuery(
    name = "vax_doc_by_employee_id_and_status_and_agency_name", 
    query = "SELECT d FROM VaccineCardDocument d WHERE d.employee.id=:employeeId and d.employee.agencyName=:agencyName and d.review.outcome=:status"
)
public class VaccineCardDocument extends Document implements Serializable {

    static final long serialVersionUID = 1L;

    @Column(name = "brand")
    @Enumerated(EnumType.STRING)
    private VaccineBrand vaccineBrand;

    @Column(name = "administration_date")
    private LocalDate vaccineAdministrationDate;

    @Column(name = "fully_vaccinated_flag")
    private Boolean fullVaccinatedFlag = false;

    @Column(name = "shot_number")
    private int vaccineShotNumber;

    public List<String> validate() {
        List<String> errors = super.validate();

        if(vaccineBrand == null) {
            errors.add("Vaccine brand is missing.");
        }
        if(vaccineAdministrationDate == null) {
            errors.add("Vaccine administration date is missing.");
        }
        if(vaccineShotNumber < 1 || vaccineShotNumber > 3) {
            errors.add("Invalid vaccine shot number '" + vaccineShotNumber +"'");
        }

        return errors;
    }

    public VaccineBrand getVaccineBrand() {
        return vaccineBrand;
    }

    public void setVaccineBrand(VaccineBrand vaccineBrand) {
        this.vaccineBrand = vaccineBrand;
    }

    public LocalDate getVaccineAdministrationDate() {
        return vaccineAdministrationDate;
    }

    public void setVaccineAdministrationDate(LocalDate vaccineAdministrationDate) {
        this.vaccineAdministrationDate = vaccineAdministrationDate;
    }

    public int getVaccineShotNumber() {
        return vaccineShotNumber;
    }

    public void setVaccineShotNumber(int vaccineShotNumber) {
        this.vaccineShotNumber = vaccineShotNumber;
    }

    public Boolean isFullVaccinatedFlag() {
        return fullVaccinatedFlag;
    }

    public void setFullVaccinatedFlag(Boolean fullVaccinatedFlag) {
        this.fullVaccinatedFlag = fullVaccinatedFlag;
    }

    @Override
    public String toString() {
        return "VaccineCardDocument [vaccineAdministrationDate=" + vaccineAdministrationDate + ", vaccineBrand="
                + vaccineBrand + ", vaccineShotNumber=" + vaccineShotNumber + " # " + super.toString() + "]";
    }

}
