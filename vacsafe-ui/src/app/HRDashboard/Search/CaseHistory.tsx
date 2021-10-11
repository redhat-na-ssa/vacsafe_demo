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
  Modal, 
  ModalVariant,
  Menu, 
  MenuContent, 
  MenuList, 
  MenuItem,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  MenuGroup,
  Tooltip,
  Split
} from '@patternfly/react-core';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import authaxios from "@app/utils/axiosInterceptor";
import { HRExemptionSubmit } from './UpdateRecord/HRExemptionSubmit';
import { HRTestSubmit } from './UpdateRecord/HRTestSubmit';
import { HRVaxSubmit } from './UpdateRecord/HRVaxSubmit';
import { dateConvert } from "@app/utils/utils";
import EmployeeInfoHorizontalCard from '@app/Components/EmployeeInfoHorizontalCard';
import { CaseReviewPanel } from './CaseReviewPanel';
import { CheckCircleIcon, CircleIcon, ErrorCircleOIcon, FrownIcon, MehIcon, MinusCircleIcon, OutlinedMehIcon, OutlinedSadCryIcon, OutlinedSmileBeamIcon, SadCryIcon, SmileBeamIcon, SmileIcon, TimesCircleIcon } from '@patternfly/react-icons';

const CaseHistory: React.FunctionComponent = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDOB, setEmployeeDOB] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeAgency, setEmployeeAgency] = useState("");
  const [employeeDivision, setEmployeeDivision] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [expanded, setExpanded] = useState(''); 
  const [activeItem, setActiveItem] = useState('0'); 
  const [testHistory, setTestHistory] = useState([]); 
  const [vaxHistory, setVaxHistory] = useState([]); 
  const [exemptionHistory, setExemptionHistory] = useState([]); 
  const [hasSelectedItem, setHasSelectedItem] = useState(false); 
  const [updatePanel, setUpdatePanel] = useState(false); 

  const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : "";

  useEffect(() => {
    const sessionEmployee = sessionStorage.getItem("searchResultInfo") || ""; 
    const employeeInfo = JSON.parse(sessionEmployee); 
    setEmployeeId(employeeInfo['id']);
    setEmployeeName(employeeInfo['firstName'] + " " + employeeInfo['lastName']);
    setEmployeeDOB(employeeInfo['dateOfBirth']);
    setEmployeeEmail(employeeInfo['alternateEmail'] ? employeeInfo['alternateEmail'] : (employeeInfo['email'] ? employeeInfo['email'] : "Not Provided"));
    setEmployeeAgency(employeeInfo['agencyCode']);
    setEmployeeDivision(employeeInfo['divisionCode']);

    const headers = {
      'Accept': 'application/json'
    }

    authaxios.get(pamBaseUrl + '/query/test-result-document/' + employeeInfo['id'], {
      headers: headers
    })
    .then(res => {
      setTestHistory(res['data'])
    })

    authaxios.get(pamBaseUrl + '/query/vax-document/' + employeeInfo['id'], {
      headers: headers
    })
    .then(res => {
      setVaxHistory(res['data'])
    })

    authaxios.get(pamBaseUrl + '/query/exemptions/employee/' + employeeInfo['id'], {
      headers: headers
    })
    .then(res => {
      setExemptionHistory(res['data']);
      sessionStorage.setItem("globalExemptData", JSON.stringify(res['data']));
    })
  }, [refresh, pamBaseUrl]);


  function closeModal() {
    setIsModalOpen(false);
    setExpanded('');
    setRefresh(!refresh);
    setUpdatePanel(!updatePanel);
  }

  function onSelect(event, itemId) {
    setHasSelectedItem(true);
    setActiveItem(itemId);
    setUpdatePanel(!updatePanel)
    if(itemId.includes('TEST')){
      const dataIndex = parseInt(itemId.split(':')[1]);
      const testData = testHistory[dataIndex];
      sessionStorage.setItem("caseHistoryType", "TEST");
      sessionStorage.setItem("caseHistoryInfo", JSON.stringify(testData));
    }
    else if(itemId.includes('VAX')) {
      const dataIndex = parseInt(itemId.split(':')[1]);
      const vaxData = vaxHistory[dataIndex];
      sessionStorage.setItem("caseHistoryType", "VAX");
      sessionStorage.setItem("caseHistoryInfo", JSON.stringify(vaxData));
    }
    else if(itemId.includes('EXM')) {
      const dataIndex = parseInt(itemId.split(':')[1]);
      const exmData = exemptionHistory[dataIndex];
      const exempEmployeeInfo = sessionStorage.getItem("searchResultInfo") || ""; 
      sessionStorage.setItem("caseHistoryType", "EXM");
      sessionStorage.setItem("caseHistoryExmData", JSON.stringify(exmData));
      sessionStorage.setItem("caseHistoryInfo", exempEmployeeInfo);
    }
    
    //history.push('/casereview')
    
  }

  function returnNewDate(resDate) {
    const longDate = new Date(resDate);
    return ("0"+(longDate.getMonth()+1)).slice(-2) + "-" + ("0"+ longDate.getDate()).slice(-2) + "-" + longDate.getFullYear();
  }

  function onToggle(id) {
    if(id === expanded) {
      setExpanded('');
    }
    else {
      setExpanded(id); 
    }
  }

  const getExemptionString = (exempStr) => {
    const exempVax = "Vaccine: " + (exempStr['vaccine'] ? "Yes" : "No");
    const exempMask = "Masking: " + (exempStr['mask'] ? "Yes" : "No");
    const exempTest = "Testing: " + (exempStr['test'] ? "Yes" : "No");

    return exempVax + " | " + exempMask + " | " + exempTest; 
  }

  const getExemptionIcon = (exemptionString) => {
    // return exemptionString ? <CheckCircleIcon color='green'/> : <TimesCircleIcon color='firebrick' />;
    return exemptionString ? "YES" : "NO";
  }

  const getAutoApproved = (testResult, testDate, submitDate) => {
    if(testResult === "POSITIVE") {
      return "Test Date: " + dateConvert(testDate); 
    }

    return "Auto Approved on: " + returnNewDate(submitDate); 
  }

  const CovidTestHistory = () => {
    if(testHistory.length > 0) {
      return (
        <>
          <MenuItem 
            key={"TEST"} 
            itemId={"TEST"}
            isDisabled
          >
            <Flex justifyContent={{default: "justifyContentSpaceBetween"}}>
              <FlexItem>
              {"Test Date"}
              </FlexItem>
              <FlexItem>
              {"Test Result"}
              </FlexItem>
            </Flex>
          </MenuItem>
          {
            testHistory.map((x, i) => (
              <MenuItem 
                key={"TEST:" + i} 
                itemId={"TEST:"+i}
              >
                <Flex justifyContent={{default: "justifyContentSpaceBetween"}}>
                  <FlexItem>
                    {dateConvert(x['covidTestDate'])}
                  </FlexItem>
                  <FlexItem>
                  { x['covidTestResult'] }
                    {/* { x['covidTestResult'] === "POSITIVE" ? <CircleIcon color='firebrick'/>  : x['covidTestResult'] === "NEGATIVE" ?  <CircleIcon color="seagreen" />: <CircleIcon color="goldenrod"/> } */}
                  </FlexItem>
                </Flex>
              </MenuItem>
            ))
          }
        </>
      )
    }
    else{
      return (
        <MenuItem key="empty" itemId="empty" isDisabled>
          [No Test Results]
        </MenuItem>
      )
    }
  }

  const CovidVaccineHistory = () => {
    if(vaxHistory.length > 0) {
      return (
        <>
          <MenuItem 
            key={"VAX"} 
            itemId={"VAX"}
            isDisabled
          >
            <Flex justifyContent={{default: "justifyContentSpaceBetween"}}>
              <FlexItem>
                {"Vaccination Date"}
              </FlexItem>
              <FlexItem>
                {"Status"} 
              </FlexItem>
            </Flex>
          </MenuItem>
          {
            vaxHistory.map((x, i) => (
              <MenuItem 
                key={"VAX:" + i} 
                itemId={"VAX:" + i}
              >
                <Flex justifyContent={{default: "justifyContentSpaceBetween"}}>
                  <FlexItem>
                    { dateConvert(x['vaccineAdministrationDate']) }
                  </FlexItem>
                  <FlexItem>
                  { x['review'] ? x['review']['outcome'] : x['autoApproved'] ? "AUTO-ACCEPTED" : "NOT REVIEWED" }
                    {/* { x['review'] ? ( x['review']['outcome'] === "ACCEPTED" ? <CheckCircleIcon color='green'/> : <TimesCircleIcon color='firebrick' /> ) : ( x['autoApproved'] ? <CheckCircleIcon color='green'/> : <MinusCircleIcon color='goldenrod'/>)}  */}
                  </FlexItem>
                </Flex>
              </MenuItem>
            ))
          }
        </>
      )
    }
    else{
      return (
        <MenuItem key="empty" itemId="empty" isDisabled>
          [No Vaccination Records]
        </MenuItem>
      )
    }
  }

  const ExemptionHistory = () => {
    if(exemptionHistory.length > 0) {
      return (
        <>
          <MenuItem 
            key={"EXM"} 
            itemId={"EXM"}
            isDisabled
          >
            <Flex justifyContent={{default: "justifyContentSpaceBetween"}}>
              <FlexItem>
                {"Vaccine"}
              </FlexItem>
              <FlexItem>
                {"Masking"}
              </FlexItem>
              <FlexItem>
                {"Testing"} 
              </FlexItem>
            </Flex>
          </MenuItem>
          {
            exemptionHistory.map((x, i) => (
              <MenuItem 
                key={"EXM:" + i} 
                itemId={"EXM:" + i}
              >
                <Flex justifyContent={{default: "justifyContentSpaceBetween"}}>
                  <FlexItem>
                    {getExemptionIcon(x['vaccine'])}
                  </FlexItem>
                  <FlexItem>
                    {getExemptionIcon(x['mask'])}
                  </FlexItem>
                  <FlexItem>
                    {getExemptionIcon(x['test'])}
                  </FlexItem>
                </Flex>
              </MenuItem>
            ))
          }
        </>
      )
    }
    else{
      return (
        <MenuItem key="empty" itemId="empty" isDisabled>
          [No Exemptions]
        </MenuItem>
      )
    }
  }

  return (
    <React.Fragment>
      <Card isRounded>
          <CardWithTitle title="Case History" info="Review Case History"/>
        <CardBody>
          <Grid hasGutter>
          <GridItem span={12}> 
              <EmployeeInfoHorizontalCard 
                employeeId={employeeId}
                employeeName={employeeName}
                employeeDOB={employeeDOB}
                employeeEmail={employeeEmail}
                employeeAgency={employeeAgency}
                employeeDivision={employeeDivision}
              />
            </GridItem>
            <GridItem span={4} rowSpan={6}> 
              <Card>
              <CardWithTitle title="Attestation Records"/>
                  <Menu onSelect={onSelect} activeItemId={activeItem}>
                    <MenuContent menuHeight="875px">
                      <MenuGroup label="Test Results">
                        <MenuList className="indentList">
                          <CovidTestHistory />
                        </MenuList>
                      </MenuGroup>
                      <MenuGroup label="Vaccination Records">
                        <MenuList className="indentList">
                          <CovidVaccineHistory />
                        </MenuList>
                      </MenuGroup>
                      <MenuGroup label="Exemptions">
                        <MenuList className="indentList">
                          <ExemptionHistory />
                        </MenuList>
                      </MenuGroup>
                    </MenuContent>
                  </Menu>
              </Card>
            </GridItem>
            <GridItem span={8} rowSpan={6}>
              <CaseReviewPanel 
                hasSelectedItem={hasSelectedItem}
                setHasSelectedItem={setHasSelectedItem}
                updatePanel={updatePanel} 
                refreshCaseHistory={refresh}
                setResfreshCaseHistory={setRefresh}
              />
            </GridItem>
          </Grid>
        </CardBody>
        <CardFooter>
          <Split hasGutter>
            <Button variant="primary" onClick = { () => setIsModalOpen(!isModalOpen) }>
              Update Record
            </Button>
            <Button 
              variant="plain" 
              onClick={() => history.push("/hrpanels")
            }>
              Back
            </Button>
          </Split>
        </CardFooter>
      </Card>
      <Modal
        variant={ModalVariant.medium}
        title="Update Record"
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <Accordion>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('vax-toggle');
              }}
              isExpanded={expanded === 'vax-toggle'}
              id="vax-toggle"
            >
              Vaccine Submission
            </AccordionToggle>
            <AccordionContent id="vax-expand" isHidden={expanded !== 'vax-toggle'}>
              <HRVaxSubmit closeParentModal={closeModal}/>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('test-toggle');
              }}
              isExpanded={expanded === 'test-toggle'}
              id="ex-toggle2"
            >
              Test Submission
            </AccordionToggle>
            <AccordionContent id="test-expand" isHidden={expanded !== 'test-toggle'}>
              <HRTestSubmit closeParentModal={closeModal}/>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('exemption-toggle');
              }}
              isExpanded={expanded === 'exemption-toggle'}
              id="exemption-toggle"
            >
              Exemption Submission
            </AccordionToggle>
            <AccordionContent id="exemption-toggle" isHidden={expanded !== 'exemption-toggle'}>
              <HRExemptionSubmit closeParentModal={closeModal}/>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <br />
        <Flex>
          <FlexItem align={{ default: "alignLeft" }}>
            <Button key="back" variant="plain" onClick={closeModal}>
              Back
            </Button>
          </FlexItem>
        </Flex>
      </Modal>
    </React.Fragment>
  );
}

export { CaseHistory };