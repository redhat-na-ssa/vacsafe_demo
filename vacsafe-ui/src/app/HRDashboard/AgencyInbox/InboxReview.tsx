import * as React from 'react';
import { useEffect } from 'react';
import { 
  Button,
  Card, 
  CardBody, 
  CardFooter,
  Grid,
  GridItem,
  Split,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { CheckCircleIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import authaxios from "@app/utils/axiosInterceptor";
import ReviewInfoCard from '@app/Components/ReviewInfoCard';
import EmployeeInfoCard from '@app/Components/EmployeeInfoCard';
import { ResponseErrorModal } from '@app/Components/FeedbackModals';
import DeclineReasonModal from '@app/Components/DeclineReasonModal';
import { useKeycloak } from "@react-keycloak/web";

const InboxReview: React.FunctionComponent = () => {

  const history = useHistory();
  const { keycloak } = useKeycloak();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false); 
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorState, setErrorState] = useState(''); 
  const [isCovidReport, setIsCovidReport] = useState(false); 
  const [vaxBrand, setVaxBrand] = useState("");
  const [vaxDate, setVaxDate] = useState(""); 
  const [rejectReason, setRejectReason] = useState("Reviewer notes here ..."); 
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDOB, setEmployeeDOB] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeAgency, setEmployeeAgency] = useState("");
  const [employeeDivision, setEmployeeDivision] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentType, setAttachmentType] = useState(""); 
  const [reviewerEmployeeId, setReviewerEmployeeId] = useState("");

  const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : ""
  const containerId = window.REACT_APP_PAM_CONTAINER_ID ? window.REACT_APP_PAM_CONTAINER_ID : ""
  const baseURL = pamBaseUrl + "/rest/server/containers"

  if(keycloak?.authenticated) {
    keycloak.loadUserProfile().then((profile) => {
      setReviewerEmployeeId(profile.attributes.workforceid[0]);
    })
  }

  useEffect(() => {
    const taskNumber = sessionStorage.getItem("approveId")
    const fullUrl = baseURL + "/" + containerId + "/tasks/" + taskNumber + "?withInputData=true&withOutputData=true&withAssignments=true"

    const headers = {
      'Accept': 'application/json'
    }

    authaxios.get(fullUrl, {
      headers: headers
    })
    .then(res => {
      const resData = res.data['task-input-data']['document'];
      const infoEntries = resData['com.redhat.vax.model.VaccineCardDocument'];
      const employeeInfo = infoEntries['employee']['com.redhat.vax.model.Employee']
      const vaccineBrand = infoEntries['vaccineBrand']['com.redhat.vax.model.VaccineBrand']
      const vaccineShotDate = infoEntries['vaccineAdministrationDate']
      const dateOfBirth = employeeInfo['dateOfBirth']
      const resAttachment = infoEntries['attachment']['com.redhat.vax.model.Attachment']
      setIsCovidReport(false)
      setVaxBrand(vaccineBrand)
      setEmployeeId(employeeInfo['id'])
      setEmployeeName(employeeInfo['firstName'] + " " + employeeInfo['lastName'])
      if (dateOfBirth != null) {
        setEmployeeDOB(dateOfBirth['year'] + "-" + dateOfBirth['monthValue'] + "-" + dateOfBirth['dayOfMonth'])
      }
      setEmployeeEmail(employeeInfo['alternateEmail'] ? employeeInfo['alternateEmail'] : (employeeInfo['email'] ? employeeInfo['email'] : "Not Provided"));
      setEmployeeAgency(employeeInfo['agencyCode'])
      setEmployeeDivision(employeeInfo['divisionCode'])
      setVaxDate(vaccineShotDate['year'] + "-" + vaccineShotDate['monthValue'] + "-" + vaccineShotDate['dayOfMonth'])

      authaxios.post(pamBaseUrl + "/attestation/attachment", resAttachment, {
        responseType: 'arraybuffer'
      })
      .then(res => {
        setAttachment(res['data']);
        setAttachmentType(res.headers['content-type']);
      })
    })
  }, [baseURL, containerId, pamBaseUrl]);

  function sendReview(accepted: boolean) {
    setIsFormSubmitting(true)
    const taskNumber = sessionStorage.getItem("approveId")
    const taskUrl = baseURL + "/" + containerId + "/tasks/" + taskNumber + "/states"
    const outcome = accepted ? "ACCEPTED" : "DECLINED"

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const acceptData = {
      "documentReview": {
        "com.redhat.vax.model.DocumentReview" : {
            "reviewerEmployeeId": reviewerEmployeeId,
            "outcome": outcome,
            "reviewerNotes": rejectReason,
            "rejectReason": rejectReason
        }        
      }
    }

    authaxios.put(taskUrl + "/completed?auto-progress=true", acceptData, {
      headers: headers
    })
    .then(() => {
      history.push("/hrpanels")
    })
    .catch(res => {
      if(res.response) {
        setErrorState(res.response.status);
        setIsErrorModalOpen(true);
      }
    }).finally(()=> {
      setIsDeclineModalOpen(false)
      setIsFormSubmitting(false)
    })
  }

  const releaseTask = () => {
    const taskNumber = sessionStorage.getItem("approveId")
    const taskUrl = baseURL + "/" + containerId + "/tasks/" + taskNumber + "/states"

    authaxios.put(taskUrl + "/released")
    .then(() => {
      history.push("/hrpanels")
    })
    .catch(() => {
      history.push("/hrpanels")
    })
  }

  return (
    <>
      <ResponseErrorModal 
        isModalOpen={isErrorModalOpen} 
        setIsModalOpen={setIsErrorModalOpen} 
        errorState={errorState}
      />
      <DeclineReasonModal 
        isModalOpen={isDeclineModalOpen}
        isSendingReview={isFormSubmitting}
        setIsModalOpen={setIsDeclineModalOpen}
        setRejectReason={setRejectReason}
        sendReview={sendReview}
      />
      <Card isRounded>
        {
          isCovidReport &&
          <CardWithTitle title="HR Review" info="Review COVID Results"/>
        }
        {
          !isCovidReport &&
          <CardWithTitle title="HR Review" info="Review Vaccination Record"/>
        }
        <CardBody>
          <Grid hasGutter>
            <GridItem rowSpan={2} span={6}> 
            {
              attachment && attachmentType != 'application/pdf' &&
              <img src={URL.createObjectURL(new Blob([attachment]))} /> 
            }
            {
              attachment && attachmentType == 'application/pdf' &&
              (
                <Button
                  icon={<ExternalLinkAltIcon />}
                  variant="link"
                  component="a"
                  href={URL.createObjectURL(new Blob([attachment], {type: 'application/pdf'}))}
                  target="_blank"
                >
                  {isCovidReport ? "Test Result PDF" : "Vaccination Card PDF"}
                </Button>
              )
            }
            </GridItem>
            <GridItem span={6}> 
              <ReviewInfoCard
                reviewType="VAX"
                vaccineBrand={vaxBrand}
                vaccineDate={vaxDate}
              />
              <EmployeeInfoCard 
                employeeId={employeeId}
                employeeName={employeeName}
                employeeDOB={employeeDOB}
                employeeEmail={employeeEmail}
                employeeAgency={employeeAgency}
                employeeDivision={employeeDivision}
              />
            </GridItem>
          </Grid>
        </CardBody>
        <CardFooter>
          <Split hasGutter>
            <Button 
              icon={<CheckCircleIcon />}
              isDisabled={isFormSubmitting}
              isLoading={isFormSubmitting}
              onClick={() => sendReview(true)}
              variant="primary" 
            >
              Accept
            </Button>
            <Button 
              icon={<ErrorCircleOIcon />} 
              variant="danger" 
              onClick = {() => setIsDeclineModalOpen(true)}
            >
              Decline
            </Button>
            <Button 
              variant="plain" 
              onClick={() => releaseTask()}
            >
              Back
            </Button>
          </Split>
        </CardFooter>
      </Card>
    </>
  );
}

export { InboxReview };
