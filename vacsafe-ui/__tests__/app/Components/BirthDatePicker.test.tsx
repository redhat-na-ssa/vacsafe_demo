import React from 'react';
import { shallow } from 'enzyme';
import BirthDatePicker from '../../../src/app/Components/BirthDatePicker';

describe('<BirthDatePicker />', ()=> {
    it('should be defined', () => {
        expect(BirthDatePicker).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<BirthDatePicker control={undefined} defaultBirthDate={undefined} />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<BirthDatePicker control={undefined} defaultBirthDate={undefined} />)
        expect(wrapper).toMatchSnapshot()
    })
})
