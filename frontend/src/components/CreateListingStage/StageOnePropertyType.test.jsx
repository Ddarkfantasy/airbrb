import { shallow } from "enzyme";
import StageOnePropertyType from "./StageOnePropertyType";

// for basic set
const propertyTypes = [
  'Apartment',
  'House',
  'Self-contained unit',
  'Unique space',
  'Bed and breakfast',
  'Boutique hotel',
];

// for choosed one property
const chooseIndex = Math.floor(Math.random()*6); 
const chooseString = propertyTypes[chooseIndex];

const noop = (value)=>{};
/** test if propertyType can be choose the right way and show all types to choose */
describe('<ImageListModal>',()=>{

  it('should render a 6 type propertys',()=>{
      const wrapper = shallow(<StageOnePropertyType propertyType={chooseString} setPropertyType={noop} />);
      expect(wrapper.find('.test-options')).toHaveLength(6);
  })

  it('should have the right propertyType',()=>{
    const wrapper = shallow(<StageOnePropertyType propertyType={chooseString} setPropertyType={noop} />);
    const chooseType = wrapper.find('.test-options').at(chooseIndex);
    const realChooseString =  chooseType.find('.test-info');
    expect(realChooseString.text()).toEqual(chooseString);
  })

  it('should have the right propertyType to be chosed',()=>{
    const wrapper = shallow(<StageOnePropertyType propertyType={chooseString} setPropertyType={noop} />);
    const chooseType = wrapper.find('.test-options').at(chooseIndex);
    // it will have different style
    // bgcolor:'rgb(255,255,255,0.7)'
    expect(chooseType.prop('sx').bgcolor).toEqual('rgb(255,255,255,0.7)');
    // else bgcolor:'rgb(255,255,255,0.2)'
  })

  it('should show default style when not choosed',()=>{
    const wrapper = shallow(<StageOnePropertyType propertyType='' setPropertyType={noop} />);
    const chooseType = wrapper.find('.test-options').at(chooseIndex);
    // else bgcolor:'rgb(255,255,255,0.2)'
    expect(chooseType.prop('sx').bgcolor).toEqual('rgb(255,255,255,0.2)');
  })

  it('should click to set the propertyType',()=>{
    const mockFn = jest.fn();
    const wrapper = shallow(<StageOnePropertyType propertyType='' setPropertyType={mockFn} />);
    const chooseType = wrapper.find('.test-options').at(chooseIndex);
    chooseType.simulate('click');
    expect(mockFn).toHaveBeenCalledTimes(1);
  })

})


