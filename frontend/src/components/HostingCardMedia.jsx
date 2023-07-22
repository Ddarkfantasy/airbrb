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
import { SingleBedOutlined, ShowerOutlined, DeleteOutline, ShareLocationOutlined, EventBusy, BorderColor } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// use a noop function as loading function
const noop = ()=>{}

/** 
 * for the list card when loading use media animation
 * Title
 * Thumbnail of property (or video if advanced)
 * Number of total reviews
 */
function HostingCardMedia(props) {
  const { itemValue, published, setOpenDelete, setOpenUnlife } = props;

  const navigate = useNavigate();
  const goToEditPage = ()=>{
    // navigate to edit page
    navigate('/hosting/edit/'+itemValue.id);
  }

  const handleGoLive = (listingId) => {
    navigate('/hosting/publish/'+listingId);
  }
  const gotoViewBookingPage = () => {
    if (published) {
      navigate('/hosting/viewbookings/'+itemValue.id);
    }
  }
  return (
    <Card sx={{bgcolor:'rgb(255,255,255,0.8)', height: 150 }} className="hostingMediaCard">

      {itemValue?(
      <CardActionArea sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box sx={{ height: 150, width: 150 }}>
        {itemValue.metadata.videoUrl===""?(
          <CardMedia
          component="img"
          image={itemValue.thumbnail}
          alt={itemValue.title}
          sx={{ height: 150, width: 150 }}
          />
        ):(
          <CardMedia
          component="iframe"
          alt={itemValue.title}
          src={itemValue.metadata.videoUrl}
          sx={{ height: 150, width: 150 }}
          frameBorder="0"
          allowFullScreen
          />
        )}
        </Box>
        <CardContent sx={{ py: 0, px: 1,  width: '100%', height: 150, overflow: 'hidden' }}>
          {/* if click this box, you can check all bookings it */}
          <Box sx={{ width: '100%', pt: 1 }} onClick={gotoViewBookingPage} name="checkBookingButton">
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ lineHeight: 1.1, whiteSpace: 'nowrap' }}>
              {itemValue.title}
            </Typography>
            <Typography variant="body3" color="text.secondary" sx={{ overflow: 'clip' }}>
              {/* only show city in the home page */}
              {itemValue.address.state}, {itemValue.address.city}
            </Typography>

            {/* show price and property type in one line*/}
            <Box justifyContent="space-between" display='flex' flexDirection='row' sx={{ whiteSpace: 'nowrap', my: 0.4 }}>
                <Typography variant="body3" color="text" sx={{ textDecoration: 'underline' }}>
                  ${itemValue.price} AUD
                </Typography>
                <Typography variant="body3" color="text.secondary" sx={{ ml: 1 }}>
                  {itemValue.metadata.propertyType}
                </Typography>
            </Box>
            {/* show beds and bathroom number in one line */}
            <Box display='flex' flexDirection='row' sx={{ whiteSpace: 'nowrap' }}>
              <Box display={'flex'}>
                <Typography variant="body3" color="text" sx={{lineHeight: 1.7}}>
                  {itemValue.metadata.rooms.reduce((totalRooms, room) => totalRooms + Object.values(room).reduce((num,bedsNum)=>{return num+bedsNum},0), 0)}
                </Typography>
                <SingleBedOutlined sx={{ color: '#555' }}/>
              </Box>
              <Box display={'flex'}>
                <Typography variant="body3" color="text" sx={{ lineHeight: 1.7, ml: 1 }}>
                  {itemValue.metadata.bathrooms} 
                </Typography>
                <ShowerOutlined sx={{ color: '#555' }}/>
              </Box>
            </Box>

            <Box justifyContent="space-between" display='flex' flexDirection='row' sx={{ whiteSpace: 'nowrap' }}>
              <Grid item>
                <Typography display="block" variant="caption" color="text.secondary" >
                  {`${itemValue.reviews.length} reviews`}
                  {itemValue.status?` • ${itemValue.status}`:""}
                </Typography>
              </Grid>
              <Grid item>
                <Rating name="read-only" sx={{ fontSize: 18, ml: 2 }} value={itemValue.reviews.length===0?
                  0: Math.floor(itemValue.reviews.map(review=>review.score).reduce((a,b)=>a+b)/ itemValue.reviews.length)} 
                  readOnly />
              </Grid>
            </Box>            
          </Box>

          {/* control button of the media card, delet or publish or unpublish */}
          <Box justifyContent="space-between" display='flex' flexDirection='row'>
            {/* delete button */}
                <Box sx={{ p: 0.9, cursor: 'pointer', color: 'red', textAlign: 'center' }} onClick={ () => setOpenDelete(true) } name="deleteButton">
                  <DeleteOutline sx={{ fontSize: 20, mr: 0.5 }} />
                </Box>
                {published ?
                // unpublish button
                <Box sx={{ p: 0.9 }} onClick={ () => setOpenUnlife(true) } name="unPublishButton">
                  <EventBusy sx={{ fontSize: 20, mr: 0.5, color: 'red' }} />
                </Box>
                :
                <Box sx={{ p: 0.9, cursor: 'pointer', color: '#24a0ed', textAlign: 'center' }} onClick={() => handleGoLive(itemValue.id)} name="publishButton">
                  <ShareLocationOutlined sx={{ fontSize: 20, mr: 0.5 }}/>
                </Box>
                }
                
                {/* edit button */}
                <Box sx={{ p: 0.9, cursor: 'pointer', color: '#24a0ed', textAlign: 'center' }} onClick={goToEditPage} name="editButton">
                  <BorderColor sx={{ fontSize: 20, mx: 0.5 }} />
                </Box>
            </Box>
        </CardContent>
      </CardActionArea>):(
        // loading skeleton
      <CardActionArea onClick={noop}>
          <Skeleton variant="rectangular" animation="wave" sx={{ height: 300 }}/>
        <CardContent>
            <Box sx={{ pt: 0.5 }}>
                <Skeleton animation="wave" />
                <Skeleton width="60%" animation="wave" />
            </Box>
        </CardContent>
      </CardActionArea>)}
    </Card>
  );
}

export default HostingCardMedia;
