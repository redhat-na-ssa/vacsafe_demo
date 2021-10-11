import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody
} from '@patternfly/react-core';
import authaxios from "@app/utils/axiosInterceptor";
import { ResponseErrorModal, GenericResponseModal } from '@app/Components/FeedbackModals';
import { dateConvert } from "@app/utils/utils";
import { useKeycloak } from "@react-keycloak/web";
import CovidTestForm from "@app/Components/CovidTestForm";

interface AppProps {
  closeParentModal: () => void;
}

const HRTestSubmit: React.FunctionComponent<AppProps> = (props:AppProps) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
  const [errorState, setErrorState] = useState(''); 
  const [reviewerEmployeeId, setReviewerEmployeeId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeDOB, setEmployeeDOB] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeFN, setEmployeeFN] = useState("");
  const [employeeLN, setEmployeeLN] = useState("");
  const [email, setEmail] = useState(""); 
  const [agency, setAgency] = useState(""); 
  const [division, setDivision] = useState(""); 
  const { keycloak } = useKeycloak();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  if(keycloak?.authenticated) {
    keycloak.loadUserProfile().then((profile) => {
      setReviewerEmployeeId(profile.attributes.workforceid[0]);
    })
  }

  useEffect(() => {
    const sessionEmployee = sessionStorage.getItem("searchResultInfo") || ""; 
    const employeeInfo = JSON.parse(sessionEmployee); 
    setEmployeeId(employeeInfo['id']);
    setEmployeeName(employeeInfo['firstName'] + " " + employeeInfo['lastName'])
    setEmployeeFN(employeeInfo['firstName']);
    setEmployeeLN(employeeInfo['lastName']);
    setEmployeeDOB(employeeInfo['dateOfBirth']);
    setEmail(employeeInfo['email']);
    setAgency(employeeInfo['agencyCode']);
    setDivision(employeeInfo['divisionCode']); 
  }, []);

  const onSubmit = (data) => {
    setIsFormSubmitting(true);
    const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : ""
    const attestUrl = pamBaseUrl + "/attestation/covid-test-result"
    const bodyFormData = new FormData();

    const employeeInfo = {
      "id": employeeId,
      "firstName": employeeFN,
      "lastName": employeeLN,
      "dateOfBirth": employeeDOB,
      "email": email,
      "alternateEmail": data["alternate_email"],
      "agencyCode": agency,
      "agencyName": agency,
      "divisionCode": division
    }

    const testInfo = {
      "covidTestDate": dateConvert(data["test_date"]),
      "covidTestResult": data["test_results"].toUpperCase(),
      "submittedBy": reviewerEmployeeId
    }

    bodyFormData.append('employee', new Blob([JSON.stringify(employeeInfo)], {type: "application/json"}) );
    bodyFormData.append('document', new Blob([JSON.stringify(testInfo)], {type: "application/json"}));
    bodyFormData.append('attachment', new Blob([]));

    const headers = {
      'Content-Type': 'multipart/form-data;'
    }

    authaxios.post(attestUrl, bodyFormData, {
      headers: headers
    })
    .then(() => {
      setIsFormSubmitting(false);
      setIsSuccessModalOpen(true);
    })
    .catch(res => {
      setIsFormSubmitting(false);
      if(res.response) {
        setErrorState(res.response.status);
        setIsErrorModalOpen(true);
      }
    })
  }

  const closeModals = (closeModal) => {
    setIsSuccessModalOpen(closeModal);
    props.closeParentModal(); 
  }

  return (
    <Card>
      <CardBody>
        <GenericResponseModal
          isModalOpen={isSuccessModalOpen}
          setIsModalOpen={closeModals}
          title="Submitted Successfully!"
          message="Case History Updated!"
        />
        <ResponseErrorModal 
          isModalOpen={isErrorModalOpen} 
          setIsModalOpen={setIsErrorModalOpen} 
          errorState={errorState}
        />
        <CovidTestForm
          isHRSubmit={true}
          employeeId={employeeId}
          employeeName={employeeName}
          employeeDOB={employeeDOB}
          onSubmit={onSubmit}
          isFormSubmitting={isFormSubmitting}
        />
      </CardBody>
    </Card>
  );
};

export { HRTestSubmit };