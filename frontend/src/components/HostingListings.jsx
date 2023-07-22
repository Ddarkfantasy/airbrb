import React, { useContext, useEffect, useState } from "react";
import { tokenContext } from "../App";
import { Grid,
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, } from "@mui/material";
import { allListRequest, getSingleListing, unPublishListingRequest, deleteListingRequest } from "../config/requests";
import { useSnackbar } from "notistack";
import HostingCardMedia from "./HostingCardMedia";

const HostingListings = (props) => {
  const [actionItemid, setActionItemid] = useState(null);

  // get access to token data
  const tokenData = useContext(tokenContext);
  const { setListings } = { ...props };
  const [unPublishedListings, setUnPublishedListings] = useState([]);
  const [publishedListings, setPublishedListings] = useState([]);

  // if loading , show empty listings
  const [loading, setLoading] = useState(true);

  // for error snackbar messages
  const { enqueueSnackbar } = useSnackbar();

  // manage whether show the delete confirmation dialog
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleDeleteConfirm = async () => {
    const res = await deleteListingRequest(actionItemid);
    if (res.ok) {
      enqueueSnackbar('Listing deleted', { variant: 'success' });
      // a refresh of the page is needed
      setLoading(true);
      setOpenDelete(false);
    } else {
      enqueueSnackbar(res.error, { variant: 'warning' });
    }
  }

  // manage whether show the unpublish confirmation dialog
  const [openUnlife, setOpenUnlife] = React.useState(false);
  const handleUnliveConfirm = async () => {
    const res = await unPublishListingRequest(actionItemid);
    if (res.ok) {
      enqueueSnackbar('Listing unPublished', { variant: 'success' });
      // a refresh of the page is needed
      setLoading(true);
      setOpenUnlife(false);
    } else {
      enqueueSnackbar(res.error, { variant: 'warning' });
    }
  }

  useEffect(() => {
    const fetchListings = async () => {
      const res = await allListRequest();
      if (res.ok) {
        const myListings = res.data.listings.filter(
          (listing) => listing.owner === tokenData.loginEmail
        )
        // get all the informs of my listings
        const tmpPublishedListings = [];
        const tmpUnPublishedListings = [];
        const tmpListings = [];
        for (const listing of myListings) {
          const res = await getSingleListing(listing.id);
          if(res.ok){
            res.data.listing.id = listing.id;
            tmpListings.push(res.data.listing);
            if (res.data.listing.published) {
              tmpPublishedListings.push(res.data.listing);
            } else {
              tmpUnPublishedListings.push(res.data.listing);
            }
          }
        }
        setPublishedListings(tmpPublishedListings);
        setUnPublishedListings(tmpUnPublishedListings);
        setListings(tmpListings);
        setLoading(false);
      } else {
        enqueueSnackbar(res.error, { variant: 'warning' });
        setLoading(true);
      }
    }
    if (loading && tokenData.token) {
      fetchListings();
    }
  }, [loading, tokenData, enqueueSnackbar, setListings]);
  

  return (
    <Box>
       {/* a modal to confirm delete item */}
       <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Listing?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Are you sure you want to delete this listing?
          </DialogContentText>
        </DialogContent>
        <DialogActions >
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color='error' onClick={handleDeleteConfirm} name="deleteConfirm">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* a modal to confirm unpublish item */}
      <Dialog
        open={openUnlife}
        onClose={() => setOpenUnlife(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Unpublish Listing?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. But you could edit and publish it again. Are you sure you want to unpublish this listing?
          </DialogContentText>
        </DialogContent>
        <DialogActions >
          <Button onClick={() => setOpenUnlife(false)}>Cancel</Button>
          <Button color='error' onClick={handleUnliveConfirm} name="unpublishConfirm">
            Unpublish
          </Button>
        </DialogActions>
      </Dialog>

      {/* show published listings */}
    <Typography variant="h5" sx={{ m: 1 }}>
      Published
    </Typography>
    <Paper sx={{ m: 1, pt: 0.5, minHeight: 100, background: 'linear-gradient(to left top, #f83734, #673af8 )' }} elevation={3}>
      { publishedListings.length === 0
      ?
      <Box display='flex' justifyContent='center' alignItems='center' sx={{ minHeight: 100 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          No published listing here...
        </Typography>
      </Box>
      :
      <Grid container spacing={{ xs: 2, sm:2, md: 2 }} columns={{ xs: 2, sm: 2, md: 4, lg: 6 }} mx={2} sx={{ p: 1 }}>
        {Array.from(publishedListings).map((item, index) => (
          <Grid item xs={2} sm={2} md={2} key={item?item.id:index} onClick={ () => setActionItemid(item.id) }>
            <HostingCardMedia itemValue={item} published={true} setOpenDelete={setOpenDelete} setOpenUnlife={setOpenUnlife} />
          </Grid>
        ))}
      </Grid>}
    </Paper>
    {/* show unpublished listings */}
    <Typography variant="h5" sx={{ m: 1 }}>
      Unpublished
    </Typography>
    <Paper sx={{ m: 1, pt: 0.5, minHeight: 100, background: 'linear-gradient(to left top, #f83734, #673af8 )' }} elevation={3}>
      <Grid container spacing={{ xs: 2, sm:2, md: 2 }} columns={{ xs: 2, sm: 2, md: 4, lg: 6 }} mx={2} sx={{ p: 1 }}>
          {Array.from(unPublishedListings).map((item, index) => (
            <Grid item xs={2} sm={2} md={2} key={item?item.id:index} onClick={ () => setActionItemid(item.id) }>
              <HostingCardMedia itemValue={item} published={false} setOpenDelete={setOpenDelete} setOpenUnlife={setOpenUnlife} />
            </Grid>
          ))}
      </Grid>
    </Paper>
    </Box>
  );
}

export default HostingListings;