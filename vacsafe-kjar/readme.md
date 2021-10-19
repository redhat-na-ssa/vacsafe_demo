VacSafe KJAR
=======================


## Workflows Description

### Vaccine Document Review Workflow

This workflow is initiated after the employee submitted the vaccine document via the UI.

![](src/main/resources/com.redhat/vacsafe_kjar/vax_card_review_workflow-svg.svg)


### COVID Test Result Submission Workflow


This workflow is initiated after the employee submitted COVID test result document via the UI.

![](src/main/resources/com.redhat/vacsafe_kjar/covid_test_result_submission_workflow-svg.svg)

### COVID Test Result Review Workflow (Sampling)

This workflow is initiated via a job.

![](src/main/resources/com.redhat/vacsafe_kjar/covid_test_result_review_workflow-svg.svg)


## REST Endpoints

- [POST] <HOST>/attestation/vax
  - Start Vaccine document submission workflow
  - Return: 202 (Accepted) or 400 (Bad Request)

- [POST] <HOST>/attestation/covid-test-result
  - Start COVID test result document submission workflow
  - Return: 202 (Accepted) or 400 (Bad Request)

- [GET] <HOST>/rest/server/queries/tasks/instances/pot-owners
    - Return list of tasks claimable by the user

- [PUT] <HOST>/rest/server/containers/nc-vax-kjar-1_0-SNAPSHOT/tasks/<TASK_ID>/states/claimed
    - Claim the human task.

- [PUT] <HOST>/rest/server/containers/nc-vax-kjar-1_0-SNAPSHOT/tasks/<TASK_ID>/states/completed?auto-progress=true
    - Complete the human task.

A Postman collection containing the request including payload can be found [here](postman-collections/).


The section below provides example of request and response using *curl* command.

### Vaccine Document Submission

**Request**

```sh
curl --request POST 'http://nc-vax-service-nc-vax-demo.apps.dev-openshift.58rz.p1.openshiftapps.com/attestation/vax' \
    --form 'employeeId="employeeId"' \
    --form 'employeeEmail="e@nc.gov"' \
    --form 'employeeAgencyCode="a1"' \
    --form 'vaccineBrand="PFIZER"' \
    --form 'vaccineAdministrationDate="2021-08-22T20:54:48"' \
    --form 'vaccineShotNumber="1"' \
    --form 'attachment=@"/PATH_TO_FILE"' \
    --user user:user
```

**Response**

- 202 (Accepted): If the document is accepted
- 400 (Bad Request): when validation errors

### COVID Test Result Submission

```sh
curl --request POST 'http://nc-vax-service-nc-vax-demo.apps.dev-openshift.58rz.p1.openshiftapps.com/attestation/covid-test-result' \
    --form 'employeeId="employeeId"' \
    --form 'employeeEmail="@nc.gove"' \
    --form 'employeeAgencyCode="a1"' \
    --form 'testResultDate="2021-08-22T20:54:48"' \
    --form 'testResultOutcome="NEGATIVE"' \
    --form 'attachment=@"/PATH_TO_FILE"' \
    --user user:user
```

**Response**

- 202 (Accepted): If the document is accepted
- 400 (Bad Request): when the payload validation fails

### Get Task List

Get the list of tasks claimable by a user.

**Request**

```sh
curl --request GET 'http://nc-vax-service-nc-vax-demo.apps.dev-openshift.58rz.p1.openshiftapps.com/rest/server/queries/tasks/instances/pot-owners' \
    --header 'Accept: application/json' \
    --user user:user
```

**Response**

```json
{
    "task-summary": [
        {
            "task-id": 3,
            "task-name": "REVIEW VACCINATION CARD",
            "task-subject": "",
            "task-description": "",
            "task-status": "Ready",
            "task-priority": 0,
            "task-is-skipable": false,
            "task-actual-owner": null,
            "task-created-by": null,
            "task-created-on": {
                "java.util.Date": 1629813811035
            },
            "task-activation-time": {
                "java.util.Date": 1629813811035
            },
            "task-expiration-time": null,
            "task-proc-inst-id": 3,
            "task-proc-def-id": "vax_card_review_workflow",
            "task-container-id": "nc-vax-kjar-1_0-SNAPSHOT",
            "task-parent-id": -1,
            "correlation-key": "3",
            "process-type": 1
        },
        {
            "task-id": 1,
            "task-name": "REVIEW COVID TEST RESULT",
            "task-subject": "",
            "task-description": "",
            "task-status": "Ready",
            "task-priority": 0,
            "task-is-skipable": false,
            "task-actual-owner": null,
            "task-created-by": null,
            "task-created-on": {
                "java.util.Date": 1629813799661
            },
            "task-activation-time": {
                "java.util.Date": 1629813799661
            },
            "task-expiration-time": null,
            "task-proc-inst-id": 1,
            "task-proc-def-id": "covid_test_result_review_workflow",
            "task-container-id": "nc-vax-kjar-1_0-SNAPSHOT",
            "task-parent-id": -1,
            "correlation-key": "1",
            "process-type": 1
        }
    ]
}
```

### Claim a Task

**Request**

```sh
curl --request PUT 'http://nc-vax-service-nc-vax-demo.apps.dev-openshift.58rz.p1.openshiftapps.com/rest/server/containers/nc-vax-kjar-1_0-SNAPSHOT/tasks/1/states/claimed' \
    --user user:user
```

**Response**

- 201 (Created)

### Complete a Task

**Request**

```sh
curl --request PUT 'http://nc-vax-service-nc-vax-demo.apps.dev-openshift.58rz.p1.openshiftapps.com/rest/server/containers/nc-vax-kjar-1_0-SNAPSHOT/tasks/1/states/completed?auto-progress=true' \
    --header 'Content-Type: application/json' \
    --header 'Accept: application/json' \
    --user user:user \
    --data-raw '{
        "documentReview": {
            "com.redhat.vax.model.DocumentReview" : {
                "reviewerNCID": "ncid-1234",
                "outcome": "VALID",
                "reviewerNotes": "Reviewer notes here ..."
            }        
        }
}'
```

**Response**

- 201 (Created)
