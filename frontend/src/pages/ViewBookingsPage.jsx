import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { tokenContext } from '../App';
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, } from '@mui/material';
import HostingHeader from '../components/HostingHeader';
import { bookingListRequest, getSingleListing, acceptBooking, declineBooking } from '../config/requests';
import { useSnackbar } from 'notistack';
import dayjs from "dayjs";

const getEndDate = (dateRange)=>{
  const endIndex = dateRange.length-1;
  return dayjs(dateRange[endIndex],'DD/MM/YYYY').add(1,'day').format('DD/MM/YYYY');
}

const ViewBookingPage = () => {
  // handle the dialog open state
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  // active bookingid is the one you click
  const [activeBooking, setActiveBooking] = useState(null);
  const changeStatusModal = (bookingId) => {
    setActiveBooking(bookingId);
    setOpenChangeStatus(true);
  }
  // if click reject, send request to backend and refresh the page
  // the request will be moved to history
  const handleReject = async () => {
    const res = await declineBooking(activeBooking);
    if (res.ok) {
      enqueueSnackbar('Booking declined', { variant: 'info' });
      setOpenChangeStatus(false);
      setLoading(true);
    } else {
      enqueueSnackbar(res.error, { variant: 'error' });
    }
  }
  // if click accept, send request to backend and refresh the page
  // the request will be moved to history
  const handleAccept = async () => {
    const res = await acceptBooking(activeBooking);
    if (res.ok) {
      enqueueSnackbar('Booking accepted', { variant: 'success' });
      setOpenChangeStatus(false);
      setLoading(true);
    }
    else {
      enqueueSnackbar(res.error, { variant: 'error' });
    }
  }

  const tokenData = useContext(tokenContext);
  const { enqueueSnackbar } = useSnackbar();
  // get id from url
  const { id } = useParams();

  // bookings is the requests from the user
  const [bookings, setBookings] = useState([]);
  // history is the bookings that have been accepted or declined
  const [history, setHistory] = useState([]);
  // if set loading, the page will reload the data
  const [loading, setLoading] = useState(true);
  // the data of the listing(only one)
  const [listingInfo, setListingInfo] = useState({});

  // load listing info and bookings
  useEffect(() => {
    // if in loading , fetch all bookings, and set history and requests
    const fetchBookingList = async () => {
      const resListing = await getSingleListing(id);
      if (resListing.ok) {
        setListingInfo(resListing.data.listing);
      } else {
        enqueueSnackbar(resListing.error, { variant: 'warning' });
      }
      const tmpBookings = [];
      const tmpHistory = [];
      const res = await bookingListRequest(id);
      if (res.ok) {
        res.data.bookings.forEach((booking) => {
          if (parseInt(booking.listingId) === parseInt(id)) {
            if (booking.status === 'pending') {
              tmpBookings.push(booking);
            } else {
              tmpHistory.push(booking);
            }
          }
        })
      } else {
        enqueueSnackbar(res.error, { variant: 'warning' });
      }
      setBookings(tmpBookings);
      setHistory(tmpHistory);
      setLoading(false);
    }
    if (loading&&tokenData.token){
      fetchBookingList();
      setLoading(false);
    }
  }, [loading, enqueueSnackbar, id, tokenData.token]);

  // calculate statistics data of the booking
  const diffTime = dayjs().diff(dayjs(listingInfo.postedOn, "YYYY-MM-DDTHH:mm:ss.SSSZ"),'minutes');
  const hours = Math.floor(diffTime / 60);
  const minutes = diffTime % 60;
  const days = Math.floor(hours / 24);
  const postedOn = `${days}d:${hours%24}h:${minutes}m ago`;
  // calculate the days in this year
  const bookedDays = history.reduce((acc, curr) => {
    if (curr.status === 'accepted') {
      let dayLength = 0;
      for (let i = 0; i < curr.dateRange.length; i++) {
        // check the date if in this year
        if (dayjs(curr.dateRange[i], 'DD/MM/YYYY').year() === dayjs().year()) {
          dayLength++;
        }
      }
      return acc + dayLength;
    } else {
      return acc;
    }
  }, 0);

  // calculate the total income in this year
  const profit = history.reduce((acc, curr) => {
    if (curr.status === 'accepted') {
      let tmpTotal = 0;
      const pricePernight = parseInt(curr.totalPrice) / curr.dateRange.length;
      for (let i = 0; i < curr.dateRange.length; i++) {
        // check the date if in this year
        if (dayjs(curr.dateRange[i], 'DD/MM/YYYY').year() === dayjs().year()) {
          tmpTotal += pricePernight;
        }
      }
      return acc + tmpTotal;
    } else {
      return acc;
    }
  }, 0);

  const statistics = [
    { postedOn: postedOn, bookedDays: bookedDays, profit: profit },
  ]

  return (
    <React.Fragment>
      {/* a modal to change status item */}
      <Dialog
        open={openChangeStatus}
        onClose={() => setOpenChangeStatus(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Accept or Reject Booking?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to accept or reject this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions >
          <Button color='error' onClick={handleReject} name="rejectBook">Reject</Button>
          <Button onClick={handleAccept} name="acceptBook">
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      <HostingHeader />

      <Typography gutterBottom variant="h6" sx={{ m: 1 }}>
          Statistic Data
      </Typography>
      <Paper sx={{ m: 1 }} elevation={3}>
          <Table sx={{ minWidth: 350 }} aria-label="your-booking">
              <TableHead>
                  <TableRow>
                      <TableCell align="center">posted</TableCell>
                      <TableCell align="center">booked</TableCell>
                      <TableCell align="center">profit</TableCell>
                  </TableRow>
              </TableHead>              
              <TableBody>
              {statistics.map((sta,index) => (
                  <TableRow key={`statistic${index}`}>
                      <TableCell align="center">{sta.postedOn}</TableCell>
                      <TableCell align="center">{sta.bookedDays}days</TableCell>
                      <TableCell align="center">{sta.profit}$</TableCell>
                  </TableRow>
              ))}
              </TableBody>
          </Table>
      </Paper>

      <Typography gutterBottom variant="h6" sx={{ m: 1 }}>
          Booking Requests
      </Typography>
      <Paper sx={{ m: 1 }} elevation={3}>
          <Table sx={{ minWidth: 350 }} aria-label="your-booking">
              {bookings && <caption>{bookings.length===0?'No your Requests (ಥ﹏ಥ)':'This is all your booking Requests (*^▽^*)'}</caption>}
              <TableHead>
                  <TableRow>
                      <TableCell align="center">check in</TableCell>
                      <TableCell align="center">check out</TableCell>
                      <TableCell align="center">total price</TableCell>
                      <TableCell align="center">status</TableCell>
                  </TableRow>
              </TableHead>              
              { bookings && 
              <TableBody>
              {bookings.map((booking,index) => (
                  <TableRow key={booking.id+"-"+index}>
                      <TableCell align="center">{booking.dateRange[0]}</TableCell>
                      <TableCell align="center">{getEndDate(booking.dateRange)}</TableCell>
                      <TableCell align="center">{booking.totalPrice}</TableCell>
                      <TableCell align="center"><Button sx={{m:0, px: 0}} name={`check${index}`} onClick={() => changeStatusModal(booking.id)} variant='contained'>Check</Button></TableCell>
                  </TableRow>
              ))}
              </TableBody>}
          </Table>
      </Paper>

      <Typography gutterBottom variant="h6" sx={{ m: 1 }}>
          Booking History
      </Typography>
      <Paper sx={{ m: 1 }} elevation={3}>
          <Table sx={{ minWidth: 350 }} aria-label="your-booking">
              {history && <caption>{history.length===0?'No history~':'This is all your booking history (*^▽^*)'}</caption>}
              <TableHead>
                  <TableRow>
                      <TableCell align="center">check in</TableCell>
                      <TableCell align="center">check out</TableCell>
                      <TableCell align="center">total price</TableCell>
                      <TableCell align="center">status</TableCell>
                  </TableRow>
              </TableHead>              
              { history && 
              <TableBody>
              {history.map((booking,index) => (
                  <TableRow key={booking.id+"-"+index}>
                      <TableCell align="center">{booking.dateRange[0]}</TableCell>
                      <TableCell align="center">{getEndDate(booking.dateRange)}</TableCell>
                      <TableCell align="center">{booking.totalPrice}</TableCell>
                      <TableCell align="center" sx={{ color: booking.status === 'accepted'? 'green': 'red'}}>{booking.status}</TableCell>
                  </TableRow>
              ))}
              </TableBody>}
          </Table>
        </Paper>
    </React.Fragment>
  )
}

export default ViewBookingPage;