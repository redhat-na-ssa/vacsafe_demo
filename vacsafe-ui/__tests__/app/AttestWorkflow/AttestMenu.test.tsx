import React from 'react';
import { shallow } from 'enzyme';
import { AttestMenu } from '../../../src/app/AttestWorkflow/AttestMenu';

const mocked_keycloak = require('../../../__mocks__/keycloakMock');

jest.mock('@react-keycloak/web', () => ({
    useKeycloak: jest.fn( ()=>({keycloak: mocked_keycloak}))
}))

describe('AttestWorkflow - AttestMenu', ()=> {
    it('should be defined', () => {
        expect(AttestMenu).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<AttestMenu />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<AttestMenu />)
        expect(wrapper).toMatchSnapshot()
    })
})
