import { 
Card, 
CardBody, 
Flex, 
FlexItem, 
Form, 
FormGroup, 
Grid, 
GridItem, 
TextInput 
} from '@patternfly/react-core';
import * as React from 'react';
import CardWithTitle from './CardWithTitle';
import { dateConvert } from "@app/utils/utils";

const ReviewInfoCardHorizontal = (props) => {

  const CovidTestInfo = () => {
    return (
      <Grid hasGutter>
        <GridItem span={6}>
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
          <HRActionInfo infoType={"name"}/>
        </GridItem>
        <GridItem span={6}>
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
          <FormGroup
            label="Submission Date"
            fieldId="submission-date">
            <TextInput
              id="submission-date"
              isDisabled
              type="text"
              value={props.submissionDate}
            />
          </FormGroup>
        </GridItem>
      </Grid>
    )
  }

  const CovidVaccineInfo = () => {
    return (
      <Grid hasGutter>
        <GridItem span={6}>
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
            label="Status"
            fieldId="review-result"
          >
            <TextInput
              id="review-result"
              isDisabled
              type="text"
              value={props.reviewStatus}
            />
          </FormGroup>
          <HRActionInfo infoType={"name"}/>
        </GridItem>
        <GridItem span={6}>
          <FormGroup
            label="Vaccination Date"
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
            label="Submission Date"
            fieldId="record-submit-date"
          >
            <TextInput
              id="record-submit-date"
              isDisabled
              type="text"
              value={props.submissionDate}
            />
          </FormGroup>
          <HRActionInfo infoType={"date"}/>
        </GridItem>
      </Grid>
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

  const HRActionInfo = ({infoType}) => {
    if(props.submittedBy) {
      if(infoType === "name") {
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
      else {
        return (
          <></>
        )
      }
    }
    else if(props.reviewer) {
      if(infoType === "name") {
        return (
          <FormGroup
            className="warningText"
            label="Reviewer"
            fieldId="profile-form-reviewer"
          >
            <TextInput
              id="profile-input-reviewer"
              isDisabled
              type="text"
              value={props.reviewer}
            />
          </FormGroup>
        )
      }
      else {
        return (
          <FormGroup
          className="warningText"
          label="Review Date"
          fieldId="profile-form-review-date"
        >
          <TextInput
            id="profile-input-review-date"
            isDisabled
            type="text"
            value={props.reviewDate}
          />
        </FormGroup>
        )
      }
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
          <ReviewTypeInfo />
        </Form>
      </CardBody>
    </Card>
  )
}

export default ReviewInfoCardHorizontal;