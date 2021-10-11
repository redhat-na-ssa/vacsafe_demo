import React from 'react';
import { shallow } from 'enzyme';
import EmployeeInfoCard from '../../../src/app/Components/EmployeeInfoCard';

describe('<EmployeeInfoCard />', ()=> {
    it('should be defined', () => {
        expect(EmployeeInfoCard).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<EmployeeInfoCard />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<EmployeeInfoCard />)
        expect(wrapper).toMatchSnapshot()
    })
})
