import React, { useState } from "react";
import {
  Button,
  DatePicker,
  FileUpload,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from "@patternfly/react-core";
import { CheckCircleIcon, OutlinedPaperPlaneIcon } from "@patternfly/react-icons";
import { useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { 
  dateConvert, 
  americanDateFormat, 
  covidVaxOneDateRules, 
  covidVaxOneDateValidator,
  covidVaxTwoDateRules,
  covidVaxTwoDateValidator
} from "@app/utils/utils";

const vendorOptions = [
  { value: "AstraZeneca", label: "AstraZeneca" },
  { value: "Janssen", label: "Janssen" },
  { value: "Johnson", label: "Johnson & Johnson" },
  { value: "Moderna", label: "Moderna" },
  { value: "Novavax", label: "Novavax" },
  { value: "Pfizer", label: "Pfizer" },
];

const CovidVaxForm = (props) => {
  const history = useHistory();
  const { control, handleSubmit, getValues } = useForm();
  const [isRejected, setIsRejected] = useState(false);

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
        name="vaccine"
        control={control}
        defaultValue={props.isHRSubmit ? "" : (sessionStorage.getItem("vaccine") || "")}
        render={({ field, fieldState }) => (
          <FormGroup
            helperText={
              props.isHRSubmit ? 
              "Which vaccine was administered?" : 
              "Which vaccine did you receive?"
            }
            helperTextInvalid="This field is required, please make a selection."
            isRequired
            label="Vaccine"
            fieldId="vaccine-vendor"
            validated={fieldState.error ? "error" : "default"}
          >
            <FormSelect
              aria-label="vaccine-vendor"
              value={field.value}
              onChange={field.onChange}
            >
              <FormSelectOption
                isPlaceholder
                isDisabled
                label="Please Select"
              />
              {vendorOptions.map((option, index) => (
                <FormSelectOption
                  key={index}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </FormSelect>
          </FormGroup>
        )}
        rules={{ required: true }}
      />
      <Controller
        name="vax_date_1"
        control={control}
        defaultValue={props.isHRSubmit ? "" : (dateConvert(sessionStorage.getItem("vax_date_1") || ""))}
        render={({ field, fieldState }) => (
          <FormGroup
            helperText="Please choose the date of the first shot."
            helperTextInvalid="This field is required, please enter a valid date."
            fieldId="shot-1-date"
            isRequired
            label="Date of Shot 1"
            validated={fieldState.error ? "error" : "default"}
          >
            <DatePicker
              aria-label="shot-1-date"
              onChange={field.onChange}
              dateFormat={date => date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
              dateParse={americanDateFormat}
              placeholder="MM-DD-YYYY"
              value={field.value}
              validators={[covidVaxOneDateValidator]}
            />
          </FormGroup>
        )}
        rules={{ required: true, validate: covidVaxOneDateRules, pattern: /^(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[01])\-(19|20)\d{2}$/ }}
      />
      <Controller
        name="vax_date_2"
        control={control}
        defaultValue={props.isHRSubmit ? "" : (dateConvert(sessionStorage.getItem("vax_date_2") || ""))}
        render={({ field, fieldState }) => (
          <FormGroup
            helperText="Please choose the date of the second shot."
            helperTextInvalid="This field is required, please enter a valid date."
            fieldId="shot-2-date"
            label="Date of Shot 2 (if applicable)"
            validated={fieldState.error ? "error" : "default"}
          >
            <DatePicker
              aria-label="shot-2-date"
              onChange={field.onChange}
              dateFormat={date => date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
              dateParse={americanDateFormat}
              placeholder="MM-DD-YYYY"
              value={field.value}
              validators={[ (date) => covidVaxTwoDateValidator(date, new Date(getValues("vax_date_1").replace(/-/g,'/'))) ]}
            />
          </FormGroup>
        )}
        rules={{ validate: (data) => covidVaxTwoDateRules(data, getValues("vax_date_1")), pattern: /^(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[01])\-(19|20)\d{2}$/ }}
      />
      {!props.isHRSubmit &&
        <Controller
          control={control}
          defaultValue={props.onLoad}
          name="vax_image"
          render={({ field, fieldState }) => (
            <FormGroup
              fieldId="vaccination-record-image"
              isRequired
              label="Select Image of Vaccination Record"
              helperText="Copy of CDC/Vaccine Record Card, note or receipt from doctor with name, dates and vaccine type, or a printout from the CVMS system."
              helperTextInvalid="Must be a PDF, JPG, JPEG, or PNG file no larger than 4 MB"
              validated={isRejected || fieldState.error ? "error" : "default"}
            >
              <FileUpload
                hideDefaultPreview
                filename={field.value["name"]}
                id="vaccination-record-image"
                value={field.value}
                onChange={field.onChange}
                dropzoneProps={{
                  accept: ".jpg,.jpeg,.png,.pdf",
                  maxSize: 4608000,
                  onDropRejected: () => {
                    setIsRejected(true);
                  },
                }}
                validated={isRejected ? "error" : "default"}
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
        <FormGroup fieldId="accept-button">
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
        <FormGroup fieldId="accept buttons">
          <Button 
            icon={<CheckCircleIcon />} 
            type="submit" 
            variant="primary"
          >
            Accept
          </Button>
          <Button 
            onClick={() => history.push("/attestmenu")} 
            variant="plain"
          >
            Back
          </Button>
        </FormGroup>
      }
    </Form>
  )
}

export default CovidVaxForm;