import React from 'react';
import { shallow } from 'enzyme';
import BrowserSupportWarning from '../../../src/app/Components/BrowserSupportWarning';

describe('<BrowserSupportWarning />', ()=> {
    it('should be defined', () => {
        expect(BrowserSupportWarning).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<BrowserSupportWarning />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<BrowserSupportWarning />)
        expect(wrapper).toMatchSnapshot()
    })
})
