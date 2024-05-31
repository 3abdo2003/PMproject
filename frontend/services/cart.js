// services/cart.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const addToCart = async (trainingCentreId, date, time, seat) => {
  try {
    const response = await axios.post(`${API_URL}/cart`, { trainingCentreId, date, time, seat }, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const viewCart = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/cart/${itemId}`, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const checkout = async () => {
  try {
    const response = await axios.post(`${API_URL}/cart/checkout`, {}, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
