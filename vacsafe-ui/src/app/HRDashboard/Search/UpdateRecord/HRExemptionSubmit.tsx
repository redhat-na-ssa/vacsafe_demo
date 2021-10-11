import { 
  Button, 
  Flex, 
  FlexItem, 
  Switch 
} from '@patternfly/react-core';
import { OutlinedPaperPlaneIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { useState } from 'react';
import authaxios from "@app/utils/axiosInterceptor";
import { ResponseErrorModal, GenericResponseModal } from '@app/Components/FeedbackModals';

interface AppProps {
  closeParentModal: () => void;
}

const HRExemptionSubmit: React.FunctionComponent<AppProps> = (props:AppProps) => {

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
  const [errorState, setErrorState] = useState(''); 
  const [vaxToggle, setVaxToggle] = useState(false); 
  const [maskToggle, setMaskToggle] = useState(false); 
  const [testToggle, setTestToggle] = useState(false); 
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const sendExemption = () => {
    setIsFormSubmitting(true);
    const sessionExemptData = sessionStorage.getItem("globalExemptData") || ""; 
    const sessionEmployee = sessionStorage.getItem("searchResultInfo") || ""; 
    const exemptData = JSON.parse(sessionExemptData); 
    const employeeInfo = JSON.parse(sessionEmployee); 

    const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : ""
    const exemptUrl = pamBaseUrl + "/query/exemptions"
    const bodyFormData = new FormData();

    const headers = {
      'Content-Type': 'application/json'
    }

    bodyFormData.append("id", exemptData[0] ? exemptData[0]['id'] : null)
    bodyFormData.append("employeeId", employeeInfo['id'])
    bodyFormData.append("agencyCode", employeeInfo['agencyCode'])
    bodyFormData.append("agencyName", "" + employeeInfo['agencyName'])
    bodyFormData.append("vaccine", "" + vaxToggle)
    bodyFormData.append("mask", "" + maskToggle)
    bodyFormData.append("test", "" + testToggle)

    authaxios.post(exemptUrl,
      {
        "id": exemptData[0] ? exemptData[0]['id'] : null,
        "employeeId": employeeInfo['id'],
        "agencyCode": employeeInfo['agencyCode'],
        "agencyName": employeeInfo['agencyName'],
        "vaccine": vaxToggle,
        "mask": maskToggle,
        "test": testToggle
      }, {
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
    <React.Fragment>
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
      <Flex>
        <FlexItem align={{ default: "alignLeft" }}>
            Vaccine Exemption Granted
        </FlexItem>
        <FlexItem align={{ default: "alignRight" }}>
        <Switch
          id="reversed-switch-1"
          label="YES"
          labelOff="NO"
          isChecked={vaxToggle}
          onChange={setVaxToggle}
        />
        </FlexItem>
      </Flex>
      <br />
      <Flex>
        <FlexItem align={{ default: "alignLeft" }}>
          Masking Exemption Granted
        </FlexItem>
        <FlexItem align={{ default: "alignRight" }}>
        <Switch
          id="reversed-switch-2"
          label="YES"
          labelOff="NO"
          isChecked={maskToggle}
          onChange={setMaskToggle}
        />
        </FlexItem>
      </Flex>
      <br />
      <Flex>
        <FlexItem align={{ default: "alignLeft" }}>
          Testing Exemption Granted
        </FlexItem>
        <FlexItem align={{ default: "alignRight" }}>
        <Switch
          id="reversed-switch-3"
          label="YES"
          labelOff="NO"
          isChecked={testToggle}
          onChange={setTestToggle}
        />
        </FlexItem>
      </Flex>
      <br />
      <br />
      <Flex>
        <FlexItem align={{ default: "alignRight" }}>
        <Button
            icon={<OutlinedPaperPlaneIcon />}
            variant="primary"
            onClick={sendExemption}
            isDisabled={isFormSubmitting}
            isLoading={isFormSubmitting}
          >
            Submit
        </Button>
        </FlexItem>
      </Flex>
    </React.Fragment>
  )
}

export { HRExemptionSubmit }