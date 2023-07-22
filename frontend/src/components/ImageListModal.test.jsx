
import { shallow } from "enzyme";
import ImageListModal from "./ImageListModal";
import { faker } from '@faker-js/faker';

const images =[faker.internet.avatar,faker.internet.avatar,faker.internet.avatar];

const noop = (value)=>{}

/** test if the imagelist modal can show the right image */
describe('<ImageListModal>',()=>{

  it('should render a model to show one image',()=>{
      const wrapper = shallow(<ImageListModal images={images} open={true} setOpen={noop} index={1} setIndex={noop}/>);
      expect(wrapper.find('img')).toHaveLength(1);
  })

  it('should render the right image',()=>{
    const wrapper = shallow(<ImageListModal images={images} open={true} setOpen={noop} index={1} setIndex={noop}/>);
    expect(wrapper.find('img').at(0).prop('src')).toEqual(images[1]);
  })

  it('should have 3 buttons',()=>{
    const wrapper = shallow(<ImageListModal images={images} open={true} setOpen={noop} index={1} setIndex={noop}/>);
    expect(wrapper.find('.test-click')).toHaveLength(3);
  })

  it('should click to close the model',()=>{
    const mockFn = jest.fn();
    const wrapper = shallow(<ImageListModal images={images} open={true} setOpen={mockFn} index={1} setIndex={noop}/>);
    wrapper.find('.test-click').at(0).simulate('click');
    expect(mockFn).toHaveBeenCalledTimes(1);
  })

  it('should click to previous image',()=>{
    const mockFn = jest.fn();
    const wrapper = shallow(<ImageListModal images={images} open={true} setOpen={noop} index={1} setIndex={mockFn}/>);
    wrapper.find('.test-click').at(1).simulate('click');
    expect(mockFn).toHaveBeenCalledTimes(1);
  })

  it('should click to next image',()=>{
    const mockFn = jest.fn();
    const wrapper = shallow(<ImageListModal images={images} open={true} setOpen={noop} index={1} setIndex={mockFn}/>);
    wrapper.find('.test-click').at(2).simulate('click');
    expect(mockFn).toHaveBeenCalledTimes(1);
  })

})

