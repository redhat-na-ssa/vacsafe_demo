import React, { useState } from "react";
import { 
  Form, 
  FormGroup, 
  TextInput, 
  FormSelect, 
  FormSelectOption, 
  DatePicker, 
  FileUpload, 
  Button, 
  Flex,
  FlexItem
} from "@patternfly/react-core";
import { CheckCircleIcon, OutlinedPaperPlaneIcon } from "@patternfly/react-icons";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { 
  dateConvert, 
  americanDateFormat,
  covidTestDateRules,
  covidTestDateValidator
} from "@app/utils/utils";

const CovidTestForm = (props) => {

  const history = useHistory();
  const { control, handleSubmit } = useForm();
  const [isTestFileRejected, setIsTestFileRejected] = useState(false);

  return (
    <Form onSubmit={handleSubmit(props.onSubmit)}>
      <FormGroup
        fieldId="employee-id"
        helperText={
          props.isHRSubmit ? 
          "Make sure this matches the ID of the person you are submitting for." : 
          "Make sure this matches your ID."
        }
        label="Person ID"
      >
        <TextInput
          aria-label="employee-id"
          isDisabled
          type="text"
          value={props.employeeId}
        />
      </FormGroup>
      <FormGroup
        fieldId="employee-full-name"
        helperText={
          props.isHRSubmit ? 
          "Make sure this matches the full name of the person you are submitting for." : 
          "Make sure this matches your full name."
        }
        label="Full Name"
      >
        <TextInput
          aria-label="employee-full-name"
          isDisabled
          type="text"
          value={props.employeeName}
        />
      </FormGroup>
      {props.isHRSubmit &&
        <FormGroup
          fieldId="employee-dob"
          helperText="Make sure this matches the birth date of the person you are submitting for."
          label="Date of Birth"
        >
          <TextInput
            aria-label="employee-dob"
            isDisabled
            type="text"
            value={dateConvert(props.employeeDOB)}
          />
        </FormGroup>
      }
      <Controller
        name="test_results"
        control={control}
        rules={{ required: true }}
        defaultValue={props.isHRSubmit ? "" : (sessionStorage.getItem("test_results") || "")}
        render={({ field, fieldState }) => (
          <FormGroup
            fieldId="test-results-input"
            helperText="The result of the COVID test."
            isRequired
            validated={fieldState.error ? "error" : "default"}
            label="Test Results"
            helperTextInvalid="This field is required to proceed"
          >
            <FormSelect
              aria-label="test-results-input"
              onChange={field.onChange}
              validated={fieldState.error ? "error" : "default"}
              value={field.value}
            >
              <FormSelectOption
                isPlaceholder
                isDisabled
                label="Please Select"
              />
              <FormSelectOption label="Negative" value="Negative" />
              <FormSelectOption label="Positive" value="Positive" />
              <FormSelectOption label="Inconclusive" value="Inconclusive" />
            </FormSelect>
          </FormGroup>
        )}
      />
      <Controller
        control={control}
        defaultValue={props.isHRSubmit ? "" : (dateConvert(sessionStorage.getItem("test_date") || ""))}
        name="test_date"
        render={({ field, fieldState }) => (
          <FormGroup
            label="Test Date"
            fieldId="test-results-date"
            helperText="Please pick the date this test was administered."
            helperTextInvalid="This field is required to proceed"
            isRequired
            validated={fieldState.error ? "error" : "default"}
          >
            <DatePicker
              aria-label="test-results-date"
              dateFormat={date => date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
              dateParse={americanDateFormat}
              placeholder="MM-DD-YYYY"
              onChange={field.onChange}
              value={field.value}
              validators={[covidTestDateValidator]}
            />
          </FormGroup>
        )}
        rules={{ required: true, validate: covidTestDateRules, pattern: /^(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[01])\-(19|20)\d{2}$/  }}
      />
      {!props.isHRSubmit &&
        <Controller
          control={control}
          defaultValue={props.onLoad}
          name="test_image_file"
          render={({ field, fieldState }) => (
            <FormGroup
              fieldId="test-record-image"
              isRequired
              label="Provide a copy of the Test Results"
              helperText="Must be a PDF, JPG, JPEG, or PNG file no larger than 4 MB"
              helperTextInvalid="Must be a PDF, JPG, JPEG, or PNG file no larger than 4 MB"
              validated={isTestFileRejected || fieldState.error ? "error" : "default"}
            >
              <FileUpload
                hideDefaultPreview
                filename={field.value["name"]}
                id="test-record-image"
                value={field.value}
                onChange={field.onChange}
                dropzoneProps={{
                  accept: ".jpg,.jpeg,.png,.pdf",
                  maxSize: 4608000,
                  onDropRejected: () => {
                    setIsTestFileRejected(true);
                  },
                }}
                validated={isTestFileRejected ? "error" : "default"}
              />
            </FormGroup>
          )}
          rules={{ required: true }}
        />
      }
      {props.isHRSubmit &&
        <Controller
          name="alternate_email"
          defaultValue={""}
          control={control}
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
      }
      {props.isHRSubmit ? 
        <FormGroup fieldId="accept-test-buttons">
          <Flex>
            <FlexItem align={{ default: "alignRight" }}>
              <Button
                icon={<OutlinedPaperPlaneIcon />}
                variant="primary"
                type="submit"
                isDisabled={props.isFormSubmitting}
                isLoading={props.isFormSubmitting}
              >
                Submit
              </Button>
            </FlexItem>
          </Flex>
        </FormGroup>
        :
        <FormGroup fieldId="accept-test-buttons">
          <Button 
            icon={<CheckCircleIcon />} 
            variant="primary" 
            type="submit"
          >
            Accept
          </Button>
          <Button 
            variant="plain" 
            onClick={() => history.push("/attestmenu")}
          >
            Back
          </Button>
        </FormGroup>
      }
    </Form>
  )
};

export default CovidTestForm;