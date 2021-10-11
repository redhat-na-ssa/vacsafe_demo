import React from "react";
import { mount, shallow } from "enzyme";
import { Eula } from "@app/Pages/Eula";

const mocked_keycloak = require('../../../__mocks__/keycloakMock');

jest.mock('@react-keycloak/web', () => ({
    useKeycloak: jest.fn( ()=>({keycloak: mocked_keycloak}))
}))

describe("Eula Page", () =>{

    it('should be defined', () => {
        expect(Eula).toBeDefined()
    })

    it("should render without crashing", () => {
        const wrapper = shallow(<Eula />)
        expect(Eula)
    })

    it("should match existing snapshot", () => {
        const wrapper = shallow(<Eula />)
        expect(Eula).toMatchSnapshot()
    })
    
    it("Should display the EULA text", async () => {
        const eula = mount(<Eula />);
        expect(eula.text().includes("End User Licensing Agreement")).toBeTruthy();
    });

    it("Accept button starts login", async () => {
        mocked_keycloak.authenticated=false;
        const eula = mount(<Eula />);
        eula.find("button").simulate('click');
        expect(mocked_keycloak.login.mock.calls.length).toEqual(1);
        expect(mocked_keycloak.loadUserProfile.mock.calls.length).toEqual(0);
    });

    it("Profile loaded if already authenticated", async () => {
        mocked_keycloak.authenticated=true;
        const eula = mount(<Eula />);
        eula.find("button").simulate('click');
        expect(mocked_keycloak.loadUserProfile.mock.calls.length).toEqual(1);
    });
});
