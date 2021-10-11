import React from 'react';
import { shallow } from 'enzyme';
import { NotFound } from '../../../src/app/Pages/NotFound';

describe('NotFound Page', ()=> {
    it('should be defined', () => {
        expect(NotFound).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<NotFound />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<NotFound />)
        expect(wrapper).toMatchSnapshot()
    })
})
