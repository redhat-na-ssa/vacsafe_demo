import React from 'react';
import { shallow } from 'enzyme';
import DeclineReasonModal from '../../../src/app/Components/DeclineReasonModal';

describe('<DeclineReasonModal />', ()=> {
    it('should be defined', () => {
        expect(DeclineReasonModal).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<DeclineReasonModal />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<DeclineReasonModal />)
        expect(wrapper).toMatchSnapshot()
    })
})
