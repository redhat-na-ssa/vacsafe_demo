package com.redhat.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.NoResultException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redhat.vax.model.CovidTestResultDocument;
import com.redhat.vax.model.DocumentReviewOutcome;
import com.redhat.vax.model.DocumentTaskMapping;
import com.redhat.vax.model.Employee;
import com.redhat.vax.model.Exemptions;
import com.redhat.vax.model.PositiveTestResultLog;
import com.redhat.vax.model.VaccineCardDocument;

@RestController
@RequestMapping("/query")
public class QueryController {

    private static final Logger log = LoggerFactory.getLogger(QueryController.class);

    @Autowired
    private CustomQueryService queryService;

    @Autowired
    KeycloackAuthUtil authUtil;

    @GetMapping("employee/{id}")
    public ResponseEntity<Employee> getEmployee(Authentication authentication, @PathVariable String id) {
        String agencyName = authUtil.getAgencyName(authentication);
        try {
            return ResponseEntity.ok(queryService.getEmployee(id, agencyName));
        } catch(NoResultException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("document/{employeeId}/accepted")
    public ResponseEntity<Map<String, Object>> getAcceptedDocuments(
            Authentication authentication, 
            @PathVariable String employeeId) {
        
        String agencyName = authUtil.getAgencyName(authentication);

        List<CovidTestResultDocument> testResultDocs = queryService.getCovidTestResult(employeeId, agencyName);
        List<VaccineCardDocument> vaxDocs = queryService.getVaccineDocument(employeeId, DocumentReviewOutcome.ACCEPTED, agencyName);
        Map<String, Object> r = new HashMap<>();
        r.put("testResultDocuments", testResultDocs);
        r.put("vaccineDocuments", vaxDocs); 
        return ResponseEntity.ok(r);
    }

    @GetMapping("test-result-document/{employeeId}")
    public ResponseEntity<List<CovidTestResultDocument>> getTestResultDocuments(
            Authentication authentication,
            @PathVariable String employeeId) {
        
        String agencyName = authUtil.getAgencyName(authentication);
        List<CovidTestResultDocument> r = queryService.getCovidTestResult(employeeId, agencyName);
        return ResponseEntity.ok(r);
    }

    @GetMapping("vax-document/{employeeId}")
    public ResponseEntity<List<VaccineCardDocument>> getVaxDocuments(
            Authentication authentication,
            @PathVariable String employeeId) {
        
        String agencyName = authUtil.getAgencyName(authentication);
        return ResponseEntity.ok(queryService.getVaccineDocument(employeeId, agencyName));
    }

    @GetMapping("vax-document/{employeeId}/{status}")
    public ResponseEntity<List<VaccineCardDocument>> getVaxDocumentsByStatus(
            Authentication authentication,
            @PathVariable String employeeId,
            @PathVariable DocumentReviewOutcome status) {
        
        String agencyName = authUtil.getAgencyName(authentication);
        return ResponseEntity.ok(queryService.getVaccineDocument(employeeId, status, agencyName));
    }


    // @GetMapping("positive-result/agency/{agency}")
    // public ResponseEntity<List<PositiveTestResultLog>> getPositiveResultByAgency(
    //         Authentication authentication,
    //         @PathVariable String agency) {
        
    //     return ResponseEntity.ok(queryService.getPositiveTestResultByAgency(agency));
    // }

    @GetMapping("positive-results")
    public ResponseEntity<List<PositiveTestResultLog>> getPositiveResults(Authentication authentication) {
        
        String agencyName = authUtil.getAgencyName(authentication);
        return ResponseEntity.ok(queryService.getPositiveTestResultByAgency(agencyName));
    }

    @DeleteMapping("positive-result/{id}")
    public void deletePositiveResultByAgency(@PathVariable Long id) {
        queryService.deleteCovidPositiveTestResult(id);
    }

    @GetMapping("exemptions/employee/{employeeId}")
    public ResponseEntity<List<Exemptions>> getExemptionsByEmployeeId(
            Authentication authentication,
            @PathVariable String employeeId) {
        
        String agencyName = authUtil.getAgencyName(authentication);
        return ResponseEntity.ok(queryService.getExemptions(employeeId, agencyName));
    }

    @DeleteMapping("exemptions/{id}")
    public void deleteExemptions(@PathVariable Long id) {
        queryService.deleteExemptionsById(id);
    }

    @PostMapping("exemptions")
    public ResponseEntity<String> saveExemptions(@RequestBody Exemptions exemption) {
        try {
            queryService.saveExemptions(exemption);
            log.info("Successfully saved {}", exemption);
            return ResponseEntity.accepted().build();
        } catch(Exception e) {
            log.error("Error while saving Exemptions\n\t{}\n\t{}", e, exemption);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("task/document/{documentId}")
    public ResponseEntity<DocumentTaskMapping> getDocumentTaskMapping(
            Authentication authentication, 
            @PathVariable Long documentId) {
        
        //String agencyName = authUtil.getAgencyName(authentication);
        try {
            //return ResponseEntity.ok(queryService.getDocumentTaskMapping(documentId, agencyName));
            return ResponseEntity.ok(queryService.getDocumentTaskMapping(documentId));
        } catch(NoResultException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
