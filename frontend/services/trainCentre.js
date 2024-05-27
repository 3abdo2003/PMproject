// src/services/trainCenterService.js

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAllTrainCenters = async () => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Make the request with the configured headers
    const response = await axios.get(`${API_URL}/train-centre`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch train centers');
  }
};

export const searchTrainCenterByName = async (name) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.post(`${API_URL}/train-centre/search`, { name }, config);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};


export const updateTrainCenter = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/train-centre/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
