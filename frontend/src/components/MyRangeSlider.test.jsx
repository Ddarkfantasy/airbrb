import { shallow } from "enzyme";
import MyRangeSlider from "./MyRangeSlider";

// no set function
const noop = (value)=>{}
// test value for default  bedroom => 0 to 50;  AUD => 0 to 10000
const testValue = [0,100];

/** test if the range slider choose can have different mode and show right text */
describe('<MyRangeSlider>',()=>{

    it('should render a bedrooms choose Box with Bedroom mode',()=>{
        const wrapper = shallow(<MyRangeSlider value={testValue} setValue={noop} mode="Bedroom"/>);
        expect(wrapper.exists('#bedroom-number')).toEqual(true);
        expect(wrapper.find('#price-range').exists()).toEqual(false);
    })

    it('should render a price choose Box with AUD mode',()=>{
        const wrapper = shallow(<MyRangeSlider value={testValue} setValue={noop} mode="AUD"/>);
        expect(wrapper.exists('#price-range')).toEqual(true);
        expect(wrapper.find('#bedroom-number').exists()).toEqual(false);
    })

    it('should show right label information with bedroom choose',()=>{
        const wrapper = shallow(<MyRangeSlider value={testValue} setValue={noop} mode="Bedroom"/>);
        const information = wrapper.find('#bedroom-number');
        expect(information.text()).toEqual('Bedroom number: 0 to 50');
    })

    it('should show right label information with price choose',()=>{
        const wrapper = shallow(<MyRangeSlider value={testValue} setValue={noop} mode="AUD"/>);
        const information = wrapper.find('#price-range');
        expect(information.text()).toEqual('Price choose: 0 AUD to 10000 AUD');
    })
})