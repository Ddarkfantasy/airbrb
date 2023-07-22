import React from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Rating,
  Grid,
} from '@mui/material';

// use a noop function as loading function
const noop = ()=>{}

/** 
 * for the list card when loading use media animation
 * Title
 * Thumbnail of property (or video if advanced)
 * Number of total reviews
 */
function MyCardMediaComponent(props) {
  const {itemValue,goToDetailPage} = props;
  return (
    <Card sx={{bgcolor:'rgb(255,255,255,0.8)'}}>
      {itemValue?(
      <CardActionArea onClick={goToDetailPage} className='test-action'>
        {itemValue.metadata.videoUrl===""?(
          <CardMedia
          component="img"
          height='300'
          image={itemValue.thumbnail}
          alt={itemValue.title}
          className="test-image"
          />
        ):(
          <CardMedia
          component="iframe"
          id={`myVideo-${itemValue.metadata.videoUrl}`}
          alt={itemValue.title}
          src={itemValue.metadata.videoUrl}
          height='300'
          frameBorder="0"
          allowFullScreen
          className="test-video"
          />
        )}
        <CardContent sx={{ pt: 1 }} className="myCardContent">
          <Box >
            <Typography gutterBottom variant="h6" component="div" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}  className="test-value">
              {itemValue.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}  className="test-value">
              {/* only show city in the home page */}
              {itemValue.address.city}
            </Typography>
            <Box justifyContent="space-between" sx={{ whiteSpace: 'nowrap' }}>
              <Grid item>
                <Typography display="block" variant="caption" color="text.secondary" className="test-value">
                  {`${itemValue.reviews.length} reviews`}
                  {itemValue.status?` • ${itemValue.status}`:""}
                </Typography>
              </Grid>
              <Grid item>
                <Rating  className="test-value" name="read-only" sx={{ fontSize: 18}} value={itemValue.reviews.length===0?
                  0: Math.floor(itemValue.reviews.map((review)=>review.score).reduce((a,b)=>a+b)/ itemValue.reviews.length)} 
                  readOnly />
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>):(
        // loading skeleton
      <CardActionArea onClick={noop} className='loading'>
          <Skeleton variant="rectangular" animation="wave" sx={{ height: 300 }}/>
        <CardContent>
            <Box sx={{ pt: 0.5 }}>
                <Skeleton animation="wave" />
                <Skeleton width="60%" animation="wave" />
            </Box>
        </CardContent>
      </CardActionArea>)}
    </Card>
  )
}

export default MyCardMediaComponent;