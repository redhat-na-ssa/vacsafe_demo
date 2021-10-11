import React, { useState } from "react";
import {
  Card,
  CardBody
} from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import { convertBase64ToBlob, convertBlobToBase64, dateConvert } from "@app/utils/utils";
import { useKeycloak } from "@react-keycloak/web";
import CardWithTitle from "@app/Components/CardWithTitle";
import CovidVaxForm from "@app/Components/CovidVaxForm";

const SubmitVax: React.FunctionComponent = () => {
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
    const data = sessionStorage.getItem("vax_image") || "";

    if (data !== "") {
      return new File([convertBase64ToBlob(data)], sessionStorage.getItem("vax_image_filename") || "");
    }

    return "";
  }

  const onSubmit = (data) => {
    sessionStorage.setItem("vaccine", data["vaccine"]);
    sessionStorage.setItem("vax_date_1", dateConvert(data["vax_date_1"]));
    sessionStorage.setItem("vax_date_2", dateConvert(data["vax_date_2"]));
    sessionStorage.setItem("vax_image_filename", data["vax_image"].name)
    convertBlobToBase64(data["vax_image"]).then((base64) => {
      sessionStorage["vax_image"] = base64;
    }).then(()=> history.push("/attest/review/vax"));
  };

  return (
    <Card isRounded>
      <CardWithTitle title="Vaccination Form" info="Enter vaccination info" />
      <CardBody>
        <CovidVaxForm 
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

export { SubmitVax };
