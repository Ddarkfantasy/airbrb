import React, { useState,useEffect,useContext } from 'react';
import MyCardMedia from '../components/MyCardMedia';
import TravelHeader from '../components/TravelHeader';
import { Grid } from '@mui/material'
import { allListRequest, bookingListRequest, getSingleListing } from '../config/requests';
import { useSnackbar } from 'notistack';
import SwipeableEdgeDrawer from '../components/SearchDrawer';
import { tokenContext } from '../App.jsx';
import {isAvailableForDateRange,transferDateRange} from '../util/helper';

const initialSearchValues = {
  searchInput:[],
  minBedrooms:null,
  maxBedrooms:null,
  minDate:null,
  maxDate:null,
  minPrice:null,
  maxPrice:null,
  // for rating 1 is from high to low  0 is no ratingSort -1 is low to high
  ratingSort:0
}

/** for home page url : "/" */
const HomePage = () => {

  const {loginEmail} = useContext(tokenContext);
  // all initial state   [bookingList,allList]
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedData, setSortedData] = useState([]);
  const [searchValues, setsearchValues] = useState(initialSearchValues);
  // use new states to control each value change  but only searchValues change then we have new filter result
  // when we click search button this can be controlled by the search part

  // for error
  const { enqueueSnackbar } = useSnackbar();

  // request the list initially
  useEffect(() => {
    setLoading(true);
    const makeRequest = async()=>{
      // save list
      const currentDict = {};
      // get all listings
      const res = await allListRequest();
      if (res.ok) {
        const initialList = res.data.listings;
        // get all the informs for filter
        for (const listing of initialList) {
          const newRes = await getSingleListing(listing.id);
          if(newRes.ok){
            newRes.data.listing.id = listing.id;
            // remove undefined item
            currentDict[listing.id] = newRes.data.listing;
          }
        }
      } else {
        enqueueSnackbar(res.error, { variant: 'warning' });
      }
      
      // if the user loggin then we need another booking list to put in the first
      if (loginEmail) {
        const resBooking = await bookingListRequest();
        // already login and get the data
        if(resBooking.ok){
          // get the status set to informationList
          const bookings = resBooking.data.bookings;
          bookings.forEach((booking)=>{
            if (booking.owner === loginEmail) {
              // then we can see the status
              if(booking.status==="accepted" || booking.status==="pending"){
                currentDict[booking.listingId].status = booking.status;
              }
            }
          });
        }
      }
      // use all the data 
      const currentList = []
      for(let id in currentDict) {
        currentList.push(currentDict[id]);
      }
      setAllData(currentList);
      setLoading(false);
    }
    makeRequest();
  }, [enqueueSnackbar,loginEmail]);

  // when get all lists data then change the filter
  useEffect(() => {
    let dateRange = [];
    if (searchValues.minDate!==null) {
      dateRange = transferDateRange(searchValues.minDate,searchValues.maxDate);
    }
    // first filter then sort
    const resultData =  allData
    .filter((listing)=>{
      // only see the published ones
      if(!listing.published){
        return false;
      }
      // use title and address to search
      const listingString = (listing.title + listing.address.street + listing.address.city+listing.address.state).toUpperCase();
      if (searchValues.searchInput.length!==0) {
        let flag = false;
        for (const searchString of searchValues.searchInput) {
          if (listingString.includes(searchString.toUpperCase())) {
            flag = true;
            break;
          }
        }
        if (flag === false) {
          return false;
        }
      }
      //Bedrooms
      if(searchValues.minBedrooms!==null){
        const bedrooms = listing.metadata.rooms.length;
        if (bedrooms<searchValues.minBedrooms) {
          return false;
        }
      }
      if(searchValues.maxBedrooms!==null){
        const bedrooms = listing.metadata.rooms.length;
        if (bedrooms>searchValues.maxBedrooms) {
          return false;
        }
      }
      //Date
      if(searchValues.minDate!==null){
        // check the date range
        if (!isAvailableForDateRange(listing.availability,dateRange)) {
          return false;
        }
      }
      //Price
      const price = listing.price;
      if(searchValues.minPrice!==null && price < searchValues.minPrice){
        return false;
      }
      if(searchValues.maxPrice!==null && price > searchValues.maxPrice){
        return false;
      }
      return true;
    })
    .sort((a,b)=>{
      const validStatus = ["accepted","pending"];
      const Aname  = a.title.toUpperCase();
      const Bname  = b.title.toUpperCase();
      const Astatus  = a.status;
      const Bstatus  = b.status;
      //original B is the login user's valid booking
      if (!validStatus.includes(Astatus) && validStatus.includes(Bstatus)){
        return 1;
        //A is the login user's valid booking
      } else if (validStatus.includes(Astatus) && !validStatus.includes(Bstatus)){
          return -1;
      }
      // customis sort for ratings
      if(searchValues.ratingSort!==0){
        // from high to low
        const Arating = a.reviews.length===0? 0: a.reviews.reduce(review=>review.rate)/ a.reviews.length;
        const Brating = b.reviews.length===0? 0: b.reviews.reduce(review=>review.rate)/ b.reviews.length;
        if(searchValues.ratingSort===1){
          if (Arating < Brating){
            return 1;
          } else if (Arating > Brating){
              return -1;
          }
        }else{
          // from low to high
          if (Arating < Brating){
            return -1;
          } else if (Arating > Brating){
              return 1;
          }
        }
      }
      // original alphabet sort
      if (Aname < Bname){
          return -1;
      } else if (Aname > Bname){
          return 1;
      }else {
          return 0;
      }
    });
    setSortedData(resultData);
  }, [searchValues,allData]);

  
  

  return (
    <React.Fragment>
      <TravelHeader />
      <SwipeableEdgeDrawer saveSearchValues={setsearchValues}/>
      {/* make responsive list cards xs show 1 item sm show 2  md show 4 */}
      <Grid container spacing={{ xs: 2, sm:2, md: 3 }} columns={{ xs: 2, sm: 4, md: 8, lg: 12 }} mx={2} sx={{ p: 1 }}>
        {Array.from(loading?Array(4):sortedData).map((item, index) => (
          <Grid id={`listing${index}`} item xs={2} sm={2} md={2} key={item?item.id:index}>
            <MyCardMedia itemValue={item} searchValues={searchValues} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  )
}

export default HomePage;