import React, { useContext, useEffect, useState } from 'react';
import { tokenContext } from '../App.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Menu, MenuItem, Divider, IconButton, ListItemIcon, Modal, Box } from '@mui/material';
import { HolidayVillageOutlined, AccountCircle, Logout, Login, PersonAdd } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import RegisterForm from './RegisterForm.jsx';
import LoginForm from './LoginForm.jsx';
import { isSmallScreen } from '../util/helper.js';
import { logoutRequest } from '../config/requests.js';

const TravelHeader = () => {
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
  // track which page the user is on
  const location = useLocation();
  const [pathLocation] = useState(location.pathname);
  // tokenData controlles the token, use setToken to change the token
  const tokenData = useContext(tokenContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // for login and register modal
  const [registerModalOpen, setRegisterModalOpen] = React.useState(false);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  // set open state for login and register modal
  const handleRegisterModalOpen = () => {
    if (onMobile) {
      navigate('/register');
    } else {
      setRegisterModalOpen(true);
    }
  };
  const handleRegisterModalClose = () => { setRegisterModalOpen(false) };
  const handleLoginModalClose = () => { setLoginModalOpen(false) };
  const handleLoginModalOpen = () => {
    if (onMobile) {
      navigate('/login');
    } else {
      setLoginModalOpen(true)
    }
  };

  // Manage open and close of the menu
  const handleLogout = async () => {
    const res = await logoutRequest();
    if (res.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      tokenData.setToken(null);
      tokenData.setLoginEmail(null);
    } else {
      enqueueSnackbar(res.error, { variant: 'warning' });
    }
  }

  // Manage open and close of the menu 
  // (if the user is logged in, the menu will have a different set of options)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleProfileMenuOpen = (event) => { setAnchorEl(event.currentTarget); };
  const handleProfileMenuClose = () => { setAnchorEl(null); };
  const profileMenuOpen = Boolean(anchorEl);
  const ProfileMenu = () => {
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
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        {!tokenData.token
          ? null
          : <Box>
            <MenuItem onClick={() => { navigate('/hosting') }}>
              Manage Listings
            </MenuItem>
            <Divider />
          </Box>}

        {tokenData.token
          ? <MenuItem onClick={handleLogout} name="logoutButton">
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Log Out
            </MenuItem>
          : <Box>
              <MenuItem onClick={handleRegisterModalOpen} name="registerFormOpenButton">
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Sign Up
              </MenuItem>
              <MenuItem onClick={handleLoginModalOpen} name="loginFormOpenButton">
                <ListItemIcon>
                  <Login fontSize="small" />
                </ListItemIcon>
                Log In
              </MenuItem>
            </Box>}
      </Menu>
    );
  };

  return (
    <React.Fragment>
      {/* has same height with appbar */}
      <Box sx={{ height: onMobile? 56 : 64 }}/> 
      <AppBar position='fixed'>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box className='leftBar' onClick={() => { navigate('/') }}
            sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
            <HolidayVillageOutlined sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              AirBrB
            </Typography>
          </Box>

          <Box className='rightBar' sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
            {tokenData.token
              ? <Box onClick={() => { navigate('/hosting') }} sx={{ cursor: 'pointer' }} name="switchToHosting">
                  <Typography variant="caption" color="white" noWrap>
                    Switch to Hosting
                  </Typography>
                </Box>
              : pathLocation !== '/' 
                ? 
                <Box onClick={() => { navigate('/') }} sx={{ cursor: 'pointer' }} name="toHome">
                  <Typography variant="caption" color="white" noWrap>
                    Back to Home
                  </Typography>
                </Box> 
                : null   
            }
            <IconButton
                size="large"
                name="travelHeaderMenuButton"
                onClick={handleProfileMenuOpen}
                disabled={pathLocation==='/login' || pathLocation==='/register'}
                color="inherit"
              >
                <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <ProfileMenu />

      <Modal
        open={registerModalOpen}
        onClose={handleRegisterModalClose}
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <Box>
          <RegisterForm setRegisterModalOpen={setRegisterModalOpen}/>
        </Box>
      </Modal>

      <Modal
        open={loginModalOpen}
        onClose={handleLoginModalClose}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box>
          <LoginForm setLoginModalOpen={setLoginModalOpen}/>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default TravelHeader;
