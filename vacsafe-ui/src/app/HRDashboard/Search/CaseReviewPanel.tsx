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
  GridItem,
  Spinner,
  Split
} from '@patternfly/react-core';
import { CheckCircleIcon, ErrorCircleOIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import authaxios from "@app/utils/axiosInterceptor";
import ReviewInfoCardHorizontal from '@app/Components/ReviewInfoCardHorizontal';
import { ResponseErrorModal, GenericResponseModal } from '@app/Components/FeedbackModals';
import DeclineReasonModal from '@app/Components/DeclineReasonModal';
import { useKeycloak } from "@react-keycloak/web";

interface AppProps {
  hasSelectedItem: boolean;
  setHasSelectedItem: (boolean) => void; 
  updatePanel: boolean;
  refreshCaseHistory: boolean; 
  setResfreshCaseHistory: (boolean) => void; 
}

const CaseReviewPanel: React.FunctionComponent<AppProps> = ({
  hasSelectedItem, 
  setHasSelectedItem,
  updatePanel, 
  refreshCaseHistory, 
  setResfreshCaseHistory
}) => {

  const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : "";
  const containerId = window.REACT_APP_PAM_CONTAINER_ID ? window.REACT_APP_PAM_CONTAINER_ID : ""
  const baseURL = pamBaseUrl + "/rest/server/containers"

  const { keycloak } = useKeycloak();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false); 
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false); 
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false); 
  const [errorState, setErrorState] = useState(''); 
  const [genericModalTitle, setGenericModalTitle] = useState("");
  const [genericModalMessage, setGenericModalMessage] = useState("");
  const [disableReview, setDisableReview] = useState(false); 

  const [reviewerEmployeeId, setReviewerEmployeeId] = useState("");

  const [historyType, setHistoryType] = useState(""); 

  const [submissionDate, setSubmissionDate] = useState(""); 
  const [reviewDate, setReviewDate] = useState(""); 
  const [vaxBrand, setVaxBrand] = useState("");
  const [vaxDate, setVaxDate] = useState(""); 
  const [vaxReview, setVaxReview] = useState("");
  const [reviewer, setReviewer] = useState(""); 
  const [taskId, setTaskId] = useState("");
  const [isPendingReview, setIsPendingReview] = useState(false)
  const [rejectReason, setRejectReason] = useState("Reviewer notes here ..."); 
  const [testResult, setTestResult] = useState(""); 
  const [testDate, setTestDate] = useState("");

  const [isExempt, setIsExempt] = useState(false); 
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
    if(hasSelectedItem) {
      setIsContentLoading(true); 
      setIsPendingReview(false);
      setIsExempt(false); 
      setRejectReason("Reviewer notes here ...");
      setReviewer("");
      setDisableReview(false); 

      const reviewType = sessionStorage.getItem("caseHistoryType") || "";
      const sessionReivewData = sessionStorage.getItem("caseHistoryInfo") || "";
      const reviewData = JSON.parse(sessionReivewData);
      const attachment = reviewData['attachment']

      setSubmittedBy(reviewData['submittedBy']); 

      if(reviewType.includes('TEST')){
        console.log(reviewData)
        setHistoryType("TEST")
        setTestResult(reviewData['covidTestResult']);
        setTestDate(reviewData['covidTestDate']);
        setSubmissionDate(returnNewDate(reviewData['submissionDate']));
      }
      else if(reviewType.includes('VAX')) {
        setHistoryType("VAX");
        setVaxBrand(reviewData['vaccineBrand']);
        setVaxDate(reviewData['vaccineAdministrationDate']);
        setSubmissionDate(returnNewDate(reviewData['submissionDate']));

        const vaxReviewResult = reviewData['review']; 
        setVaxReview(vaxReviewResult ? vaxReviewResult['outcome'] : ( reviewData['autoApproved'] ? "AUTO-ACCEPTED" : "NOT REVIEWED"));

        if(vaxReviewResult){
          setReviewer(vaxReviewResult['reviewerEmployeeId']); 
          setReviewDate(returnNewDate(vaxReviewResult['reviewDate']));
        }
        else {
          if(!reviewData['autoApproved']) {
            authaxios.get(pamBaseUrl + '/query/task/document/' + reviewData['id'])
            .then(res => {
              setIsPendingReview(true);
              setTaskId(res['data']['taskId']);
              authaxios.get(baseURL + "/" + containerId + "/tasks/" + res['data']['taskId'])
              .then(taskRes => {
                const taskData = taskRes['data']

                if(taskData['task-status'] === "Reserved") {
                  setDisableReview(true);
                  setGenericModalTitle("Task Was Claimed");
                  setGenericModalMessage("Please select another one.");
                  setIsGenericModalOpen(true);
                }
                else {
                  setDisableReview(false); 
                }
              })
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
        .finally(() => {
          setIsContentLoading(false); 
        })
      }
      else {
        setIsContentLoading(false);
      }
    }
  }, [pamBaseUrl, containerId, baseURL, hasSelectedItem, updatePanel]);

  const sendReview = (accepted: boolean) => {
    setIsFormSubmitting(true)
    setIsDeclineModalOpen(false);
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
        setHasSelectedItem(false);
        setGenericModalTitle("Submitted Successfully!");
        setGenericModalMessage("Review has been submitted!");
        setIsGenericModalOpen(true); 
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

  function returnNewDate(resDate) {
    const longDate = new Date(resDate);
    return ("0"+(longDate.getMonth()+1)).slice(-2) + "-" + ("0"+ longDate.getDate()).slice(-2) + "-" + longDate.getFullYear();
  }

  const closeReviewAndRefresh = () => {
    setResfreshCaseHistory(!refreshCaseHistory);
    setIsGenericModalOpen(false);
  }

  const ReviewHeader = () => {
    return <CardWithTitle title="Attestation Details"/>;
  }

  const ReviewInfo = () => {
    if (historyType === "TEST") {
      return (             
        <ReviewInfoCardHorizontal
          reviewType="TEST"
          covidTestResult={testResult}
          covidTestDate={testDate}
          submittedBy={submittedBy}
          submissionDate={submissionDate}
          reviewer={reviewer}
        />
      )
    }
    else if (historyType === "VAX") {
      return (
        <ReviewInfoCardHorizontal
          reviewType="VAX"
          vaccineBrand={vaxBrand}
          vaccineDate={vaxDate}
          submittedBy={submittedBy}
          submissionDate={submissionDate}
          reviewer={reviewer}
          reviewDate={reviewDate}
          reviewStatus={vaxReview}
        />
      )
    }
    else {
      return (
        <ReviewInfoCardHorizontal
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

  const CardContent = () => {
    if(!hasSelectedItem) {
      return (
        <CardBody>
          {"Please Select an Item"}
        </CardBody>
      )
    }
    else if(isContentLoading) {
      return (
        <CardBody isFilled>
          <Spinner isSVG/>
        </CardBody>
      )
    }
    else {
      return (
        <>
          <CardBody>
            <Grid hasGutter>
              <GridItem span={12}> 
                <ReviewInfo />
              </GridItem>
              {
                !isExempt &&
                (
                  <Flex justifyContent={{ default: "justifyContentCenter" }}>
                    <FlexItem>
                  <GridItem span={12}> 
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
                      <img src={URL.createObjectURL(new Blob([attachment]))} style={{maxHeight: '500px'}}/> 
                    }
                  </GridItem>
                    </FlexItem>
                  </Flex>
                )
              }

            </Grid>
          </CardBody>
          <CardFooter>
              {
                isPendingReview &&
                <Split hasGutter>
                  <Button 
                    icon={<CheckCircleIcon />} 
                    isDisabled={disableReview}
                    variant="primary" 
                    onClick={() => sendReview(true)}
                  >
                    Accept
                  </Button>
                  <Button 
                    icon={<ErrorCircleOIcon />} 
                    isDisabled={disableReview}
                    variant="danger" 
                    onClick = { () => setIsDeclineModalOpen(true) }
                  >
                    Decline
                  </Button>
                </Split>
              }
          </CardFooter>
        </>
      )
    }
  }

  return (
    <Card isRounded height="500px">
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
      <GenericResponseModal 
        isModalOpen={isGenericModalOpen}
        setIsModalOpen={closeReviewAndRefresh}
        title={genericModalTitle}
        message={genericModalMessage}
      />
      <ReviewHeader />
      <CardContent />
    </Card>
  );
}

export { CaseReviewPanel };
