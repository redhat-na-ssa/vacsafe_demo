package com.redhat.service;

public final class Constants {

    public static final String ATTACHMENT_FIELD_NAME = "attachment";
    public static final String EMPLOYEE_FIELD_NAME = "employee";
    public static final String DOCUMENT_FIELD_NAME = "document";
    // public static final String VACCINE_DOCUMENT_FIELD_NAME = "document";
    // public static final String TEST_RESULT_DOCUMENT_FIELD_NAME = "document";

//    public static final String ATTESTATION_ATTACHMENT_FIELD_NAME = "attachment";

    public static final String ATTESTATION_TEST_RESULT_DATE_FIELD_NAME = "testResultDate";
    public static final String ATTESTATION_TEST_RESULT_OUTCOME_FIELD_NAME = "testResultOutcome";

    public static final String ATTESTATION_VAX_BRAND_FIELD_NAME = "vaccineBrand";
    public static final String ATTESTATION_VAX_DATE_FIELD_NAME = "vaccineAdministrationDate";
    public static final String ATTESTATION_VAX_SHOT_FIELD_NAME = "vaccineShotNumber";

    public static final String EMPLOYEE_ID_FIELD_NAME = "employeeId";
    public static final String EMPLOYEE_EMAIL_FIELD_NAME = "employeeEmail";
    public static final String EMPLOYEE_AGENCY_CODE_FIELD_NAME = "employeeAgencyCode";

    public static final String KJAR_DEPLOYMENT_ID = System.getProperty("com.redhat.vax.kjar.deployment.id", "vacsafe-kjar");
    public static final String VACCINE_CARD_REVIEW_WORKFLOW = "vax_card_review_workflow";
    public static final String COVID_TEST_RESULT_REVIEW_WORKFLOW = "covid_test_result_review_workflow";
    public static final String COVID_TEST_RESULT_SUBMISSION_WORKFLOW = "covid_test_result_submission_workflow";

    public static final String S3_DOCUMENT_PROVIDER_TYPE="s3";
    public static final String LOCAL_DOCUMENT_PROVIDER_TYPE="local";

    public static final String AWS_ACCESS_KEY_ID="AWS_ACCESS_KEY_ID";
    public static final String AWS_SECRET_ACCESS_KEY="AWS_SECRET_ACCESS_KEY";

    private Constants() {
    }

}
