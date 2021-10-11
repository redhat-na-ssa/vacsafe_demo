import React from 'react';
import { shallow } from 'enzyme';
import CardWithTitle from '../../../src/app/Components/CardWithTitle';

describe('<CardWithTitle />', ()=> {
    it('should be defined', () => {
        expect(CardWithTitle).toBeDefined()
    })
    it("should render without crashing", () => {
        const wrapper = shallow(<CardWithTitle />)
        expect(wrapper)
    })
    it("should match existing snapshot", () => {
        const wrapper = shallow(<CardWithTitle />)
        expect(wrapper).toMatchSnapshot()
    })
})
