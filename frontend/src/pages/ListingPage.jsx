import React, { useState,useEffect,useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TravelHeader from '../components/TravelHeader';
import { tokenContext } from '../App.jsx';
import { bookingListRequest, getSingleListing, saveReviewRequest, addBookingRequest } from '../config/requests';
import {
    Box,
    Button,
    Grid,
    Stack,
    Divider,
    Typography,
    TextareaAutosize,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell
} from '@mui/material';
import {amenitiesConfig} from '../config/amenities';
import MySeparator from '../components/MySeparator';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListModal from '../components/ImageListModal';
import MyReview from "../components/MyReview";
import Rating from '@mui/material/Rating';
import {isNotBlank,isSmallScreen,transferDateRange,isAvailableForDateRange} from '../util/helper';
import { useSnackbar } from 'notistack';
import dayjs from "dayjs";
import DayRangeChoose from '../components/DayRangeChoose';
import MyToolTip from '../components/MyToolTip';
import { DateObject, Calendar } from 'react-multi-date-picker';

/**compute the number of beds */
const getBeds=(rooms)=>{
    let beds = rooms.reduce((totalRooms, room) => totalRooms + Object.values(room).reduce((num,bedsNum)=>{return num+bedsNum},0), 0);
    return beds;
}

/**compute the average rate use number */
const getAverageRate=(reviews)=>{
    if (reviews.length) {
        return Math.floor(reviews.map((review)=>review.score).reduce((a,b)=>a+b)/reviews.length);
    }
    return 0;
}

/**get the initial end date dayjs */
const getInitialDate = (dateString)=>{
    if (dateString) {
        return dayjs(dateString, "DD-MM-YYYY");
    }else{
        return null;
    }
}

/**get the end date string */
const getEndDate = (dateRange)=>{
    const endIndex = dateRange.length-1;
    return dayjs(dateRange[endIndex],'DD/MM/YYYY').add(1,'day').format('DD/MM/YYYY');
}

/** The listing page */
function ListingPage(props) {
    // use the loading data 
  const params = useParams();
  const navigate = useNavigate();
  const {minDateString,maxDateString} = params;
  // get the user
  const {loginEmail} = useContext(tokenContext);
  const [loadData, setLoadData] = useState({});
  // for the customer to rate the original value is the avg value of reviews 
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  // control the send button
  const [disable, setDisable] = useState(true);
  const [disableBook, setDisableBook] = useState(true);
  // control the bookingId to leave a review;
  const [bookingId, setBookingId] = useState(null);
  // control the imagelist cols
  const [cols, setCols] = useState(3);

  // control date range
  const [maxDate, setMaxDate] = useState(getInitialDate(maxDateString));
  const [minDate, setMinDate] = useState(getInitialDate(minDateString));
  // control date range
  const [dateRange, setDateRange] = useState([]);
  useEffect(() => {
    // change to a valid range
    if (minDate) {
        setDateRange(transferDateRange(minDate,maxDate));
    }
  }, [minDate,maxDate])
  
  
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = React.useState("");
  useEffect(() => {
    if(error!==""){
      enqueueSnackbar(error, { variant: 'warning' });
    }
  }, [error,enqueueSnackbar]);
  
  // for reloading
  const [loading, setLoading] = useState(true);

  // control the image list modal
  const [Images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  // open the image use click
  const handleOpenPreviewModal = (index) => {
    setImageIndex(index);
    setPreviewModalOpen(!previewModalOpen);
  }

  // responsive to check the imagelist cols
  useEffect(() => {
    window.onresize =()=>{
        if (isSmallScreen()) {
           setCols(1); 
        }else{
            setCols(3);
        }
    }
  }, [setCols]);
  


    /** get the all relative information to load */
  useEffect(() => {
    const getListingDetail = async() => {
        const resListing = await getSingleListing(params.id);
        let listing = null;
        if(resListing.ok){
            resListing.data.listing.id = params.id;
            listing = resListing.data.listing;
            // check the listing is published
            if (!listing.published) {
                enqueueSnackbar('No such listing', { variant: 'warning' });
                navigate('/');
            }
        }else{
            enqueueSnackbar(resListing.error, { variant: 'warning' });
            navigate('/');
        }
        let bookings = [];
        let myBookings = [];
        // if not logined then can not see bookings
        if (loginEmail) {
            const resBooking = await bookingListRequest();
            // get all relative bookings
            if(resBooking.ok){
                const bookingList = resBooking.data.bookings;
                bookings = bookingList.filter((booking)=>booking.listingId === params.id);
                myBookings = bookings.filter((booking)=>booking.owner === loginEmail);
            }
        }
        setScore(getAverageRate(listing.reviews));
        // find the bookingId
        myBookings.forEach(booking => {
            if (booking.status === "accepted") {
                setBookingId(booking.id);
            }
        });
        setLoadData({bookings,listing,myBookings});
        setImages([listing.thumbnail,...listing.metadata.images]);
    };
    getListingDetail();
  }, [params,loginEmail,loading,enqueueSnackbar,navigate]);

  // update the dateRange
  useEffect(() => {
    if (minDate && maxDate) {
        setDateRange(transferDateRange(minDate,maxDate))
    }
  }, [minDate,maxDate]);
  
  // check button can be used
  useEffect(() => {
    if (bookingId!==null && isNotBlank(comment)) {
        setDisable(false);
    }else{
        setDisable(true);
    }
  }, [score,comment,setDisable,bookingId]);

  useEffect(() => {
    // if no date range or invalid date Range can not use
    if (dateRange.length!==0 && loadData.listing) {
        if (isAvailableForDateRange(loadData.listing.availability,dateRange)) {
            setDisableBook(false);
        }else{
            // have range but invalid  tell the customer
            enqueueSnackbar("Sorry, the date choose is not available o(╥﹏╥)o", { variant: 'warning' });
            setDisableBook(true);
        }
    }else{
        setDisableBook(true);
    }
  }, [dateRange,enqueueSnackbar,setDisableBook,loadData]);
  
  // save a new review
  const saveReview = ()=>{
    const review = {
        bookingId:bookingId,
        listingId:loadData.listing.id,
        owner:loginEmail,
        comment: comment, 
        score: score
    };
    const sendRequest = async ()=>{
        const res = await saveReviewRequest(review);
        if (res.ok) {
            // toogle loading to control the page to send request
            setLoading(!loading);
            // clear comment
            setComment("");
        }else{
            enqueueSnackbar(res.error, { variant: 'warning' });
        }
    }
    sendRequest();
  }
  // send a new booking
  const sendBook = ()=>{
    const newBooking = {
        dateRange: dateRange,
        totalPrice: dateRange.length * loadData.listing.price,
        listingId : loadData.listing.id
    };
    const sendRequest = async ()=>{
        const res = await addBookingRequest(newBooking);
        if (res.ok) {
            // toogle loading to control the page to send request
            enqueueSnackbar(`Booking Success for your ${dateRange[0]} to ${getEndDate(dateRange)} stay!
            Total $${newBooking.totalPrice}.`, { variant: 'success' });
            setLoading(!loading);
        }else{
            enqueueSnackbar(res.error, { variant: 'warning' });
        }
    }
    sendRequest();
  }

  return (
    <React.Fragment>
        <TravelHeader />
        {/* when click a image, use can check origin image */}
        <ImageListModal className="imageListModal" open={previewModalOpen} setOpen={setPreviewModalOpen} images={Images} index={imageIndex} setIndex={setImageIndex}/>
        {/* first part for title address price */}
        {loadData.listing && <Box sx={{ width: '100%', minWidth: 360, bgcolor: 'background.paper' }}>
        {/* {loadData.bookings && <ListingProfitsGraph bookings={loadData.bookings}/>} */}
            <Box sx={{ my: 3, mx: 2 }}>
                <Grid container alignItems="center">
                    <Grid item xs>
                        <Typography gutterBottom variant="h4" component="div">
                        {loadData.listing.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="h6" component="div">
                        ${dateRange.length===0?loadData.listing.price:loadData.listing.price*dateRange.length}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">
                    <Grid item>
                        <MyToolTip reviews={loadData.listing.reviews}/>
                    </Grid>
                    <Grid item>
                        <Typography color="text.primary" variant="body2">
                        &nbsp;•&nbsp;{loadData.listing.reviews.length} reviews&nbsp;•&nbsp;{loadData.listing.address.street+','+loadData.listing.address.city+','+loadData.listing.address.state}
                        </Typography>
                    </Grid>
                </Grid>
                
                <MySeparator/>
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <DayRangeChoose minDate={minDate} maxDate={maxDate} setMinDate={setMinDate} setMaxDate={setMaxDate} setError={setError}/>
                    <Button variant="contained" disabled={disableBook} onClick={sendBook} name="bookButton">
                        Book!
                    </Button>
                </Stack>

                {/* show user which date is available */}
                <MySeparator/>
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography variant="h6" component="div">
                        Available Check in Dates
                    </Typography>
                    <Calendar
                    readOnly
                        value={
                            loadData.listing.availability[0].map((date)=>new DateObject({
                                date: date,
                                format: 'DD/MM/YYYY'
                            }))
                        }
                    />
                </Stack>
            </Box>
            <ImageList
                sx={{ width: "100%", height: 365 }}
                variant="quilted"
                cols={cols}
                >
                {Images.map((item,index) => (
                    <ImageListItem key={index} cols={1} rows={1}
                      onClick={() => handleOpenPreviewModal(index)}>
                    <img
                        src={item}
                        alt={loadData.listing.title+"-"+index}
                        loading="lazy"
                    />
                    </ImageListItem>
                ))}
            </ImageList>
            <Divider variant="middle" />
            <Box
                sx={{
                display: 'flex',
                // responsive to change flex direction
                flexDirection: { xs: 'column', md: 'row' },
                width: '100%',
                borderRadius: 1,
                bgcolor: 'background.paper',
                '& svg': {
                    m: 1.5,
                },
                '& hr': {
                    mx: 0.5,
                },
                }}
            >
                {/* second left part more detail about the listing */}
            <Box sx={{ m: 2, width: 'fit-content'}} >
                <Typography gutterBottom variant="h5" component="div">
                        {loadData.listing.metadata.propertyType}
                </Typography>
                <Typography color="text.secondary" component="div">
                {loadData.listing.metadata.rooms.length} bedrooms &nbsp;•&nbsp; 
                {getBeds(loadData.listing.metadata.rooms)} beds &nbsp;•&nbsp; 
                {loadData.listing.metadata.bathrooms} baths
                </Typography>
                <MySeparator/>
                <Typography gutterBottom variant="body1">
                Amenities:
                </Typography>
                <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}>
                    {loadData.listing.metadata.amenities.map((amentie,index)=>{
                        return <React.Fragment key={"amentie-"+index}>{
                            <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={1}>
                            {amenitiesConfig.standout[amentie]?
                            amenitiesConfig.standout[amentie]:(amenitiesConfig.basics[amentie]?
                                amenitiesConfig.basics[amentie]:amenitiesConfig.safety[amentie])}
                        <Typography variant="caption" sx={{textAlign: 'center', lineHeight:1, px: 1, pt: 1, verticalAlign: 'center' }}>{amentie}</Typography>    
                        </Stack>
                                }</React.Fragment>;
                    })}
                </Stack>
            </Box>
            <Divider orientation="vertical" flexItem />
            {/* second right part for the views */}
            <Box sx={{ m: 2, width:"100%" }} >
            <Typography gutterBottom variant="body1">
                Your bookings
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 365 }} aria-label="your-booking">
                    {loadData.myBookings && <caption>{loadData.myBookings.length===0?'No your Bookings (ಥ﹏ಥ)':'This is all your bookings (*^▽^*)'}</caption>}
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">check in</TableCell>
                            <TableCell align="center">check out</TableCell>
                            <TableCell align="center">total price</TableCell>
                            <TableCell align="center">status</TableCell>
                        </TableRow>
                    </TableHead>
                    {loadData.myBookings && <TableBody>
                        {/* reverse the bookings to see the recent one first */}
                    {[...loadData.myBookings].reverse().map((booking,index) => (
                        <TableRow key={booking.id+"-"+index}>
                            <TableCell align="center">{booking.dateRange[0]}</TableCell>
                            <TableCell align="center">{getEndDate(booking.dateRange)}</TableCell>
                            <TableCell align="center">{booking.totalPrice}</TableCell>
                            <TableCell align="center">{booking.status}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>}
                </Table>
            </TableContainer>
            <MySeparator/>
                <Typography gutterBottom variant="body1">
                Reviews
                </Typography>
                {/* control for accepted people to leave a review, or tool to see the special score reviews*/}
                <Rating
                name="simple-controlled"
                value={score}
                onChange={(event, newValue) => {
                    setScore(newValue);
                }}
                />
                <TextareaAutosize
                aria-label="your-reviw"
                id="leaveReview"
                minRows={3}
                placeholder="Please leave your review"
                style={{ width: "100%" }}
                value={comment}
                onChange={(event)=>setComment(event.target.value)}
                disabled={bookingId?false:true}
                />
                <Box sx={{ mt: 1, ml: 1, mb: 1 }} textAlign="center">
                    <Button variant="contained" disabled={disable} onClick={saveReview} name="saveReview">
                        Save
                    </Button>
                </Box>
                {/* reverse the sort to see new review in the first */}
                <Stack
                direction="column-reverse"
                justifyContent="center"
                alignItems="center"
                spacing={0.5}
                >
                {loadData.listing.reviews.map((review,index)=>(
                    <MyReview review={review} key={review.owner+'-'+index}  />
                ))}
                </Stack>
            </Box>
            </Box>
        </Box>}
    </React.Fragment>
  )
}

export default ListingPage;
