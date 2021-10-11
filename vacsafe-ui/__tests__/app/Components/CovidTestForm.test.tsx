import React from 'react';
import { shallow } from 'enzyme';
import CovidTestForm from '../../../src/app/Components/CovidTestForm';

describe('<CovidTestForm />', ()=> {
    it('should be defined', () => {
        expect(CovidTestForm).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<CovidTestForm />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<CovidTestForm />)
        expect(wrapper).toMatchSnapshot()
    })
})
