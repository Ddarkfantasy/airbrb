import { shallow } from "enzyme";
import MyCardMediaComponent from "./MyCardMediaComponent";
import { faker } from '@faker-js/faker';

// no set function
const noop = ()=>{}

// test if no review the rate and the review number
const testValueNoReview = {
    "title": faker.random.word(5),
    "address": {
      "state": faker.address.state(),
      "city": faker.address.city(),
      "street": faker.address.street()
    },
    "thumbnail": faker.image.avatar(),
    "metadata": {
      "videoUrl": faker.internet.url()
    },
    "reviews": [],
    "status":"accepted"
}

// test if no video, show image
const testValueNoVideo = {
  "title": faker.random.word(5),
  "address": {
    "state": faker.address.state(),
    "city": faker.address.city(),
    "street": faker.address.street()
  },
  "thumbnail": faker.image.avatar(),
  "metadata": {
    "videoUrl": ""
  },
  "reviews": [{score:1},{score:1}],
  "status":"accepted"
}

// test if no status
const testValueNoStatus = {
  "title": faker.random.word(5),
  "address": {
    "state": faker.address.state(),
    "city": faker.address.city(),
    "street": faker.address.street()
  },
  "thumbnail": faker.image.avatar(),
  "metadata": {
    "videoUrl": faker.internet.url()
  },
  "reviews": [{score:1},{score:1}],
}

// test if all values
const testValue = {
  "title": faker.random.word(5),
  "address": {
    "state": faker.address.state(),
    "city": faker.address.city(),
    "street": faker.address.street()
  },
  "thumbnail": faker.image.avatar(),
  "metadata": {
    "videoUrl": faker.internet.url()
  },
  "reviews": [{score:1},{score:1}],
  "status":"accepted"
}

/** test if the loading animation is OK and the computed values right for each information */
describe('<MyCardMediaComponent>',()=>{
    it('should render a loading card',()=>{
        const wrapper = shallow(<MyCardMediaComponent itemValue={null} goToDetailPage={noop}/>);
        // expect(wrapper.exists('.loading')).toEqual(true);
        expect(wrapper.find('.loading').exists()).toEqual(true);
    })

    it('should render a real data card',()=>{
        const wrapper = shallow(<MyCardMediaComponent itemValue={testValue} goToDetailPage={noop}/>);
        expect(wrapper.find('.loading').exists()).toEqual(false);
        // for showing the messages
        expect(wrapper.find('.test-video').exists()).toEqual(true);
        expect(wrapper.find('.test-image').exists()).toEqual(false);
        // title
        expect(wrapper.find('.test-value').get(0).props.children).toEqual(testValue.title);
        // city
        expect(wrapper.find('.test-value').get(1).props.children).toEqual(testValue.address.city);
        // revies
        expect(wrapper.find('.test-value').get(2).props.children[0]).toEqual('2 reviews');
        //status
        expect(wrapper.find('.test-value').get(2).props.children[1]).toEqual(' • accepted');
        // rate
        expect(wrapper.find('.test-value').get(3).props.value).toEqual(1);
    })

    it('show thumbnail when no video',()=>{
        const wrapper = shallow(<MyCardMediaComponent itemValue={testValueNoVideo} goToDetailPage={noop}/>);
        // for showing the thumbnail
        expect(wrapper.find('.test-image').exists()).toEqual(true);
        expect(wrapper.find('.test-video').exists()).toEqual(false);
    })

    it('show 0 when no reviews',()=>{
        const wrapper = shallow(<MyCardMediaComponent itemValue={testValueNoReview} goToDetailPage={noop}/>);
        // revies
        expect(wrapper.find('.test-value').get(2).props.children[0]).toEqual('0 reviews');
        // rate
        expect(wrapper.find('.test-value').get(3).props.value).toEqual(0);
    })

    it('show empty when no status',()=>{
        const wrapper = shallow(<MyCardMediaComponent itemValue={testValueNoStatus} goToDetailPage={noop}/>);
        //status
        expect(wrapper.find('.test-value').get(2).props.children[1]).toEqual('');
    })

    it('the card can be clicked to the detail page',()=>{
      const mockFn = jest.fn();
      const wrapper = shallow(<MyCardMediaComponent itemValue={testValueNoStatus} goToDetailPage={mockFn}/>);
      //status
      wrapper.find('.test-action').at(0).simulate('click');
      expect(mockFn).toHaveBeenCalledTimes(1);
  })
})