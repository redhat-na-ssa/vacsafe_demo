import React, { useState } from 'react';
import { 
  Menu, 
  MenuContent, 
  MenuList, 
  MenuItem, 
  Card, 
  MenuGroup 
} from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useEffect } from 'react';
import authaxios from "@app/utils/axiosInterceptor";
import { GenericResponseModal } from '@app/Components/FeedbackModals';
import { useKeycloak } from "@react-keycloak/web";

const HRInbox: React.FunctionComponent = () => {
  const [activeItem, setActiveItem] = useState('0'); 
  const [inboxList, setInboxList] = useState([]);
  const [refreshData, setRefreshData] = useState(false)
  const [inProgressList, setInProgressList] = useState([]);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false); 
  const [reviewerEmployeeId, setReviewerEmployeeId] = useState("");
  const history = useHistory();
  const { keycloak } = useKeycloak();

  const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : ""
  const containerId = window.REACT_APP_PAM_CONTAINER_ID ? window.REACT_APP_PAM_CONTAINER_ID : ""
  const baseURL = pamBaseUrl + "/rest/server/containers"

  if(keycloak?.authenticated) {
    keycloak.loadUserProfile().then((profile) => {
      setReviewerEmployeeId(profile.attributes.workforceid[0]);
    })
  }

  function onSelect(event, itemId) {

    const itemIndex = parseInt(itemId.split(':')[1]);
    const taskUrl = baseURL + "/" + containerId + "/tasks/" + itemIndex + "/states"

    const headers = {
      'Content-Type': 'application/json'
    }

    if(itemId.includes('INPROGRESS')) {
      sessionStorage.setItem("approveId", "" + itemIndex);
      setActiveItem(itemId)
      history.push('/approvalreview');
    }
    else {
      authaxios.put(taskUrl + "/claimed", {}, {
        headers: headers
      })
      .then(() => {
        sessionStorage.setItem("approveId", "" + itemIndex);
        setActiveItem(itemId)
        history.push('/approvalreview');
      })
      .catch(() => {
        setIsClaimModalOpen(true)
      })
    }
  }

  useEffect(() => {

    const headers = {
      'Accept': 'application/json'
    }

    authaxios.get(pamBaseUrl + '/rest/server/queries/tasks/instances/pot-owners?status=Reserved&user=' + reviewerEmployeeId, {
      headers: headers
    })
    .then(resOne => {
      authaxios.get(pamBaseUrl + '/rest/server/queries/tasks/instances/pot-owners?status=InProgress&user=' + reviewerEmployeeId, {
        headers: headers
      })
      .then(resTwo => {
        setInProgressList(resOne.data["task-summary"].concat(resTwo.data["task-summary"]))
      })
    })

    authaxios.get(pamBaseUrl + '/rest/server/queries/tasks/instances/pot-owners?status=Ready&pageSize=200', {
      headers: headers
    })
    .then(res => {
      setInboxList(res.data["task-summary"])
    })
  }, [pamBaseUrl, refreshData, reviewerEmployeeId]);

  function convertToDate(dateString) {
    const date = parseInt(dateString);
    const d = new Date(date);
    return  ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + "-" + d.getFullYear();
  }

  const closeAndRefresh = () => {
    setRefreshData(!refreshData); 
    setIsClaimModalOpen(false);
  }

  return (
    <Card isRounded>
      <GenericResponseModal
        isModalOpen={isClaimModalOpen}
        setIsModalOpen={closeAndRefresh}
        title="Task Was Claimed"
        message="Please select another one."
      />
      <CardWithTitle title="Agency Inbox" info="Select an item below to review" />
      <Menu onSelect={onSelect} activeItemId={activeItem}>
        <MenuContent menuHeight="350px">
          <MenuGroup label="Your In-Progress Tasks">
            <MenuList className="indentList">
              {
                inProgressList.length == 0 &&
                <MenuItem key="empty" itemId="empty" isDisabled>
                  [No In-Progress Tasks]
                </MenuItem>
              }
              {
                inProgressList.length > 0 &&
                  inProgressList.map(item => (
                    <MenuItem 
                    key={item["task-id"]} 
                    description={"Submitted on: " + convertToDate(item["task-created-on"]["java.util.Date"])} 
                    itemId={"INPROGRESS:" + item["task-id"]}>
                      {item["task-description"]}
                    </MenuItem>
                  ))
              }
            </MenuList>
          </MenuGroup>
          <MenuGroup label="All Available Tasks">
            <MenuList className="indentList">
              {
                inboxList.length > 0 &&
                  inboxList.map(item => (
                    <MenuItem 
                    key={item["task-id"]} 
                    description={"Submitted on: " + convertToDate(item["task-created-on"]["java.util.Date"])} 
                    itemId={"READY:" + item["task-id"]}>
                      {item["task-description"]}
                    </MenuItem>
                  ))
              }
            </MenuList>
          </MenuGroup>
        </MenuContent>
      </Menu>
    </Card>
  );
};

export { HRInbox };