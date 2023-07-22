import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Divider, ListItemIcon, Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { HolidayVillageOutlined, MenuOutlined, AddBusiness, Logout, DeleteForever } from '@mui/icons-material';
import { logoutRequest } from '../config/requests.js';
import { useSnackbar } from 'notistack';
import { isSmallScreen } from '../util/helper.js';
import { tokenContext } from '../App.jsx';
import { deleteListingRequest } from '../config/requests.js';

const HostingHeader = () => {
  const navigate = useNavigate();
  // access to user data
  const tokenData = useContext(tokenContext);
  useEffect(() => {
    if (!tokenData.token) {
      navigate('/');
    }
  }, [tokenData.token, navigate]);

  // check if on mobile device or not
  const [onMobile, setOnMobile] = React.useState(isSmallScreen());
  useEffect(() => {
    // windowsize listener
    const handleResize = () => {
      setOnMobile(isSmallScreen());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // check route of current page
  const location = useLocation();
  const [pathLocation] = useState(location.pathname);

  // for error snackbar messages
  const { enqueueSnackbar } = useSnackbar();

  // control delete listing dialog
  const [ deleteModalOpen, setDeleteModalOpen ] = useState(false);
  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const handleDeleteListing = async () => {
    const res = await deleteListingRequest(pathLocation.split('/')[3]);
    if (res.ok) {
      enqueueSnackbar('Delete successfully!', { variant: 'success' });
      navigate('/hosting');
    } else {
      enqueueSnackbar(res.error, { variant: 'error' });
    }
    setDeleteModalOpen(!deleteModalOpen);
  };

  // handle log out 
  const handleLogout = async () => {
    const res = await logoutRequest();
    if (res.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      tokenData.setToken(null);
      tokenData.setLoginEmail(null);
      navigate('/');
    } else {
      enqueueSnackbar(res.error, { variant: 'warning' });
    }
  }

  // handele menu open and close, show items in different pages
  const [anchorEl, setAnchorEl] = useState(null);
  const handlehostingMenuOpen = (event) => { setAnchorEl(event.currentTarget); };
  const handlehostingMenuClose = () => { setAnchorEl(null); };
  const hostingMenuOpen = Boolean(anchorEl);
  const HostingMenu = () => {
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="profile-menu"
        open={hostingMenuOpen}
        onClose={handlehostingMenuClose}
        onClick={handlehostingMenuClose}
      >
        { pathLocation === '/hosting' 
        ? <MenuItem onClick={() => { navigate('/hosting/create') }} name="openCreateListingPageButton">
            <ListItemIcon >
              <AddBusiness fontSize="small" />
            </ListItemIcon>
            Create a new listing
          </MenuItem> 
        : null
        }
        {/* if in edit listing page, show delete button to delete this listing */}
        { !pathLocation.includes('/hosting/edit') ? null :
        <MenuItem onClick={handleDeleteModalOpen} sx={{ color: 'red' }}>
          <ListItemIcon>
            <DeleteForever fontSize="small" sx={{ color: 'red' }}/>
          </ListItemIcon>
          Delete this Listing
        </MenuItem>
        }
        {pathLocation === '/hosting/create' ? null : <Divider />}
        <MenuItem onClick={handleLogout} name="logoutButton">
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>
    );
  };

  return (
    <React.Fragment>
      <Box sx={{ height: onMobile ? 56 : 64 }}/> 
      <AppBar position="fixed" color='secondary' >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box className='leftBar' onClick={() => { navigate('/') }}
            sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
            <HolidayVillageOutlined sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              AirBrB
            </Typography>
          </Box>

          <Box className='rightBar' sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
            {pathLocation !== '/hosting' 
              ? 
              <Box variant='text' onClick={() => { navigate('/hosting') }} sx={{ cursor: 'pointer' }}>
              <Typography variant="caption" color="white" noWrap>
                Back to Hosting
              </Typography>
              </Box>
              :
              <Box variant='text' onClick={() => { navigate('/') }} sx={{ cursor: 'pointer' }}>
              <Typography variant="caption" color="white" noWrap>
                Switch to Travel
              </Typography>
              </Box>
            }

            <IconButton
                name="hostingMenuButton"
                size="large"
                onClick={handlehostingMenuOpen}
                color="inherit"
              >
                <MenuOutlined />
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>
      <HostingMenu/>

      {/* delete listing modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteModalOpen}
        aria-labelledby="alert-if-delete-listing"
        aria-describedby="if-click-delete-delete-listing"
      >
        <DialogTitle id="delete-alert" sx={{ color: 'red' }}>
          Delete this listing?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-delete-description">
            Are you sure you want to delete this listing? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleDeleteModalOpen}>Cancel</Button>
          <Button variant='outlined' color='error' onClick={handleDeleteListing} autoFocus>
            delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default HostingHeader;
