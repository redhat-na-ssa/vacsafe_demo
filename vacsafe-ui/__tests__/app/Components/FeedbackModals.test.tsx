import React from 'react';
import { shallow } from 'enzyme';
import { GenericResponseModal, ResponseErrorModal }  from '../../../src/app/Components/FeedbackModals';

describe('<GenericResponseModal />', ()=> {
    it('should be defined', () => {
        expect(GenericResponseModal).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<GenericResponseModal />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<GenericResponseModal />)
        expect(wrapper).toMatchSnapshot()
    })
})

describe('<ResponseErrorModal />', ()=> {
    it('should be defined', () => {
        expect(ResponseErrorModal).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<ResponseErrorModal />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<ResponseErrorModal />)
        expect(wrapper).toMatchSnapshot()
    })
})
