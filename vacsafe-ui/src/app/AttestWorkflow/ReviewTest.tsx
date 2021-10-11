import * as React from 'react';
import {
  Button, 
  Card,
  CardFooter,
  CardBody,
  Form,
  FormGroup,
  TextInput
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { OutlinedPaperPlaneIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';
import CardWithTitle from '@app/Components/CardWithTitle';
import { convertBase64ToBlob, dateConvert } from "@app/utils/utils";
import authaxios from "@app/utils/axiosInterceptor";
import { useState } from 'react';
import { ResponseErrorModal } from '@app/Components/FeedbackModals';
import { useKeycloak } from "@react-keycloak/web";

const ReviewTest: React.FunctionComponent = () => {
  const history = useHistory();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
  const [errorState, setErrorState] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { keycloak } = useKeycloak();

  const testImage = sessionStorage.getItem("test_image_file") || "";
  const testImageFilename = sessionStorage.getItem("test_image_filename") || "";
  const employeeDOB = sessionStorage.getItem("dateOfBirth") || "";
  const altEmail = sessionStorage.getItem("alternateEmail") || "";
  const covidTestResult = sessionStorage.getItem("test_results") || "";
  const covidTestDate = sessionStorage.getItem("test_date") || "";
  
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeFirstName, setEmployeeFirstName] = useState("");
  const [employeeLastName, setEmployeeLastName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeAgency, setEmployeeAgency] = useState("");
  const [employeeDivision, setEmployeeDivision] = useState(""); 

  if(keycloak?.authenticated) {
    keycloak.loadUserProfile().then((profile) => {
      setEmployeeId(profile.attributes.workforceid[0]);
      setEmployeeName(profile.firstName + " " + profile.lastName);
      setEmployeeFirstName(profile.firstName || "");
      setEmployeeLastName(profile.lastName || "");
      setEmployeeEmail(profile.email || "");
      setEmployeeAgency(profile.attributes.agency[0]); 
      setEmployeeDivision(profile.attributes.division[0])
    })
  }

  const handleSubmit = ()=> {
    setIsFormSubmitting(true);
    const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : ""
    const attestUrl = pamBaseUrl + "/attestation/covid-test-result"
    const testCard = convertBase64ToBlob(testImage)
    const bodyFormData = new FormData();

    const employeeInfo = {
      "id": employeeId,
      "firstName": employeeFirstName,
      "lastName": employeeLastName,
      "dateOfBirth": employeeDOB,
      "email": employeeEmail,
      "alternateEmail": altEmail,
      "agencyCode": employeeAgency,
      "agencyName": employeeAgency,
      "divisionCode": employeeDivision
    }

    const testInfo = {
      "covidTestDate": covidTestDate,
      "covidTestResult": covidTestResult.toUpperCase()
    }

    bodyFormData.append('employee', new Blob([JSON.stringify(employeeInfo)], {type: "application/json"}) );
    bodyFormData.append('document', new Blob([JSON.stringify(testInfo)], {type: "application/json"}));
    bodyFormData.append('attachment', testCard);

    const headers = {
      'Content-Type': 'multipart/form-data;'
    }

    authaxios.post(attestUrl, bodyFormData, {
      headers: headers
    })
    .then(() => {
      setIsFormSubmitting(false);
      history.push('/thankyou');
    })
    .catch(res => {
      if(res.response) {
        setIsFormSubmitting(false);
        setErrorState(res.response.status);
        setIsErrorModalOpen(true);
      }
    })
  }

  return (
    <Card isRounded>
      <ResponseErrorModal 
        isModalOpen={isErrorModalOpen} 
        setIsModalOpen={setIsErrorModalOpen} 
        errorState={errorState}
      />
      <CardWithTitle
        title="Review Submission"
        info="Review your test result submission and validate that test result image matches displayed data. Please press Submit below to proceed."
      />
      <CardBody>
        <Form>
          <FormGroup label="Person ID" fieldId="review-test-form-employee-id">
            <TextInput
              aria-label="review-test-form-employee-id"
              isDisabled
              type="text"
              value={employeeId}
            />
          </FormGroup>
          <FormGroup
            fieldId="review-test-form-employee-full-name"
            label="Full Name"
          >
            <TextInput
              aria-label="review-test-form-employee-full-name"
              isDisabled
              type="text"
              value={employeeName}
            />
          </FormGroup>
          <FormGroup
            label="Date of Birth"
            fieldId="review-test-date-of-birth"
          >
            <TextInput
              aria-label="review-test-date-of-birth"
              isDisabled
              type="text"
              value={dateConvert(employeeDOB)}
            />
          </FormGroup>
          <FormGroup label="Test Results" fieldId="review-test-form-results">
            <TextInput
              aria-label="review-test-form-results"
              isDisabled
              type="text"
              value={sessionStorage.getItem("test_results") || ""}
            />
          </FormGroup>
          <FormGroup label="Test Date" fieldId="review-test-form-date">
            <TextInput
              aria-label="review-test-form-date"
              isDisabled
              type="text"
              value={dateConvert(sessionStorage.getItem("test_date") || "")}
            />
          </FormGroup>
          <FormGroup label="Alternative Email (optional)" fieldId="review-test-form-alternative-email">
            <TextInput
              aria-label="review-test-form-alternative-email"
              isDisabled
              type="text"
              value={altEmail}
            />
          </FormGroup>
          <FormGroup label="Image preview" fieldId="review-vax-image-preview">
            {testImage && testImageFilename.split('.').pop()?.toLowerCase() == "pdf" &&
              (typeof testImage !== "undefined" ? (
                <Button
                  icon={<ExternalLinkAltIcon />}
                  variant="link"
                  component="a"
                  href={URL.createObjectURL(convertBase64ToBlob(testImage))}
                  target="_blank"
                >
                  Test Result PDF
                </Button>
              ) : null)}
            {testImage && testImageFilename.split('.').pop()?.toLowerCase() != "pdf" &&
              (typeof testImage !== "undefined" ? (
                <div>
                  <img
                    src={URL.createObjectURL(convertBase64ToBlob(testImage))}
                    alt="test-results-image"
                  />
                </div>
              ) : null)}
          </FormGroup>
        </Form>
      </CardBody>
      <CardFooter>
        <Button
          icon={<OutlinedPaperPlaneIcon />}
          isDisabled={isFormSubmitting}
          isLoading={isFormSubmitting}
          onClick={handleSubmit}
          variant="primary"
        >
          Submit
        </Button>
        <Button onClick={() => history.push("/attest/test")} variant="plain">
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ReviewTest };
