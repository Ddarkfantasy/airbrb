import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NotistackWrapper from './components/NotistackWrapper';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import HostingHomePage from './pages/HostingHomePage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/RegisterPage';
import ListingPage from './pages/ListingPage';
import GoLivePage from './pages/GoLivePage';
import ViewBookingPage from './pages/ViewBookingsPage';

export const tokenContext = React.createContext();

function App () {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [loginEmail, setLoginEmail] = React.useState(localStorage.getItem('email'));
  return (
    <tokenContext.Provider value={{ token, setToken, loginEmail, setLoginEmail}}>
      <NotistackWrapper>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/hosting' element={<HostingHomePage />} />
          <Route path='/hosting/create' element={<CreateListingPage />} />
          <Route path='/hosting/edit/:id' element={<EditListingPage />} />
          <Route path='/hosting/publish/:id' element={<GoLivePage />} />
          <Route path='/hosting/viewbookings/:id' element={<ViewBookingPage />} />
          <Route path='/listing/:id/:minDateString/:maxDateString' element={<ListingPage />} />
          <Route path='/listing/:id' element={<ListingPage />} />
          <Route path='*' element={<NotFoundPage/>} />
        </Routes>
      </Router>
      </NotistackWrapper>
    </tokenContext.Provider>
  )
}

export default App;
