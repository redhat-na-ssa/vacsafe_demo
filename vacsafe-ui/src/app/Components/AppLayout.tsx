import * as React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Page,
  Flex,
  FlexItem,
  PageHeader,
  SkipToContent,
  Title,
  Button,
} from '@patternfly/react-core';
import logo from '@app/Assets/Logo-RedHat-B-Color-RGB.png';
import {useKeycloak} from "@react-keycloak/web";

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory();
  const {keycloak} = useKeycloak();
  const [isMobileView, setIsMobileView] = React.useState(true);
  const onPageResize = (props: { mobileView: boolean; windowSize: number }) => {
    setIsMobileView(props.mobileView);
  };
  //TODO: extract this for re-use
  const clearAndRedirect = () => {
    keycloak.logout({redirectUri: location.origin});
    sessionStorage.clear()
  }

  //TODO: Figure out why we can't control page layout without isNavOpen of this component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Header = (
    <PageHeader
      isNavOpen={false}
    />
  );
  const pageId = 'primary-app-container';
  const PageSkipToContent = (
    <SkipToContent onClick={(event) => {
      event.preventDefault();
      const primaryContentContainer = document.getElementById(pageId);
      primaryContentContainer && primaryContentContainer.focus();
    }} href={`#${pageId}`}>
      Skip to Content
    </SkipToContent>
  );

  return (
    <Page
      style={{ backgroundColor: "rgb(222, 222, 222)" }}
      mainContainerId={pageId}
      onPageResize={onPageResize}
      skipToContent={PageSkipToContent}
    >
      <Flex
        alignItems={{ default: "alignItemsCenter" }}
        direction={{ default: "column" }}
        style={{ marginTop: "1rem" }}
      >
        <FlexItem alignSelf={{ default: "alignSelfFlexEnd" }}>
          <Button
            onClick={() => history.push("/contact")}
            variant="plain"
          >
            <span style={{ color: "black" }}>HELP</span>
          </Button>
          <Button onClick={clearAndRedirect} variant="plain">
            <span style={{ color: "black" }}>LOGOUT</span>
          </Button>
        </FlexItem>
        <FlexItem>
          <Title headingLevel="h1" size="3xl">
            Red Hat VCS
          </Title>
        </FlexItem>
        <FlexItem>
          <img src={logo} onClick={() => history.push("/")} alt="RH Logo" width="100px" />
        </FlexItem>
        <FlexItem style={{ width: "95%" }}>{children}</FlexItem>
      </Flex>
    </Page>
  );
}

export { AppLayout };
