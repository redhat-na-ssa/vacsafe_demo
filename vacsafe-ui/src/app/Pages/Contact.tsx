import React from 'react';
import { Button, Card, CardBody, CardFooter } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useHistory } from 'react-router-dom';

const Contact: React.FunctionComponent = () => {
  const history = useHistory();
  return (
    <Card isRounded>
      <CardWithTitle
        title="Help"
        info="If you need more information, use link below."
      />
      <CardBody>
        <Button
          icon={<ExternalLinkAltIcon />}
          variant="link"
          component="a"
          href="https://oshr.nc.gov/covid-19-vaccination-or-testing-faqs"
          target="_blank"
        >
          Vaccination and Testing FAQ
        </Button>
      </CardBody>
      <CardFooter>
        <Button variant="plain" onClick={() => history.push("/")}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export { Contact };
