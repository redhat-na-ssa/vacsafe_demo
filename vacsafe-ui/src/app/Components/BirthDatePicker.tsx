import { 
  americanDateFormat, 
  birthDateValidator, 
  birthDateRules 
} from '@app/utils/utils';
import { 
  FormGroup, 
  DatePicker 
} from '@patternfly/react-core';
import * as React from 'react';
import { Controller } from 'react-hook-form';

const BirthDatePicker = ({control, defaultBirthDate}) => {
  return (
    <Controller
      name="dateOfBirth"
      control={control}
      defaultValue={defaultBirthDate}
      render={({ field, fieldState }) => (
        <FormGroup
          label="Date of Birth"
          isRequired
          helperTextInvalid="This field is required. Please choose your date of birth in MM-DD-YYYY format."
          fieldId="date-of-birth"
          validated={fieldState.error ? "error" : "default"}
        >
          <DatePicker
            aria-label="date-of-birth"
            value={field.value}
            dateFormat={date => date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
            dateParse={americanDateFormat}
            placeholder="MM-DD-YYYY"
            helperText="Please pick your birth date."
            onChange={field.onChange}
            validators={[birthDateValidator]}
          />
        </FormGroup>
      )}
      rules={{ required: true, validate: birthDateRules, pattern: /^(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[01])\-(19|20)\d{2}$/ }}
    />
  )
}

export default BirthDatePicker; 