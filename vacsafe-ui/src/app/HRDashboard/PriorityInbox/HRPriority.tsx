import React, { useState } from 'react';
import { Menu, MenuContent, MenuList, MenuItem, Card } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import CardWithTitle from '@app/Components/CardWithTitle';
import { useEffect } from 'react';
import authaxios from "@app/utils/axiosInterceptor";
import { dateConvert } from "@app/utils/utils";

const HRPriority: React.FunctionComponent = () => {
  const [activeItem, setActiveItem] = useState('0'); 
  const [inboxList, setInboxList] = useState([])
  const history = useHistory();

  const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : ""

  function onSelect(event, itemId) {
    sessionStorage.setItem("priorityData", JSON.stringify(inboxList[itemId]));
    setActiveItem(itemId)
    history.push('/priorityreview');
  }

  useEffect(() => {
    const headers = {
      'Accept': 'application/json'
    }

    authaxios.get(pamBaseUrl + '/query/positive-results', {
      headers: headers
    })
    .then(res => {
      setInboxList(res['data'])
    })
  }, [pamBaseUrl]);

  return (
    <Card isRounded className="warningText">
      <CardWithTitle title="Priority Inbox" info="Select an item below to review" />
      <Menu onSelect={onSelect} activeItemId={activeItem}>
        <MenuContent menuHeight="350px">
          <MenuList>
            {
              inboxList.length > 0 &&
                inboxList.map((item, index) => (
                  <MenuItem key={index} description={"Test Date: " + dateConvert(item['covidTestDate'])} itemId={index}>
                    {item['employeeId']}
                  </MenuItem>
                ))
            }
          </MenuList>
        </MenuContent>
      </Menu>
    </Card>
  );
};

export { HRPriority };