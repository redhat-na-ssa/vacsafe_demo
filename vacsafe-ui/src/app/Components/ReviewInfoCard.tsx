import { 
Card, 
CardBody, 
Form, 
FormGroup, 
TextInput 
} from '@patternfly/react-core';
import * as React from 'react';
import CardWithTitle from './CardWithTitle';
import { dateConvert } from "@app/utils/utils";

const ReviewInfoCard = (props) => {

  const CovidTestInfo = () => {
    return (
      <>
        <FormGroup
          label="Test Result"
          fieldId="test-result">
          <TextInput
            id="test-result"
            isDisabled
            type="text"
            value={props.covidTestResult}
          />
        </FormGroup> 
        <FormGroup
          label="Test Date"
          fieldId="test-date">
          <TextInput
            id="test-date"
            isDisabled
            type="text"
            value={dateConvert(props.covidTestDate)}
          />
        </FormGroup>
      </>
    )
  }

  const CovidVaccineInfo = () => {
    return (
      <>
        <FormGroup
          label="Vaccine"
          fieldId="vaccine-brand"
        >
          <TextInput
            id="vaccine-brand"
            isDisabled
            type="text"
            value={props.vaccineBrand}
          />
        </FormGroup>
        <FormGroup
          label="Date Administered"
          fieldId="vaccine-date-administered"
        >
          <TextInput
            id="vaccine-date-administered"
            isDisabled
            type="text"
            value={dateConvert(props.vaccineDate)}
          />
        </FormGroup>
        <FormGroup
          label="Date Submitted (TEMP)"
          fieldId="vaccine-date-administered"
        >
          <TextInput
            id="vaccine-date-administered"
            isDisabled
            type="text"
            value={dateConvert(props.vaccineDate)}
          />
        </FormGroup>
      </>
    )
  }

  const ExemptionInfo = () => {
    return (
      <>
        <FormGroup
          label="Vaccine Exemption Granted"
          fieldId="vax-exempt"
        >
          <TextInput
            id="vax-exempt"
            isDisabled
            type="text"
            value={props.isVaxExempt ? "YES" : "NO"}
          />
        </FormGroup>
        <FormGroup
          label="Masking Exemption Granted"
          fieldId="mask-exempt"
        >
          <TextInput
            id="mask-exempt"
            isDisabled
            type="text"
            value={props.isMaskExempt ? "YES" : "NO"}
          />
        </FormGroup>
        <FormGroup
          label="Testing Exemption Granted"
          fieldId="test-exempt"
        >
          <TextInput
            id="test-exempt"
            isDisabled
            type="text"
            value={props.isTestExempt ? "YES" : "NO"}
          />
        </FormGroup>
      </>
    )
  }

  const ReviewTypeInfo = () => {
    if(props.reviewType === "TEST") {
      return <CovidTestInfo />
    }
    else if(props.reviewType === "VAX") {
      return <CovidVaccineInfo />
    }
    else if(props.reviewType === "EXM") {
      return <ExemptionInfo />
    }
    else {
      return <></>
    }
  }

  const HRActionInfo = () => {
    if(props.submittedBy) {
      return (
        <FormGroup
          className="warningText"
          label="Submitted By"
          fieldId="profile-form-submitted-by"
        >
          <TextInput
            id="profile-input-submitted-by"
            isDisabled
            type="text"
            value={props.submittedBy}
          />
        </FormGroup>
      )
    }
    else if(props.reviewer) {
      return (
        <FormGroup
          className="warningText"
          label="Reviewed By"
          fieldId="profile-form-submitted-by"
        >
          <TextInput
            id="profile-input-submitted-by"
            isDisabled
            type="text"
            value={props.reviewer}
          />
        </FormGroup>
      )
    }
    else {
      return <></>
    }
  }

  return (
    <Card>
      <CardWithTitle 
        title="Review Information"
      />
      <CardBody>
        <Form>
          <HRActionInfo />
          <ReviewTypeInfo />
        </Form>
      </CardBody>
    </Card>
  )
}

export default ReviewInfoCard;