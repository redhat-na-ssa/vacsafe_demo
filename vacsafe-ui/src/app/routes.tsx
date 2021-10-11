import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { accessibleRouteChangeHandler } from "@app/utils/utils";
import { Eula } from "@app/Pages/Eula";
import { Profile } from "@app/AttestWorkflow/Profile";
import { HRDashboard } from "@app/HRDashboard/HRDashboard";
import { AttestMenu } from "./AttestWorkflow/AttestMenu";
import { SubmitVax } from "@app/AttestWorkflow/SubmitVax";
import { SubmitTest } from "@app/AttestWorkflow/SubmitTest";
import { ReviewVax } from "@app/AttestWorkflow/ReviewVax";
import { ReviewTest } from "@app/AttestWorkflow/ReviewTest";
import { Thankyou } from "@app/AttestWorkflow/Thankyou";
import { NotFound } from "@app/Pages/NotFound";
import { Contact } from "./Pages/Contact";
import { useDocumentTitle } from "@app/utils/useDocumentTitle";
import { InboxReview } from "./HRDashboard/AgencyInbox/InboxReview";
import { CaseHistory } from "./HRDashboard/Search/CaseHistory";
import { CaseHistoryReview } from "./HRDashboard/Search/CaseHistoryReview";
import { PriorityReview } from "./HRDashboard/PriorityInbox/PriorityReview";
import {
  LastLocationProvider,
  useLastLocation,
} from "react-router-last-location";

let routeFocusTimer: number;
export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    component: Eula,
    exact: true,
    label: "Eula",
    path: "/",
    title: "Red Hat VCS | End User License Agreement ",
  },
  {
    component: Profile,
    exact: true,
    label: "Profile",
    path: "/profile",
    title: "Red Hat VCS | Profile ",
  },
  {
    component: AttestMenu,
    exact: true,
    label: "AttestMenu",
    path: "/attestmenu",
    title: "Red Hat VCS | Attest ",
  },
  {
    component: SubmitVax,
    exact: true,
    label: "Vax",
    path: "/attest/vax",
    title: "Red Hat VCS | Attest | Vax",
  },
  {
    component: SubmitTest,
    exact: true,
    label: "SubmitTest",
    path: "/attest/test",
    title: "Red Hat VCS | Attest | Test",
  },
  {
    component: ReviewVax,
    exact: true,
    label: "ReviewVax",
    path: "/attest/review/vax",
    title: "Red Hat VCS | Attest | Vax | Review",
  },
  {
    component: ReviewTest,
    exact: true,
    label: "ReviewTest",
    path: "/attest/review/test",
    title: "Red Hat VCS | Attest | Test | Review",
  },
  {
    component: HRDashboard,
    exact: true,
    label: "HRPanels",
    path: "/hrpanels",
    title: "Red Hat VCS | HR Verification",
  },
  {
    component: InboxReview,
    exact: true,
    label: "ApprovalReview",
    path: "/approvalreview",
    title: "Red Hat VCS | HR Verification",
  },
  {
    component: CaseHistory,
    exact: true,
    label: "CaseHistory",
    path: "/casehistory",
    title: "Red Hat VCS | HR Verification",
  },
  {
    component: CaseHistoryReview,
    exact: true,
    label: "CaseHistoryReview",
    path: "/casereview",
    title: "Red Hat VCS | Case History Review",
  },
  {
    component: PriorityReview,
    exact: true,
    label: "PriorityReview",
    path: "/priorityreview",
    title: "Red Hat VCS | COVID Result Review",
  },
  {
    component: Thankyou,
    exact: true,
    label: "Thankyou",
    path: "/thankyou",
    title: "Red Hat VCS | Thankyou",
  },
  {
    component: Contact,
    exact: true,
    label: "Contact",
    path: "/contact",
    title: "Red Hat VCS | Contact",
  },
];

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
const useA11yRouteChange = (isAsync: boolean) => {
  const lastNavigation = useLastLocation();
  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [isAsync, lastNavigation]);
};

const RouteWithTitleUpdates = ({
  component: Component,
  isAsync = false,
  title,
  ...rest
}: IAppRoute) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} {...rest} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [
    ...flattened,
    ...(route.routes ? route.routes : [route]),
  ],
  [] as IAppRoute[]
);

const AppRoutes = (): React.ReactElement => (
  <LastLocationProvider>
    <Switch>
      {flattenedRoutes.map(
        ({ path, exact, component, title, isAsync }, idx) => (
          <RouteWithTitleUpdates
            path={path}
            exact={exact}
            component={component}
            key={idx}
            title={title}
            isAsync={isAsync}
          />
        )
      )}
      <PageNotFound title="404 Page Not Found" />
    </Switch>
  </LastLocationProvider>
);

export { AppRoutes, routes };
