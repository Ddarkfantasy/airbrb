import { shallow } from "enzyme";
import DayRangeChoose from "./DayRangeChoose";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";

// no set function
const noop = (value)=>{}
// get two date value as dayjs object
const fakeDateBefore = dayjs(faker.date.past());
const fakeDateAfter = dayjs(faker.date.future());


/** test if the date range can be valid (the start date must before the end)  */
describe('<DayRangeChoose>',()=>{

    it('should render two date picker',()=>{
        const wrapper = shallow(<DayRangeChoose minDate={null} maxDate={null} setMinDate={noop} setMaxDate={noop} setError={noop}/>);
        expect(wrapper.find('.test-date')).toHaveLength(2);
    })

    it('should have default null value',()=>{
      const wrapper = shallow(<DayRangeChoose minDate={null} maxDate={null} setMinDate={noop} setMaxDate={noop} setError={noop}/>);
      const startPicker = wrapper.find('.test-start').at(0);
      const endPicker = wrapper.find('.test-end').at(0);
      expect(startPicker.prop('value')).toEqual(null);
      expect(endPicker.prop('value')).toEqual(null);
    })

    it('should have set valid value',()=>{
      const wrapper = shallow(<DayRangeChoose minDate={fakeDateBefore} maxDate={fakeDateAfter} setMinDate={noop} setMaxDate={noop} setError={noop}/>);
      const startPicker = wrapper.find('.test-start').at(0);
      const endPicker = wrapper.find('.test-end').at(0);
      expect(startPicker.prop('value')).toEqual(fakeDateBefore);
      expect(endPicker.prop('value')).toEqual(fakeDateAfter);
    })

    it('should have reset to null value when end day before start day',()=>{
      const wrapper = shallow(<DayRangeChoose minDate={fakeDateAfter} maxDate={fakeDateBefore} setMinDate={noop} setMaxDate={noop} setError={noop}/>);
      const startPicker = wrapper.find('.test-start').at(0);
      const endPicker = wrapper.find('.test-end').at(0);
      expect(startPicker.prop('value')).toEqual(null);
      expect(endPicker.prop('value')).toEqual(null);
    })
})