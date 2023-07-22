import React, { useEffect, useContext } from 'react';
import { tokenContext } from '../App';
import HostingHeader from '../components/HostingHeader';
import HostingListings from '../components/HostingListings';
import ListingProfitsGraph from '../components/ListingProfitsGraph';
import { bookingListRequest, allListRequest  } from '../config/requests';
import { useSnackbar } from 'notistack';

const HostingHomePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const tokenData = useContext(tokenContext);
  const [listings, setListings] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      // get all my listings id
      const res = await allListRequest();
      let mylistings = [];
      if (res.ok) {
        mylistings = res.data.listings;
      } else {
        enqueueSnackbar(res.error, { variant: 'warning' });
      }
      const mylistingsIds = mylistings.filter(listing => listing.owner === tokenData.loginEmail).map(listing => `${listing.id}`);

      // get all bookings from my listings
      const res2 = await bookingListRequest();
      if (res2.ok) {
        const mybookings = res2.data.bookings.filter(booking => mylistingsIds.includes(`${booking.listingId}`));
        setBookings(mybookings);
      }
    };
    fetchListings();
  }, [enqueueSnackbar, tokenData.loginEmail]);

  return (
    <React.Fragment>
      <HostingHeader />
      <HostingListings listings={listings} setListings={setListings}/>
      <ListingProfitsGraph bookings={bookings}/>
    </React.Fragment>
  )
}

export default HostingHomePage;