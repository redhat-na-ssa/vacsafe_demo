import * as React from 'react';
import { Button, Card, CardFooter } from "@patternfly/react-core";
import { WindowCloseIcon } from '@patternfly/react-icons';
import CardWithTitle from '@app/Components/CardWithTitle';
import {useKeycloak} from "@react-keycloak/web";

const Thankyou: React.FunctionComponent = () => {
  const {keycloak} = useKeycloak();
  return (
    <Card isRounded>
      <CardWithTitle
        title="Thank You!"
        info="Thank you for your submission. Your documents have been received by Human Resources."
      />
      <CardFooter>
        <Button
          icon={<WindowCloseIcon />}
          onClick={() => {
            keycloak.logout({redirectUri: location.origin});
            sessionStorage.clear()
          }}
          type="button"
          variant="danger"
        >
          Finish and Log Out
        </Button>
      </CardFooter>
    </Card>
  );
}

export { Thankyou };
