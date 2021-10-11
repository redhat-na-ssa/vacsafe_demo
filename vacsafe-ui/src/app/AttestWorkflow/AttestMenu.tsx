import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Text,
} from "@patternfly/react-core";
import { FileUploadIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useKeycloak } from "@react-keycloak/web";
import { useState  } from 'react';

const AttestMenu: React.FunctionComponent = () => {
    const history = useHistory();
    const { keycloak } = useKeycloak();
    const [employeeRole, setEmployeeRole] = useState(""); 

    if(keycloak?.authenticated) {
      keycloak.loadUserProfile().then(() => {
        if( keycloak.hasRealmRole("AG-COVIDSafe-Approver") || keycloak.hasRealmRole("AG-COVIDSafe-Approver-Test")){
          setEmployeeRole("approver"); 
        }  
      })
    }

    return (
      <Card isRounded>
        <CardWithTitle title="Menu" info="Please select from the following:" />
        <CardBody>
          <Stack hasGutter>
            <Button
              icon={<FileUploadIcon />}
              id="submit-vax-card-menu-button"
              isSmall
              onClick={() => history.push("/attest/vax")}
              variant="tertiary"
            >
              <Text>Submit Vaccination Record</Text>
              <Text>Supporting Document Upload Required</Text>
            </Button>

            <Button
              icon={<FileUploadIcon />}
              id="submit-vax-test-menu-button"
              isSmall
              onClick={() => history.push("/attest/test")}
              variant="tertiary"
            >
              <Text>Submit COVID Test Results</Text>
              <Text>Supporting Document Upload Required</Text>
            </Button>
            {employeeRole.localeCompare("approver") == 0 && (
              <>
                <Divider />
                <Button
                  icon={<CheckCircleIcon />}
                  id="validate-submissions-button"
                  isSmall
                  onClick={() => history.push("/hrpanels")}
                  variant="tertiary"
                >
                  <Text>HR Dashboard</Text>
                  <Text>Review or Update Red Hat VCS Records</Text>
                </Button>
              </>
            )}
          </Stack>
        </CardBody>
        <CardFooter>
          <Button variant="plain" onClick={() => history.push("/profile")}>
            Back
          </Button>
        </CardFooter>
      </Card>
    );
};
export { AttestMenu }
