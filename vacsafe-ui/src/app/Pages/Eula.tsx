import React from 'react';
import {
  Button, 
  Card,
  CardFooter,
  CardBody,
  Stack,
  Text,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons'
import BrowserSupportWarning from '@app/Components/BrowserSupportWarning';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";

const Eula: React.FunctionComponent = () => {
  const history = useHistory();
  const { keycloak } = useKeycloak();

  function login() {
    if(!keycloak?.authenticated) {
      keycloak?.login()
    }
  }
  if(keycloak?.authenticated) {
    sessionStorage.setItem("token", keycloak.token!);
    keycloak.loadUserProfile().then(() => {
      history.push("/profile")
    })
  }

  return (     
    <Card isRounded>
      <CardWithTitle title="Welcome" info="End User Licensing Agreement" />
      <CardBody>
        <Stack hasGutter>
          <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi metus lacus, aliquet a molestie vel, pharetra ac turpis. 
          Etiam ac tellus in mauris scelerisque sollicitudin cursus quis diam. Nullam malesuada sit amet justo eu tristique. 
          Suspendisse accumsan volutpat augue vitae mollis. Proin lacinia arcu eu ligula malesuada, convallis sodales urna convallis. 
          Aliquam erat volutpat. Cras et neque aliquam, rhoncus nunc at, eleifend ligula. Nunc mattis dui nec justo facilisis euismod.
          Mauris ultrices vehicula ligula, et convallis mi rutrum et. Aenean quis tincidunt dui, convallis volutpat magna. Aliquam 
          in odio non augue venenatis placerat ut et urna. Vivamus elementum pretium sagittis. Pellentesque habitant morbi tristique
          senectus et netus et malesuada fames ac turpis egestas. Suspendisse suscipit nibh pretium posuere tincidunt. Etiam rhoncus
          magna odio, sed tempus libero posuere et. Curabitur viverra tellus in sodales feugiat.</Text>
          <Text>
          Duis id euismod augue. In eu eros odio. Praesent lacinia pharetra quam, sit amet fringilla justo accumsan ut. Suspendisse 
          pharetra leo at iaculis dictum. Nullam sed nulla quis dui varius bibendum aliquam id diam. Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit. Phasellus condimentum vel magna in gravida. Sed laoreet ante vel imperdiet sagittis. Cras 
          luctus, metus vitae pretium condimentum, turpis turpis porta lacus, ac ultrices ex nibh eu nunc.</Text>
          <BrowserSupportWarning />
        </Stack>
      </CardBody>
      <CardFooter>
        <Button
          icon={<CheckCircleIcon />}
          variant="primary"
          onClick={() =>( login() )}>
          Accept
        </Button>
      </CardFooter>
    </Card>  
  );
};

export { Eula };
