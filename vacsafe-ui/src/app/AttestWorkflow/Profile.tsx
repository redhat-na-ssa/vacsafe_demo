import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";
import { CheckCircleIcon } from "@patternfly/react-icons";
import CardWithTitle from "@app/Components/CardWithTitle";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { dateConvert } from "@app/utils/utils";
import { useKeycloak } from "@react-keycloak/web";
import BirthDatePicker from "@app/Components/BirthDatePicker";

const Profile: React.FunctionComponent = () => {
  const history = useHistory();
  const { control, handleSubmit } = useForm();
  const { keycloak } = useKeycloak();
  
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeAgency, setEmployeeAgency] = useState("");
  const [employeeRole, setEmployeeRole] = useState(""); 

  if(keycloak?.authenticated) {
    keycloak.loadUserProfile().then((profile) => {
      setEmployeeId(profile.attributes.workforceid[0]);
      setEmployeeName(profile.firstName + " " + profile.lastName);
      setEmployeeEmail(profile.email || "");
      setEmployeeAgency(profile.attributes.agency[0]); 
      if( keycloak.hasRealmRole("AG-COVIDSafe-Approver") || keycloak.hasRealmRole("AG-COVIDSafe-Approver-Test")){
        setEmployeeRole("approver"); 
      }  
    })
  }

  const onSubmit = data => {
    sessionStorage.setItem("alternateEmail", data["alternateEmail"]);
    sessionStorage.setItem("dateOfBirth", dateConvert(data["dateOfBirth"]));
    history.push("/attestmenu");
  };

  return (
    <Card isRounded>
      <CardWithTitle
        title="Profile"
        info="The information below is retrieved from your user account."
      />
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup
            id="employee-id-display"
            label="Person ID"
            fieldId="profile-form-employee-id"
          >
            <TextInput
              aria-label="employee-id-display"
              isDisabled
              type="text"
              value={employeeId}
            />
          </FormGroup>
          <FormGroup
            id="employee-full-name"
            label="Full Name"
            fieldId="profile-form-employee-full-name"
          >
            <TextInput
              aria-label="employee-full-name"
              isDisabled
              type="text"
              value={employeeName}
            />
          </FormGroup>
          <BirthDatePicker
            control={control}
            defaultBirthDate={dateConvert(sessionStorage.getItem("dateOfBirth") || "")} 
          />
          <FormGroup
            id="employee-email-display"
            label="Email"
            fieldId="profile-form-email"
          >
            <TextInput
              aria-label="employee-email-display"
              isDisabled
              type="email"
              value={employeeEmail}
            />
          </FormGroup>
          <Controller
            name="alternateEmail"
            control={control}
            defaultValue={sessionStorage.getItem("alternateEmail") || ""}
            render={({ field, fieldState }) => (
              <FormGroup
                id="alernative-email"
                label="Alternate Email (optional)"
                helperText="Optional email for notifications"
                helperTextInvalid="This needs to be a valid email address"
                fieldId="alernative-email"
                validated={fieldState.error ? "error" : "default"}
              >
                <TextInput
                  aria-label="alernative-email"
                  onChange={field.onChange}
                  placeholder="example@mail.com"
                  type="email"
                  value={field.value}
                />
              </FormGroup>
            )}
            rules={{
              required: false,
              pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g,
            }}
          />
          <FormGroup
            id="employee-agency"
            label="Agency"
            fieldId="profile-form-agency"
          >
            <TextInput
              aria-label="employee-agency"
              isDisabled
              type="text"
              value={employeeAgency}
            />
          </FormGroup>
          {employeeRole.localeCompare("approver") == 0 && (
            <Checkbox
              id="reviewer-checkbox"
              label="Red Hat VCS Reviewer"
              aria-label="disabled checked checkbox"
              defaultChecked
              isDisabled
            />
          )}
          <FormGroup fieldId="accept-test-buttons">
            <Button icon={<CheckCircleIcon />} variant="primary" type="submit">
              Accept
            </Button>
            <Button variant="plain" onClick={() => history.push("/")}>
              Back
            </Button>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export { Profile };
