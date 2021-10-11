import React, { useState } from 'react';
import { 
  Menu, 
  MenuContent, 
  MenuList, 
  MenuItem, 
  SearchInput, 
  Card, 
  Button, 
  GridItem, 
  Grid
} from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import CardWithTitle from '@app/Components/CardWithTitle';
import authaxios from "@app/utils/axiosInterceptor";

const HRSearch: React.FunctionComponent = () => {

  const [activeItem, setActiveItem] = useState('0'); 
  const [search, setSearch] = useState(''); 
  const [searchResult, setSearchResult] = useState('')
  const [searchResultInfo, setSearchResultInfo] = useState({})
  const [hasNoResult, setHasNoResult] = useState(false)
  const history = useHistory();
  const pamBaseUrl = window.REACT_APP_PAM_URL_BASE ? window.REACT_APP_PAM_URL_BASE : ""

  function onSelect(event, itemId) {
    sessionStorage.setItem("searchId", itemId);
    sessionStorage.setItem("searchResultInfo", JSON.stringify(searchResultInfo))
    setActiveItem(itemId)
    history.push('/casehistory');
  }

  function onSearchChange (value) {
    setSearch(value);
    setSearchResult('')
    setHasNoResult(false)
  }

  function onSearchClear() {
    setSearch('')
    setSearchResult('')
    setHasNoResult(false)
  }

  const headers = {
    'Accept': 'application/json'
  }

  function onSearchEnter() {
    authaxios.get(pamBaseUrl + '/query/employee/' + search, {
      headers: headers
    })
    .then(res => {
      const resData = res['data']
      if(resData) {
        const resEmployeeLastName = resData['lastName']
        const resEmployeeFirstName = resData['firstName']
        const resEmployeeId = resData['id']
        const resSearchResult = resEmployeeLastName.toUpperCase() + ", " + resEmployeeFirstName + "  [" + resEmployeeId + "]"
        setHasNoResult(false)
        setSearchResult(resSearchResult)
        setSearchResultInfo(resData)
      }
      else {
        setHasNoResult(true)
      }
    })
    .catch(() => {
      setHasNoResult(true)
    })
  }

  return (
    <Card isRounded>
      <CardWithTitle title="Red Hat VCS Search" info="Search by Person ID" />
      <Menu onSelect={onSelect} activeItemId={activeItem}>
        <Grid>
          <GridItem span={9}>
          <SearchInput
            placeholder='Search by Person ID'
            value={search}
            onChange={onSearchChange}
            onClear={onSearchClear}
          />
          </GridItem>
          <GridItem span={3}>
            <Button isBlock variant="control" onClick={onSearchEnter}>Search</Button>
          </GridItem>
        </Grid> 
        <MenuContent menuHeight="315px">
          <MenuList>
            <MenuItem isDisabled itemId="title">
              Search Result:
            </MenuItem>
            {
              searchResult &&
              <MenuItem itemId={search}>
                {searchResult}
              </MenuItem>
            }
            {
              hasNoResult &&
              <MenuItem isDisabled itemId='NoResults'>
                No results for {search}
              </MenuItem>
            }
          </MenuList>
        </MenuContent>
      </Menu>
    </Card>
  );
};

export { HRSearch };