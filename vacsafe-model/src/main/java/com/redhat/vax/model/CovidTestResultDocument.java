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
    name = "cs_test_result_document",
    indexes = {
        @Index(name = "idx_cs_test_result_document_submitted_by", columnList = "submitted_by"),
        @Index(name = "idx_cs_test_result_document_test_date", columnList = "test_date"),
        @Index(name = "idx_cs_test_result_document_test_result", columnList = "test_result")
    }
)
@NamedQuery(
    name = "covid_test_result_doc_by_employee_id", 
    query = "SELECT d FROM CovidTestResultDocument d WHERE d.employee.id=:employeeId"
)
@NamedQuery(
    name = "covid_test_result_doc_by_employee_id_and_agency_name", 
    query = "SELECT d FROM CovidTestResultDocument d WHERE d.employee.id=:employeeId and d.employee.agencyName=:agencyName"
)
public class CovidTestResultDocument extends Document implements Serializable {

    static final long serialVersionUID = 1L;

    @Column(name = "test_date")
    private LocalDate covidTestDate;

    @Column(name = "test_result")
    @Enumerated(EnumType.STRING)
    private CovidTestResult covidTestResult;

    public List<String> validate() {
        List<String> errors = super.validate();

        if(covidTestDate == null) {
            errors.add("COVID test result date is missing.");
        }
        if(covidTestResult == null) {
            errors.add("COVID test result outcome is missing.");
        }

        return errors;
    }

    public LocalDate getCovidTestDate() {
        return covidTestDate;
    }

    public void setCovidTestDate(LocalDate covidTestDate) {
        this.covidTestDate = covidTestDate;
    }

    public CovidTestResult getCovidTestResult() {
        return covidTestResult;
    }

    public void setCovidTestResult(CovidTestResult covidTestResult) {
        this.covidTestResult = covidTestResult;
    }

    @Override
    public String toString() {
        return "CovidTestResultDocument [covidTestDate=" + covidTestDate + ", covidTestResult=" + covidTestResult
                + " # " + super.toString() + "]";
    }

}
