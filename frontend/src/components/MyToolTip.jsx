import {useState,useEffect} from 'react';
import {Popover,Typography,Rating,Stack} from '@mui/material';
import MyFullScreenDialog from "./MyFullScreenDialog";

/** compute the reviews relative statistics */
const computeReviews =(reviews)=>{
    const computedReviews = {
        1:[],
        2:[],
        3:[],
        4:[],
        5:[],
        statistic:{
            1:{},
            2:{},
            3:{},
            4:{},
            5:{}
        },
        number:0,
        totalRate:0,
        avgRate:0
    };
    if (!reviews) {
        return null;
    }
    reviews.forEach((review)=>{
        computedReviews.number += 1;
        computedReviews.totalRate += review.score;
        computedReviews[review.score].push(review);
    });
    // for statistics
    computedReviews.avgRate = computedReviews.number===0?0:computedReviews.totalRate/ computedReviews.number;
    for (let index = 1; index < 6; index++) {
        computedReviews.statistic[index] = {
            number:computedReviews[index].length,
            ratio:computedReviews.number===0?0:computedReviews[index].length/computedReviews.number
        }
    }
    return computedReviews;
}

/** used for the rating tool*/
function MyToolTip(props) {
    // get from the parent all the ratings
    const {reviews} = props;
    // compute for the reviews for each score and the total score and the ratio
    const [computedReviews, setComputedReviews] = useState(computeReviews(reviews));
    // for popover
    const [anchorEl, setAnchorEl] = useState(null);
    const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
    setAnchorEl(null);
    };
  const open = Boolean(anchorEl);
  useEffect(() => {
    setComputedReviews(computeReviews(reviews));
  }, [reviews])

  return (<>
    {computedReviews && <div>
            <Typography
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="dialog"
            onMouseEnter={handlePopoverOpen}
            // onMouseLeave={handlePopoverClose}
            >
            <Rating 
            name="read-only" 
            sx={{ fontSize: 18}} 
            value={Math.floor(computedReviews.avgRate)} 
            readOnly
            />
            {Math.round(computedReviews.avgRate*10)/10}
            </Typography>
            <Popover
            // hideBackdrop
            id="mouse-over-popover"
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            onMouseLeave={handlePopoverClose}
            disableRestoreFocus            
            >
            {/* for reviews data showing */}
            <Rating 
            name="read-only" 
            sx={{ fontSize: 18}} 
            value={Math.floor(computedReviews.avgRate)}
            readOnly
            />
                {`${Math.round(computedReviews.avgRate*10)/10} out of 5, ${computedReviews.number} reviews`}
                <Stack
                    direction="column-reverse"
                    justifyContent="center"
                    spacing={1}
                    >
                {[1,2,3,4,5].map((i)=>
                    <MyFullScreenDialog 
                    title={`${i}★  ${computedReviews.statistic[i].number} people rated-${Math.round(computedReviews.statistic[i].ratio*1000)/10}%`} 
                    key={i} 
                    reviews={computedReviews[i]}/>
                )}
                </Stack>
            </Popover>
      </div>
    }
    </>
  );
}

export default MyToolTip;