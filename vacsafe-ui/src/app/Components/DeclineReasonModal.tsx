import * as React from 'react';
import { Button, Modal, ModalVariant, Radio, Stack } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { useState } from 'react';

const DeclineReasonModal = ({...props}) => {
  const [checked, setChecked] = useState(""); 
  const declineReasons = [
    "Attachments not legible",
    "Supporting document missing vaccine information",
    "Supporting document missing name and/or DOB",
    "Not a valid form of supporting documentation",
    "Supporting documentation mismatch with employee information",
    "Supporting documentation provided is a copy of the wrong side of the card"
  ]

  const handleRadioChange = (_, event) => {
    props.setRejectReason(event.currentTarget.value);
    setChecked(event.currentTarget.name);
  }

  return (
    <Modal
      actions={[
        <Button
          icon={<CheckCircleIcon />}
          isDisabled={props.isSendingReview}
          isLoading={props.isSendingReview}
          key="confirm"
          variant="primary"
          onClick={() => props.sendReview(false)}
        >
          Confirm
        </Button>,
        <Button
          key="cancel"
          onClick={() => props.setIsModalOpen(false)}
          variant="plain"
        >
          Cancel
        </Button>
      ]}
      isOpen={props.isModalOpen}
      onClose={() => props.setIsModalOpen(false)}
      title="Reason For Decline - Select Most Appropriate"
      variant={ModalVariant.medium}
    >
      <Stack hasGutter>
        {declineReasons.map((reason, index) => (
          <Radio
            key={"radio-" + index}
            isChecked={checked === "radio-" + index}
            name={"radio-" + index}
            onChange={handleRadioChange}
            label={reason}
            id={"radio-controlled-" + index}
            value={reason}
          />
        ))}
      </Stack>
    </Modal>
  )
}

export default DeclineReasonModal;