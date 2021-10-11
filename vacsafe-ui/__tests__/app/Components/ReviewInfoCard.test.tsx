import React from 'react';
import { shallow } from 'enzyme';
import ReviewInfoCard from '../../../src/app/Components/ReviewInfoCard';

describe('<ReviewInfoCard />', ()=> {
    it('should be defined', () => {
        expect(ReviewInfoCard).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<ReviewInfoCard />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<ReviewInfoCard />)
        expect(wrapper).toMatchSnapshot()
    })
})
