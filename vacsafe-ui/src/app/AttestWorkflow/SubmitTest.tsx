import React, { useState } from "react";
import {
  Card,
  CardBody
} from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import { convertBase64ToBlob, convertBlobToBase64, dateConvert } from "@app/utils/utils";
import CardWithTitle from "@app/Components/CardWithTitle";
import { useKeycloak } from "@react-keycloak/web";
import CovidTestForm from "@app/Components/CovidTestForm";

const SubmitTest: React.FunctionComponent = () => {
  const history = useHistory();
  const { keycloak } = useKeycloak();
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  if(keycloak?.authenticated) {
    keycloak.loadUserProfile().then((profile) => {
      setEmployeeId(profile.attributes.workforceid[0]);
      setEmployeeName(profile.firstName + " " + profile.lastName);
    })
  }

  const onLoad = () => {
    const data = sessionStorage.getItem("test_image_file") || "";

    if (data !== "") {
      return new File([convertBase64ToBlob(data)], sessionStorage.getItem("test_image_filename") || "");
    }

    return "";
  }

  const onSubmit = data => {
    sessionStorage.setItem("test_results", data["test_results"]);
    sessionStorage.setItem("test_date", dateConvert(data["test_date"]));
    sessionStorage.setItem("test_image_filename", data["test_image_file"].name)
    convertBlobToBase64(data["test_image_file"]).then(base64 => {
      sessionStorage["test_image_file"] = base64;
    }).then(() => history.push("/attest/review/test"));
  };

  return (
    <Card isRounded>
      <CardWithTitle title="Test Results" info="Submit Test Results" />
      <CardBody>
        <CovidTestForm
          isHRSubmit={false}
          employeeId={employeeId}
          employeeName={employeeName}
          onSubmit={onSubmit}
          onLoad={onLoad}
        />
      </CardBody>
    </Card>
  );
};

export { SubmitTest };