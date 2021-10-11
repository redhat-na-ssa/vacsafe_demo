package com.redhat.service;

import org.jbpm.services.api.ProcessService;
import org.keycloak.representations.AccessToken;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.redhat.service.document.DocumentService;
import com.redhat.vax.model.Attachment;
import com.redhat.vax.model.CovidTestResultDocument;
import com.redhat.vax.model.Document;
import com.redhat.vax.model.Employee;
import com.redhat.vax.model.VaccineCardDocument;

import static com.redhat.service.Constants.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/attestation")
public class AttestationController {

    private static final Logger log = LoggerFactory.getLogger(AttestationController.class);

    @Autowired
    private ProcessService processService;

    @Autowired
    private DocumentService documentService;

    @Autowired
    CustomQueryService customQueryService;

    @Autowired
    KeycloackAuthUtil authUtil;

    @Value("${s3.bucket.name}")
    private String bucketName;

    @Value("${com.redhat.vax.kjar.deployment.id}")
    private String deploymentId;

    @PostMapping("covid-test-result")
    public ResponseEntity<String> covidTestResultUpload
        (
            Authentication authentication,
            @RequestPart(name = EMPLOYEE_FIELD_NAME) Employee employeeIn,
            @RequestPart(name = DOCUMENT_FIELD_NAME) CovidTestResultDocument document,
            @RequestPart(name = ATTACHMENT_FIELD_NAME) MultipartFile file
        ) {

        try {

            validate(authentication, employeeIn, document);

            prepareDocumentAndPersistToStorage(document, employeeIn, file);

            // Start Process
            Map<String, Object> params = Collections.singletonMap("document", document);
            long pid = processService.startProcess(deploymentId, COVID_TEST_RESULT_SUBMISSION_WORKFLOW, params);
            log.info("COVID test result submission workflow started. PID: {} \n{}", pid, document);

            return ResponseEntity.accepted().build();
        } catch (AuthorizationException ae) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ae.getMessage());
        } catch (Exception e) {
            log.error("Error while processing COVID test result document\n\t{}\n\t{}", e, employeeIn, document);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("vax")
    public ResponseEntity<String> vaccineDocumentUpload
        (
            Authentication authentication,
            @RequestPart(name = EMPLOYEE_FIELD_NAME) Employee employeeIn,
            @RequestPart(name = DOCUMENT_FIELD_NAME) VaccineCardDocument document,
            @RequestPart(name = ATTACHMENT_FIELD_NAME) MultipartFile file
        ) {

        // String user = authUtil.getUser(authentication);
        // log.debug(">>> User: {} | Employee: {}", user, employeeIn);
        // if (!user.equals(employeeIn.getId())) {
        //     return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        // }
        try {
            prepareDocumentAndPersistToStorage(document, employeeIn, file);

            // Start Process
            Map<String, Object> params = Collections.singletonMap("document", document);
            long pid = processService.startProcess(deploymentId, VACCINE_CARD_REVIEW_WORKFLOW, params);
            log.info("Vaccine document submission workflow started. PID: {} \n{}", pid, document);

            return ResponseEntity.accepted().build();
        } catch (Exception e) {
            log.error("Error while processing vaccine document\n\t{}\n\t{}", e, employeeIn, document);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("attachment")
    public ResponseEntity<Resource> vaccineDocumentDownload(@RequestBody Attachment attachment) {
        try {
            return retrieveS3Document(attachment);
        }catch (Exception e){
            log.error("Error while retrieving s3 data {}", attachment);
            return ResponseEntity.badRequest().body(null);
        }
    }

    private ResponseEntity<Resource> retrieveS3Document(Attachment attachment){

        if(attachment == null){
            log.error("Error null attachment");
            throw new RuntimeException("Attachment is missing");
        }
        if(attachment.getS3UUID() == null){
            log.error("Error attachment.getS3UUID() = null");
            throw new RuntimeException("S3 uuid is missing");
        }

        String s3DocumentId = attachment.getS3UUID();
        byte[] bytes = documentService.get(s3DocumentId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment   .getOriginalFileName() + "\"")
                .body(new ByteArrayResource(bytes));
    }

    private void prepareDocumentAndPersistToStorage(
            Document document, 
            Employee employeeIn, 
            MultipartFile file) throws IOException {
        
        validate(employeeIn);
        validate(document);

        Employee employee = customQueryService.persistOrOverwriteEmployee(employeeIn);

        document.setEmployee(employee);

        document.setSubmissionDate(LocalDateTime.now());
        Attachment attachment = createAttachment(file);
        document.setAttachment(attachment);

        log.debug("prepareDocumentAndPersistToStorage()  bucket = : {}", bucketName);
        String s3uuid = documentService.put(file.getBytes());
        attachment.setS3UUID(s3uuid);
    }

    private Attachment createAttachment(MultipartFile file) {
        Attachment attachment = new Attachment();
        attachment.setOriginalFileName(file.getOriginalFilename());
        attachment.setContentType(file.getContentType());
        attachment.setSize(file.getSize());
        attachment.setS3BucketName(bucketName);
        return attachment;
    }

    private void validate(Document document) {
        List<String> validationErrors = document.validate();
        if (!validationErrors.isEmpty()) {
            String msg = validationErrors.stream().collect(Collectors.joining("\n", "Validation errors ...\n", ""));
            throw new IllegalArgumentException(msg);
        }
    }

    private void validate(Employee employee) {
        List<String> validationErrors = employee.validate();
        if (!validationErrors.isEmpty()) {
            String msg = validationErrors.stream().collect(Collectors.joining("\n", "Validation errors ...\n", ""));
            throw new IllegalArgumentException(msg);
        }
    }


    /**
     * Check if the employee first and last name match the one in sso token
     * @param authentication
     * @param employeeIn
     */
    private void validate(Authentication authentication, Employee employee, Document document) {
        if (document.getSubmittedBy() == null || document.getSubmittedBy().trim().isEmpty()) {
            AccessToken accessToken = authUtil.getAccessToken(authentication);
            String firstName = accessToken.getGivenName();
            String lastName  = accessToken.getFamilyName();
            log.debug("accessToken.getGivenName()={}", firstName);
            log.debug("accessToken.getFamilyName()={}", lastName);

            if (firstName != null && !firstName.equals(employee.getFirstName())) {
                throw new AuthorizationException("The employee first name in the payload '" + employee.getFirstName()
                        + "' does not match the one retrieved from sso token '" + firstName + "'");
            }

            if (lastName != null && !lastName.equals(employee.getLastName())) {
                throw new AuthorizationException("The employee last name in the payload '" + employee.getLastName()
                        + "' does not match the one retrieved from sso token '" + lastName + "'");
            }
        }
    }

}
