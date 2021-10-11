import React from 'react';
import { shallow } from 'enzyme';
import CovidVaxForm from '../../../src/app/Components/CovidVaxForm';

describe('<CovidVaxForm />', ()=> {
    it('should be defined', () => {
        expect(CovidVaxForm).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<CovidVaxForm />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<CovidVaxForm />)
        expect(wrapper).toMatchSnapshot()
    })
})
