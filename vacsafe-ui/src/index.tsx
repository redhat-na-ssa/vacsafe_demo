import React from "react";
import ReactDOM from "react-dom";

import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

import App from '@app/index';

if (process.env.NODE_ENV !== "production") {
  const config = {
    rules: [
      {
        id: 'color-contrast',
        enabled: false
      }
    ]
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000, config);
}

const tokenLogger = (tokens: unknown) => {
  sessionStorage.setItem("token", tokens.token);
}

ReactDOM.render(
    <ReactKeycloakProvider
      authClient={keycloak}
      onTokens={tokenLogger}>
    <App />
    </ReactKeycloakProvider>
    , document.getElementById("root") as HTMLElement
);
