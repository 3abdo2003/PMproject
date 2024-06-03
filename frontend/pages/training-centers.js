// pages/training-centers.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllTrainCenters } from '../services/trainCentre';
import { FaUserAlt, FaChair, FaPhone } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const TrainingCenters = () => {
  const [trainCenters, setTrainCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTrainCenters = async () => {
      try {
        const data = await getAllTrainCenters();
        setTrainCenters(data.trainCentres);
      } catch (error) {
        console.error('Error fetching training centers:', error);
      }
    };

    fetchTrainCenters();
  }, []);

  const handleBookNow = (trainCenterId) => {
    if(!localStorage.getItem('token')) {
      router.push('/login')
    }
    else
    router.push(`/book/${trainCenterId}`);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredTrainCenters = trainCenters.filter(trainCenter =>
    trainCenter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Find a Training Center</h1>
        <div className="mt-4">
          <input
            className="flex h-10 rounded-md border border-blue-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full max-w-md"
            placeholder="Search by name"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTrainCenters.map((trainCenter) => (
          <div key={trainCenter._id} className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-xl font-bold text-gray-800">{trainCenter.name}</h2>
              <div className="flex items-center text-gray-500">
                <MdLocationOn className="mr-2 text-blue-500" />
                <p>{trainCenter.location}</p>
              </div>
              <div className="flex items-center text-gray-500">
                <p>{new Date(trainCenter.date).toLocaleDateString()}, {trainCenter.time}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FaUserAlt className="mr-2 text-blue-500" />
                  <p>Capacity: {trainCenter.capacity}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FaChair className="mr-2 text-blue-500" />
                  <p>Available Seats: {trainCenter.availableSeats}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FaPhone className="mr-2 text-blue-500" />
                  <p>Contact: {trainCenter.contactInfo}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-300 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
                onClick={() => handleBookNow(trainCenter._id)}
              >
                Book Now
              </button>
            </div>
            {cartMessage && <p className="mt-2 text-sm text-green-600">{cartMessage}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="mb-4">You need to login or register to add items to your cart.</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
              <button
                className="bg-gray-300 rounded-md px-4 py-2 hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TrainingCenters;
