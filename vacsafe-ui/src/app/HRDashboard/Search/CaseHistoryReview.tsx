import * as React from 'react';
import { useEffect } from 'react';
import { 
  Button,
  Card, 
  CardBody, 
  CardFooter,
  Grid,
  Flex,
  FlexItem,
  GridItem
} from '@patternfly/react-core';
import { CheckCircleIcon, ErrorCircleOIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import authaxios from "@app/utils/axiosInterceptor";
import EmployeeInfoCard from '@app/Components/EmployeeInfoCard';
import ReviewInfoCard from '@app/Components/ReviewInfoCard';
import { ResponseErrorModal } from '@app/Components/FeedbackModals';
import DeclineReasonModal from '@app/Components/DeclineReasonModal';
import { useKeycloak } from "@react-keycloak/web";

const CaseHistoryReview: React.FunctionComponent = () => {

  const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : "";
  const containerId = window.REACT_APP_PAM_CONTAINER_ID ? window.REACT_APP_PAM_CONTAINER_ID : ""
  const baseURL = pamBaseUrl + "/rest/server/containers"

  const history = useHistory();
  const { keycloak } = useKeycloak();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false); 
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
  const [errorState, setErrorState] = useState(''); 

  const [reviewerEmployeeId, setReviewerEmployeeId] = useState("");

  const [historyType, setHistoryType] = useState(""); 
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeDOB, setEmployeeDOB] = useState("");
  const [employeeAgency, setEmployeeAgency] = useState("");
  const [employeeDivision, setEmployeeDivision] = useState("");

  const [vaxBrand, setVaxBrand] = useState("");
  const [vaxDate, setVaxDate] = useState(""); 
  const [reviewer, setReviewer] = useState(""); 
  const [taskId, setTaskId] = useState("");
  const [isPendingReview, setIsPendingReview] = useState(false)
  const [rejectReason, setRejectReason] = useState("Reviewer notes here ..."); 
  const [testResult, setTestResult] = useState(""); 
  const [testDate, setTestDate] = useState("");

  const [isExempt, setIsExempt] = useState(false)
  const [isVaxExempt, setIsVaxExempt] = useState(false);
  const [isTestExempt, setIsTestExempt] = useState(false);
  const [isMaskExempt, setIsMaskExempt] = useState(false);

  const [attachment, setAttachment] = useState(""); 
  const [attachmentType, setAttachmentType] = useState(""); 

  const [submittedBy, setSubmittedBy] = useState("");

  if(keycloak?.authenticated) {
    keycloak.loadUserProfile().then((profile) => {
      setReviewerEmployeeId(profile.attributes.workforceid[0]);
    })
  }

  useEffect(() => {

    const reviewType = sessionStorage.getItem("caseHistoryType") || "";
    const sessionReivewData = sessionStorage.getItem("caseHistoryInfo") || "";
    const reviewData = JSON.parse(sessionReivewData);
    const employeeInfo = reviewType.includes('EXM') ? reviewData : reviewData['employee'];
    const attachment = reviewData['attachment']

    setEmployeeId(employeeInfo['id'])
    setEmployeeName(employeeInfo['firstName'] + " " + employeeInfo['lastName'])
    setEmployeeDOB(employeeInfo['dateOfBirth'])
    setEmployeeEmail(employeeInfo['alternateEmail'] ? employeeInfo['alternateEmail'] : (employeeInfo['email'] ? employeeInfo['email'] : "Not Provided"));
    setEmployeeAgency(employeeInfo['agencyCode'])
    setEmployeeDivision(employeeInfo['divisionCode'])
    setSubmittedBy(reviewData['submittedBy']); 

    if(reviewType.includes('TEST')){
      setHistoryType("TEST")
      setTestResult(reviewData['covidTestResult']);
      setTestDate(reviewData['covidTestDate']);
    }
    else if(reviewType.includes('VAX')) {
      setHistoryType("VAX")
      setVaxBrand(reviewData['vaccineBrand']);
      setVaxDate(reviewData['vaccineAdministrationDate']);

      if(reviewData['review']){
        setReviewer(reviewData['review']['reviewerEmployeeId']); 
      }
      else {
        if(!reviewData['autoApproved']) {
          authaxios.get(pamBaseUrl + '/query/task/document/' + reviewData['id'])
          .then(res => {
            setIsPendingReview(true);
            setTaskId(res['data']['taskId']);
          })
        }
      }
    }
    else if(reviewType.includes('EXM')) {
      const sessionReivewData = sessionStorage.getItem("caseHistoryExmData") || "";
      const exemptData = JSON.parse(sessionReivewData)
      setHistoryType("EXM")
      setIsExempt(true)
      setIsVaxExempt(exemptData['vaccine'])
      setIsMaskExempt(exemptData['mask'])
      setIsTestExempt(exemptData['test'])
    }

    if(reviewType.includes('TEST') || reviewType.includes('VAX')) {
      authaxios.post(pamBaseUrl + "/attestation/attachment", attachment, {
        responseType: 'arraybuffer'
      })
      .then(res => {
        setAttachment(res['data']);
        setAttachmentType(res.headers['content-type']);
      })
    }
  }, [pamBaseUrl]);

  const sendReview = (accepted: boolean) => {
    setIsFormSubmitting(true)
    const taskUrl = baseURL + "/" + containerId + "/tasks/" + taskId + "/states"
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

    authaxios.put(taskUrl + "/claimed", {}, {
      headers: headers
    })
    .then(() => {
      authaxios.put(taskUrl + "/completed?auto-progress=true", acceptData, {
        headers: headers
      })
      .then(() => {
        history.push("/casehistory")
      })
      .catch(res => {
        if(res.response) {
          setErrorState(res.response.status);
          setIsErrorModalOpen(true);
        }
      })
    })
    .catch(res => {
      if(res.response) {
        setErrorState(res.response.status);
        setIsErrorModalOpen(true);
      }
    }).finally(() => {
      setIsFormSubmitting(false)
    })
  }

  const ReviewHeader = () => {
    if (historyType === "TEST") {
      return <CardWithTitle title="Case History Review" info="View COVID Test Results"/>;
    }
    else if (historyType === "VAX") {
      return <CardWithTitle title="Case History Review" info="View Vaccination Record"/>;
    }
    else {
      return <CardWithTitle title="Case History Review" info="View Exemption Record"/>;
    }
  }

  const ReviewInfo = () => {
    if (historyType === "TEST") {
      return (             
        <ReviewInfoCard
          reviewType="TEST"
          covidTestResult={testResult}
          covidTestDate={testDate}
          submittedBy={submittedBy}
          reviewer={reviewer}
        />
      )
    }
    else if (historyType === "VAX") {
      return (
        <ReviewInfoCard
          reviewType="VAX"
          vaccineBrand={vaxBrand}
          vaccineDate={vaxDate}
          submittedBy={submittedBy}
          reviewer={reviewer}
        />
      )
    }
    else {
      return (
        <ReviewInfoCard
          reviewType="EXM"
          isVaxExempt={isVaxExempt}
          isMaskExempt={isMaskExempt}
          isTestExempt={isTestExempt}
          submittedBy={submittedBy}
          reviewer={reviewer}
        />
      )
    }
  }

  return (
    <Card isRounded>
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
      <ReviewHeader />
      <CardBody>
        <Grid hasGutter>
          {
            !isExempt &&
            (
              <GridItem rowSpan={2} span={6}> 
                {
                  submittedBy ? "No Image - Submitted By HR" : 
                  attachmentType == "application/pdf" ?
                  (
                    <Button
                      icon={<ExternalLinkAltIcon />}
                      variant="link"
                      component="a"
                      href={URL.createObjectURL(new Blob([attachment], {type: 'application/pdf'}))}
                      target="_blank"
                    >
                      {historyType === "TEST" ? "Test Result PDF" : "Vaccination Card PDF"}
                    </Button>
                  )
                  :
                  <img src={URL.createObjectURL(new Blob([attachment]))} /> 
                }
              </GridItem>
            )
          }
          <GridItem span={6}> 
            <ReviewInfo />
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
        <Flex>
          <FlexItem align={{ default: "alignLeft" }}>
            <Button 
              variant="plain" 
              onClick={() => history.push("/casehistory")
            }>
              Back
            </Button>
          </FlexItem>
          {
            isPendingReview &&
            <>
              <FlexItem align={{ default: "alignRight" }}>
                <Button 
                  icon={<ErrorCircleOIcon />} 
                  variant="danger" 
                  onClick = { () => setIsDeclineModalOpen(true) }
                >
                  Decline
                </Button>
              </FlexItem>
              <FlexItem>
                <Button 
                  icon={<CheckCircleIcon />} 
                  variant="primary" 
                  onClick={() => sendReview(true)}
                >
                  Accept
                </Button>
              </FlexItem>
            </>
          }
        </Flex>
      </CardFooter>
    </Card>
  );
}

export { CaseHistoryReview };
