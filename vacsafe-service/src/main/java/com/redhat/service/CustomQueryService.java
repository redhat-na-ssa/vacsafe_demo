package com.redhat.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.redhat.vax.model.CovidTestResultDocument;
import com.redhat.vax.model.DocumentReviewOutcome;
import com.redhat.vax.model.DocumentTaskMapping;
import com.redhat.vax.model.Employee;
import com.redhat.vax.model.Exemptions;
import com.redhat.vax.model.PositiveTestResultLog;
import com.redhat.vax.model.VaccineCardDocument;


@Component
public class CustomQueryService {

    private static final Logger log = LoggerFactory.getLogger(CustomQueryService.class);

    @PersistenceContext
    EntityManager em;

    public DocumentTaskMapping getDocumentTaskMapping(Long documentId) {
        return em
            .createNamedQuery("document_task_mapping_by_document_id", DocumentTaskMapping.class)
            .setParameter("documentId", documentId)
            .getSingleResult();
    }

    public DocumentTaskMapping getDocumentTaskMapping(Long documentId, String agencyName) {
        return em
            .createNamedQuery("document_task_mapping_by_document_id_and_agency_name", DocumentTaskMapping.class)
            .setParameter("documentId", documentId)
            .setParameter("agencyName", agencyName)
            .getSingleResult();
    }

    public Employee getEmployee(String employeeId, String agencyName) {
        return em
            .createNamedQuery("employee_by_employee_id_and_agency_name", Employee.class)
            .setParameter("employeeId", employeeId)
            .setParameter("agencyName", agencyName)
            .getSingleResult();
    }

