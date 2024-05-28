// services/booking.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Function to create a new booking
export const createBooking = async (trainingCentreId, date, time, seat, token) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, { trainingCentreId, date, time, seat }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.booking;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Function to fetch all bookings for the logged-in user
export const fetchMyBookings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.bookings;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Function to delete a booking by ID
export const deleteBooking = async (bookingId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
