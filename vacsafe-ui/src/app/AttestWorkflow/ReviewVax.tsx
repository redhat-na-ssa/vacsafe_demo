import React, { useState } from "react";
import {
  Card,
  CardFooter,
  CardBody,
  Button,
  Form,
  FormGroup,
  TextInput
} from "@patternfly/react-core";
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { OutlinedPaperPlaneIcon } from "@patternfly/react-icons";
import { useHistory } from "react-router-dom";
import { convertBase64ToBlob, dateConvert } from "@app/utils/utils";
import authaxios from "@app/utils/axiosInterceptor";
import { ResponseErrorModal } from '@app/Components/FeedbackModals';
import { useKeycloak } from "@react-keycloak/web";
import CardWithTitle from "@app/Components/CardWithTitle";

const ReviewVax: React.FunctionComponent = () => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorState, setErrorState] = useState("");
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const employeeDOB = sessionStorage.getItem("dateOfBirth") || "";
  const vaccine = sessionStorage.getItem("vaccine") || "";
  const shotDate1 = sessionStorage.getItem("vax_date_1") || "";
  const shotDate2 = sessionStorage.getItem("vax_date_2") || "";
  const vaxImage = sessionStorage.getItem("vax_image") || "";
  const vaxFilename = sessionStorage.getItem("vax_image_filename") || "";
  const altEmail = sessionStorage.getItem("alternateEmail") || "";
  const history = useHistory();
  const { keycloak } = useKeycloak();

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

  const formSubmitSuccess = () => {
    setIsFormSubmitting(false);
    history.push("/thankyou");
  }
  const handleSubmit = () => {
    setIsFormSubmitting(true);
    const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : "";
    const attestUrl = pamBaseUrl + "/attestation/vax";
    const vaxCard = convertBase64ToBlob(vaxImage);
    const bodyFormData1 = new FormData();
    const bodyFormData2 = new FormData();

    const employeeInfo = {
      id: employeeId,
      firstName: employeeFirstName,
      lastName: employeeLastName,
      dateOfBirth: employeeDOB,
      email: employeeEmail,
      alternateEmail: altEmail,
      agencyCode: employeeAgency,
      agencyName: employeeAgency,
      divisionCode: employeeDivision,
    };

    const vaxInfo1 = {
      vaccineBrand: vaccine.toUpperCase(),
      vaccineAdministrationDate: shotDate1,
      vaccineShotNumber: 1,
    };

    const vaxInfo2 = {
      vaccineBrand: vaccine.toUpperCase(),
      vaccineAdministrationDate: shotDate2,
      vaccineShotNumber: 2,
    };

    bodyFormData1.append(
      "employee",
      new Blob([JSON.stringify(employeeInfo)], { type: "application/json" })
    );
    bodyFormData1.append(
      "document",
      new Blob([JSON.stringify(vaxInfo1)], { type: "application/json" })
    );
    bodyFormData1.append("attachment", vaxCard);

    bodyFormData2.append(
      "employee",
      new Blob([JSON.stringify(employeeInfo)], { type: "application/json" })
    );
    bodyFormData2.append(
      "document",
      new Blob([JSON.stringify(vaxInfo2)], { type: "application/json" })
    );
    bodyFormData2.append("attachment", vaxCard);

    const headers = {
      "Content-Type": "multipart/form-data;",
    };

    authaxios.post(attestUrl, bodyFormData1, {
        headers: headers
      })
      .then(() => {
        if (shotDate2) {
          authaxios.post(attestUrl, bodyFormData2, {
              headers: headers
            })
            .then(() => {
              formSubmitSuccess();
            })
            .catch((res) => {
              if (res.response) {
                setIsFormSubmitting(false);
                setErrorState(res.response.status);
                setIsErrorModalOpen(true);
              }
            });
        } else {
          formSubmitSuccess();
        }
      })
      .catch((res) => {
        if (res.response) {
          setIsFormSubmitting(false);
          setErrorState(res.response.status);
          setIsErrorModalOpen(true);
        }
      });
  }

  return (
    <Card isRounded>
      <ResponseErrorModal 
        isModalOpen={isErrorModalOpen} 
        setIsModalOpen={setIsErrorModalOpen} 
        errorState={errorState}
      />
      <CardWithTitle
        title="Review Vaccination Submission"
        info="Please review your vaccination record submission and validate that card image matches displayed data or it will be rejected. Please press Submit below to proceed."
      />
      <CardBody>
        <Form>
          <FormGroup label="Person ID" fieldId="review-vax-form-employee-id">
            <TextInput
              aria-label="review-vax-form-employee-id"
              isDisabled
              type="text"
              value={employeeId}
            />
          </FormGroup>
          <FormGroup
            fieldId="review-vax-form-employee-full-name"
            label="Full Name"
          >
            <TextInput
              aria-label="review-vax-form-employee-full-name"
              isDisabled
              type="text"
              value={employeeName}
            />
          </FormGroup>
          <FormGroup
            label="Date of Birth"
            fieldId="review-vax-form-date-of-birth"
          >
            <TextInput
              aria-label="review-vax-form-date-of-birth"
              isDisabled
              type="text"
              value={dateConvert(employeeDOB)}
            />
          </FormGroup>
          <FormGroup label="Vaccine" fieldId="review-vax-form-vaccine-brand">
            <TextInput
              aria-label="review-vax-form-vaccine-brand"
              isDisabled
              type="text"
              value={
                vaccine.localeCompare("Johnson") ? vaccine : "Johnson & Johnson"
              }
            />
          </FormGroup>
          <FormGroup
            label="Date of Shot 1"
            fieldId="review-vax-form-shot-1-date"
          >
            <TextInput
              aria-label="review-vax-form-shot-1-date"
              isDisabled
              type="text"
              value={dateConvert(shotDate1)}
            />
          </FormGroup>
          <FormGroup
            label="Date of Shot 2 (if applicable)"
            fieldId="review-vax-form-shot-2-date"
          >
            <TextInput
              aria-label="review-vax-form-shot-2-date"
              isDisabled
              type="text"
              value={dateConvert(shotDate2)}
            />
          </FormGroup>
          <FormGroup
            label="Alternative Email (optional)"
            fieldId="review-alternative-email"
          >
            <TextInput
              aria-label="review-vax-form-alternative-email"
              isDisabled
              type="text"
              value={altEmail}
            />
          </FormGroup>
          <FormGroup label="Image preview" fieldId="review-vax-image-preview">
            {vaxImage && vaxFilename.split('.').pop()?.toLowerCase() == "pdf" && (typeof vaxImage !== "undefined" ? (
                <Button
                  icon={<ExternalLinkAltIcon />}
                  variant="link"
                  component="a"
                  href={URL.createObjectURL(convertBase64ToBlob(vaxImage))}
                  target="_blank"
                >
                  Vaccination Card PDF
                </Button>
            ) : null)}
            {vaxImage && vaxFilename.split('.').pop()?.toLowerCase() != "pdf" &&
              (typeof vaxImage !== "undefined" ? (
                <div>
                  <img
                    src={URL.createObjectURL(convertBase64ToBlob(vaxImage))}
                    alt="vaccination-card"
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
          variant="primary"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button variant="plain" onClick={() => history.push("/attest/vax")}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ReviewVax };
