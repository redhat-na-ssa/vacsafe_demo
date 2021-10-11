import React from 'react';
import { shallow } from 'enzyme';
import { Contact } from '../../../src/app/Pages/Contact';

describe('Contact Page', ()=> {
    it('should be defined', () => {
        expect(Contact).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<Contact />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<Contact />)
        expect(wrapper).toMatchSnapshot()
    })
})
