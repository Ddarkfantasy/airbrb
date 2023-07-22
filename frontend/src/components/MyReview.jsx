import React from 'react';
import {Typography,Box,Rating,Card, CardContent} from '@mui/material';

/** create one review for custom listing page and find one rate reviews */
function MyReview(props) {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Card>
            <CardContent>
                <Typography gutterBottom variant="caption" component="div" className='test-value'>
                    {props.review.owner}
                </Typography>
                <Rating name="read-only" sx={{ fontSize: 18}} value={props.review.score} readOnly className='test-value'/>
                <Typography gutterBottom variant="h6" component="div" className='test-value'>
                    {props.review.comment}
                </Typography>
            </CardContent>
        </Card>
    </Box>
  )
}

export default MyReview;