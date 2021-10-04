package com.redhat.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.redhat.vax.model.Employee;
import com.redhat.vax.model.EmployeeDiff;
import com.redhat.vax.model.EmployeeLog;
import com.redhat.vax.model.EmployeeStatus;
import com.redhat.vax.model.Utils;

@Component
public class EmployeeService {

    private static final Logger log = LoggerFactory.getLogger(EmployeeService.class);

    @PersistenceContext
    EntityManager em;

    /**
     * Update employee non LDAP fields
     * 
     * @param employeeId     - The employee id
     * @param alternateEmail - The alternate email address
     * @param dob            - The date of birth
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Employee update(String employeeId, String alternateEmail, LocalDate dob) {

        Employee employee = em.find(Employee.class, employeeId);
        if (employee == null) {
            throw new RuntimeException("Cannot find employee with id '" + employeeId + "'");
        }

        boolean touched = false;
        if (dob != null) {
            if (!dob.equals(employee.getDateOfBirth())) {
                log.debug(">>> Updating employee DOB from {} to {}", employee.getDateOfBirth(), dob);
                employee.setDateOfBirth(dob);
                touched = true;
            }
        }

        if (alternateEmail != null && !alternateEmail.trim().isEmpty()) {
            if (!Utils.isEmailValid(alternateEmail)) {
                throw new RuntimeException("Invalid email address '" + alternateEmail+"'");
            }
            if (!alternateEmail.equals(employee.getAlternateEmail())) {
                log.debug(">>> Updating employee alternate email from {} to {}", 
                        employee.getAlternateEmail(),
                        alternateEmail);
                employee.setAlternateEmail(alternateEmail);
                touched = true;
            }
        }

        if (touched) {
            em.merge(employee);
        }

        return employee;
    }

    /**
     * Syncs employee retrieved from LDAP with the data base
     * 
     * @param employee
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sync(Employee ldapEmployee) {
        if (ldapEmployee == null) {
            throw new RuntimeException("Employee is null");
        }
        if (ldapEmployee.getId() == null || ldapEmployee.getId().trim().isEmpty()) {
            throw new RuntimeException("Employee id cannot be empty");
        }

        LocalDateTime updatedTime = LocalDateTime.now();

        try {
            Employee dbEmployee = em.find(Employee.class, ldapEmployee.getId());
            if (dbEmployee == null) {
                setEmployeeStatusToActive(ldapEmployee);
                // ldapEmployee.setLastUpdatedTime(updatedTime);
                em.persist(ldapEmployee);
                log.debug("New employee. {}", ldapEmployee);
            } else {
                EmployeeDiff diff = new EmployeeDiff(dbEmployee, ldapEmployee);
                if (diff.ldapFieldChanged()) {
                    log.debug("LDAP field(s) modified. \n>>> DB:\n{} \n>>> LDAP:\n{}", dbEmployee, ldapEmployee);

                    // Backup (employee log) and update LDAP fields
                    EmployeeLog employeeLog = dbEmployee.asEmployeeLog();
                    em.persist(employeeLog);

                    dbEmployee.overwriteLdapFields(ldapEmployee);
                } else {
                    log.debug("No LDAP modifications. \n>>> DB:\n{} \n>>> LDAP:\n{}", dbEmployee, ldapEmployee);
                }
                // Ensure employee status is ACTIVE
                // if (EmployeeStatus.ACTIVE != dbEmployee.getStatus()) {
                //     setEmployeeStatusToActive(dbEmployee);
                // }
                // Set last updated time and persist
                // dbEmployee.setLastUpdatedTime(updatedTime);
                em.merge(dbEmployee);

                // Handle workflows - Prevent changes/modification to existing records
                ldapSyncHandleModifications(diff, dbEmployee);
            }
        } catch (Exception e) {
            log.error("Error while syncing employee", e);
            throw e;
        }
    }

    private void setEmployeeStatusToActive(Employee employee) {
        // EmployeeStatusLog statusLog = new EmployeeStatusLog();
        // statusLog.setCurrentStatus(EmployeeStatus.ACTIVE);
        // statusLog.setPreviousStatus(employee.getStatus());
        // em.persist(statusLog);
        // employee.setStatus(EmployeeStatus.ACTIVE);
        // log.debug("Employee status changed. {}", statusLog);
    }

    private void ldapSyncHandleModifications(EmployeeDiff employeeDiff, Employee updatedEmployee) {
        if(employeeDiff.isAgencyNameChanged()) {
            ldapSyncHandleAgencyChange(updatedEmployee);
        } else if(employeeDiff.isEmailChanged()) {
            ldapSyncHandleEmailChange(updatedEmployee);
        }
    }

    private void ldapSyncHandleAgencyChange(Employee employee) {
        //TODO
    }

    private void ldapSyncHandleEmailChange(Employee employee) {
        //TODO
    }
}
