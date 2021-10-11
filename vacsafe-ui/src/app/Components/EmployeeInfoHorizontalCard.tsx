import { 
Card, 
CardBody, 
Form, 
FormGroup, 
Grid, 
GridItem, 
TextInput 
} from '@patternfly/react-core';
import * as React from 'react';
import CardWithTitle from './CardWithTitle';
import { dateConvert } from "@app/utils/utils";

const EmployeeInfoCard = (props) => {

  return (
    <Card>
      <CardWithTitle 
        title="Employee Information"
      />
      <CardBody>
        <Form>
          <Grid hasGutter>
            <GridItem span={6}> 
              <FormGroup
                label="Person ID"
                fieldId="profile-form-employee-id"
              >
                <TextInput
                  aria-label="profile-input-employee-id"
                  isDisabled
                  type="text"
                  value={props.employeeId}
                />
              </FormGroup>
              <FormGroup
                label="Name"
                fieldId="profile-form-employee-name"
              >
                <TextInput
                  aria-label="profile-input-employee-name"
                  isDisabled
                  type="text"
                  value={props.employeeName}
                />
              </FormGroup>
              <FormGroup
                label="Date of Birth"
                fieldId="profile-form-employee-dob"
              >
                <TextInput
                  aria-label="profile-input-employee-dob"
                  isDisabled
                  type="text"
                  value={dateConvert(props.employeeDOB)}
                />
              </FormGroup>
            </GridItem> 
            <GridItem span={6}> 
              <FormGroup
                label="Email"
                fieldId="profile-form-employee-email"
              >
                <TextInput
                  aria-label="profile-input-employee-email"
                  isDisabled
                  type="text"
                  value={props.employeeEmail}
                />
              </FormGroup>
              <FormGroup
                label="Agency"
                fieldId="profile-form-agency"
              >
                <TextInput
                  aria-label="profile-input-agency"
                  isDisabled
                  type="text"
                  value={props.employeeAgency}
                />
              </FormGroup>
              <FormGroup
                label="Division"
                fieldId="profile-form-division"
              >
                <TextInput
                  aria-label="profile-input-division"
                  isDisabled
                  type="text"
                  value={props.employeeDivision}
                />
              </FormGroup>
            </GridItem>
          </Grid>
        </Form>
      </CardBody>
    </Card>
  )
}

export default EmployeeInfoCard;