    /**
     *
     * @param employee
     * @return the employee that will be in the db after call, or null if couldn't talk to db.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Employee persistOrOverwriteEmployee(Employee employee) {
        if (employee.getId() == null || employee.getId().trim().isEmpty()) {
            throw new RuntimeException("Employee id cannot be empty");
        }
        Employee output = null;
        try {
            output = em.find(Employee.class, employee.getId());
            if (output == null) {
                em.persist(employee);
                output = employee;
            }
            else if (null != output && !output.equals(employee)) {
                // JIRA: COVIDSAFE-112 mshin changing logic thusly:
                // pull record down and determine if field is null/empty or populated
                // for data coming in, if it is not null or empty, overrwrite field.
                String employeeId = output.getId();

                output.setAgencyCode(getEmployeeValue(output.getAgencyCode(), employee.getAgencyCode(), employeeId,
                        "agencyCode"));
                output.setAgencyName(getEmployeeValue(output.getAgencyName(), employee.getAgencyName(), employeeId,
                        "agencyName"));
                output.setAlternateEmail(getEmployeeValue(output.getAlternateEmail(), employee.getAlternateEmail(), employeeId,
                        "alternateEmail"));
                output.setDateOfBirth(getEmployeeValue(output.getDateOfBirth(), employee.getDateOfBirth(), employeeId,
                        "dateOfBirth"));
                output.setDivisionCode(getEmployeeValue(output.getDivisionCode(), employee.getDivisionCode(), employeeId,
                        "divisionCode"));
                output.setDivisionName(getEmployeeValue(output.getDivisionName(), employee.getDivisionName(), employeeId,
                        "divisionName"));
                output.setEmail(getEmployeeValue(output.getEmail(), employee.getEmail(), employeeId,
                        "email"));
                output.setFirstName(getEmployeeValue(output.getFirstName(), employee.getFirstName(), employeeId,
                        "firstName"));
                output.setLastName(getEmployeeValue(output.getLastName(), employee.getLastName(), employeeId,
                        "lastName"));
                output.setSupervisor(getEmployeeValue(output.getSupervisor(), employee.getSupervisor(), employeeId,
                        "supervisor"));
                output.setHR(getEmployeeValue(output.isHR(), employee.isHR(), employeeId,
                        "isHR"));
                output = em.merge(output);
            }
        } catch (Exception e) {
            log.error("Error persisting/saving " + employee, e);
            throw e;
        }
        return output;
    }

    private boolean isEmpty(Object o) {
        return (null == o || "".equals(o.toString()));
    }

    private <T> T getEmployeeValue(T dbValue, T uiValue, String employeeId, String fieldName) {
        T output = dbValue;

        if (isEmpty(uiValue)) {
            return output;
        }
        if (!isEmpty(uiValue) && isEmpty(dbValue)) {
            output = uiValue;
        }
        if (!isEmpty(uiValue) && !isEmpty(dbValue)) {
            output = uiValue;
            if (log.isTraceEnabled())
                log.trace("overwriting " + fieldName + " with data: " + dbValue + " with UI data: " + uiValue
                        + " for employee " + employeeId);
        }
        return output;
    }

    public List<CovidTestResultDocument> getCovidTestResult(String employeeId, String agencyName) {
        return em
            .createNamedQuery("covid_test_result_doc_by_employee_id_and_agency_name", CovidTestResultDocument.class)
            .setParameter("employeeId", employeeId)
            .setParameter("agencyName", agencyName)
            .getResultList();
    }

    public List<VaccineCardDocument> getVaccineDocument(String employeeId, String agencyName) {
        return em
            .createNamedQuery("vax_doc_by_employee_id_and_agency_name", VaccineCardDocument.class)
            .setParameter("employeeId", employeeId)
            .setParameter("agencyName", agencyName)
            .getResultList();
    }

    public List<VaccineCardDocument> getVaccineDocument(
            String employeeId, 
            DocumentReviewOutcome status,
            String agencyName) {
        
        return em
            .createNamedQuery("vax_doc_by_employee_id_and_status_and_agency_name", VaccineCardDocument.class)
            .setParameter("employeeId", employeeId)
            .setParameter("status", status)
            .setParameter("agencyName", agencyName)
            .getResultList();
    }

    public List<PositiveTestResultLog> getPositiveTestResultByAgency(String agency) {
        return em
            .createNamedQuery("covid_positive_by_agency", PositiveTestResultLog.class)
            .setParameter("agency", agency)
            .getResultList();
    }

    public List<PositiveTestResultLog> getPositiveTestResultByAgencyName(String agencyName) {
        return em
            .createNamedQuery("covid_positive_by_agency_name", PositiveTestResultLog.class)
            .setParameter("agency", agencyName)
            .getResultList();
    }

    @Transactional
    public void deleteCovidPositiveTestResult(long id) {
        delete(PositiveTestResultLog.class, id);
    }

    public List<Exemptions> getExemptions(String employeeId, String agencyName) {
        return em
            .createNamedQuery("exemptions_by_employee_id_and_agency_name", Exemptions.class)
            .setParameter("employeeId", employeeId)
            .setParameter("agencyName", agencyName)
            .getResultList();
    }

    public void deleteExemptionsById(long id) {
        delete(Exemptions.class, id);
    }

    @Transactional
    private <T> void delete(Class<T> t, long id) {
        try {
            T p = em.find(t, id);
            if( p != null) {
                em.remove(p);
            }
        } catch(Exception e) {
            log.error("Error deleting {} {}", t, id);
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public Exemptions saveExemptions(Exemptions exemption) {
        try {
            Exemptions tmp = null;
            if(exemption.getId()==null) {
                em.persist(exemption);
            } else {
                tmp = em.find(Exemptions.class, exemption.getId());
                if(tmp == null) {
                    throw new RuntimeException("Cannot not merge. Exemption does not exist." + exemption);
                } else {
                    String employeeId = tmp.getEmployeeId();
                    if(employeeId != null && ! employeeId.equals(exemption.getEmployeeId())) {
                        throw new RuntimeException("Cannot save exemptions. Expected employee id: '"
                            +employeeId+"'. Found: '"+exemption.getEmployeeId()+"'");
                    }
                    tmp.setMask(exemption.isMask());
                    tmp.setTest(exemption.isTest());
                    tmp.setVaccine(exemption.isVaccine());
                    em.merge(tmp);
                }
            }
            return tmp;
        } catch(Exception e) {
            log.error("Error saving Exemptions", e);
            throw new RuntimeException(e);
        }
    }

}
