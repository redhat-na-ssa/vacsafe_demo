import * as React from 'react';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';


const ResponseErrorModal = (props) => {
  const ServerError = () => {
    if(props.errorState === 400) {
      return <span> Form entry is incorrect. Please review form entries. </span>
    }
    else {
      return <span> Server is unable to respond. Please try again later. </span>
    }
  }

  return (
    <Modal
      variant={ModalVariant.small}
      title="Error Submitting Form"
      isOpen={props.isModalOpen}
      onClose={() => props.setIsModalOpen(false)}
      actions={[
        <Button key="cancel" variant="tertiary" onClick={() => props.setIsModalOpen(false)}>
          Close
        </Button>
      ]}
    >
      <ServerError />
    </Modal>
  )
}

const GenericResponseModal = (props) => {
  return (
    <Modal
      variant={ModalVariant.small}
      title={props.title}
      onClose={() => props.setIsModalOpen(false)}
      isOpen={props.isModalOpen}
      actions={[
        <Button key="cancel" variant="tertiary" onClick={() => props.setIsModalOpen(false)}>
          Close
        </Button>
      ]}
    >
      {props.message}
    </Modal>
  )
}

export { 
  ResponseErrorModal, 
  GenericResponseModal
}