import CONFIG from '../config';
const BACKEND_URL = `http://localhost:${CONFIG.BACKEND_PORT}`;

const fatchData = async (url, method, body = undefined) => {
  const requestOption = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    method: method,
    body: body ? JSON.stringify(body) : undefined,
  }
  try {
    const response = await fetch(`${BACKEND_URL}${url}`, requestOption);
    if (response.ok) {
      const data = await response.json();
      return { data: data, ok: true };
    } else {
      const data = await response.json();
      return { error: data.error, ok: false };
    }
  } catch (error) {
    return { error: 'Lost connection...', ok: false };
  }
}

export const registerRequest = async (body) => {
  const response = await fatchData('/user/auth/register', 'POST', body);
  return response;
}

export const loginRequest = async (body) => {
  const response = await fatchData('/user/auth/login', 'POST', body);
  return response;
}

export const logoutRequest = async () => {
  const response = await fatchData('/user/auth/logout', 'POST');
  return response;
}

export const createListingRequest = async (body) => {
  body.price = parseInt(body.price);
  const response = await fatchData('/listings/new', 'POST', body);
  return response;
}

export const updateListingRequest = async (id, body) => {
  body.price = parseInt(body.price);
  const response = await fatchData(`/listings/${id}`, 'PUT', body);
  return response;
}

export const deleteListingRequest = async (id) => {
  const response = await fatchData(`/listings/${id}`, 'DELETE');
  return response;
}

export const allListRequest = async () => {
  // then get all listings
  const response = await fatchData('/listings', 'GET');
  return response;
}

export const getSingleListing = async (listingid) => {
  // then get one listing
  const response = await fatchData(`/listings/${listingid}`, 'GET');
  return response;
}

export const bookingListRequest = async () => {
  // Listings that involve bookings made by the customer with status `accepted` or `pending` 
  //should appear first in the list (if the user is logged in)
  const response = await fatchData('/bookings', 'GET');
  return response;
}

export const saveReviewRequest = async (review) => {
  // Listings that involve bookings made by the customer with status `accepted` or `pending` 
  //should appear first in the list (if the user is logged in)
  const body = {review:review};
  const response = await fatchData(`/listings/${review.listingId}/review/${review.bookingId}`, 'PUT',body);
  return response;
}

export const addBookingRequest = async (booking) => {
  // Listings that involve bookings made by the customer with status `accepted` or `pending` 
  //should appear first in the list (if the user is logged in)
  const body = {
    dateRange: booking.dateRange,
    totalPrice: booking.totalPrice
  };
  const response = await fatchData(`/bookings/new/${booking.listingId}`, 'POST',body);
  return response;
}

export const publishListingRequest = async (id, body) => {
  const response = await fatchData(`/listings/publish/${id}`, 'PUT', body);
  return response;
}

export const unPublishListingRequest = async (id) => {
  const response = await fatchData(`/listings/unpublish/${id}`, 'PUT');
  return response;
}

export const acceptBooking = async (id) => {
  const response = await fatchData(`/bookings/accept/${id}`, 'PUT');
  return response;
}

export const declineBooking = async (id) => {
  const response = await fatchData(`/bookings/decline/${id}`, 'PUT');
  return response;
}