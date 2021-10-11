import React from 'react';
import { Alert } from '@patternfly/react-core';
import UAParser from 'ua-parser-js';
const BROWSER_SUPPORT = ['Firefox', 'Chrome', 'Mobile Safari'];
const OS_SUPPORT = ['Linux', 'Mac OS', 'Windows', 'Android', 'iOS']
const parser = new UAParser();
const result = parser.getResult();

const browserCompatibility = (result: { os: { name: string; }; browser: { name: string; }; }) => {
  if (!OS_SUPPORT.includes(result.os.name)) {
    return messageRender(result.os.name);
  }
  if (!BROWSER_SUPPORT.includes(result.browser.name)) {
    return messageRender(result.browser.name);
  }
  return null;
}

const messageRender = (value : string) => (
  <Alert isInline variant="info" title="Browser Warning">
      <p>
      We noticed you are using{' '}
      <span>
       <strong>
         {value ? value : "an unsupported browser"}
       </strong>, which we do not currently support
     </span>. You may experience issues.
      </p>
      <p>
        Recommended Browsers:{' '}
          <a 
            href="https://www.google.com/chrome/"
            rel="noreferrer"
            target="_blank"
          >
            Chrome
          </a>,{' '}
          <a
            href="https://www.mozilla.org/en-US/firefox/new/"
            rel="noreferrer"
            target="_blank"
          >
            Firefox
          </a>,{' '}
          <span>
            Safari on iOS
          </span>
      </p>
    </Alert>
)

const BrowserSupportWarning: React.FunctionComponent = () => (browserCompatibility(result));

export default BrowserSupportWarning;
