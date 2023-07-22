import { shallow } from "enzyme";
import MyReview from "./MyReview";
import { faker } from '@faker-js/faker';

const review = {
    owner:faker.internet.email(),
    comment:faker.random.words(10),
    score:[1,2,3,4,5][Math.floor(Math.random()*5)]
}

/** test if the review car part can show right information */
describe('<MyReview>',()=>{

    it('should render a card to show the comment',()=>{
        const wrapper = shallow(<MyReview review={review}/>);
        expect(wrapper.find('.test-value')).toHaveLength(3);
    })

    it('show right owner',()=>{
        const wrapper = shallow(<MyReview review={review}/>);
        // owner
        expect(wrapper.find('.test-value').get(0).props.children).toEqual(review.owner);
    })

    it('show right score',()=>{
        const wrapper = shallow(<MyReview review={review}/>);
        // score
        expect(wrapper.find('.test-value').get(1).props.value).toEqual(review.score);
    })

    it('show right comment',()=>{
        const wrapper = shallow(<MyReview review={review}/>);
        // comment
        expect(wrapper.find('.test-value').get(2).props.children).toEqual(review.comment);
    })
})
