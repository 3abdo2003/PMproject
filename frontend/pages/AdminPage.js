'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createTrainCenter, updateTrainCenter, deleteTrainCenter, getAllTrainCenters } from '../services/trainCentre';

const AdminPage = () => {
  const router = useRouter();
  const [trainCenters, setTrainCenters] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    availableSeats: '',
    contactInfo: '',
    date: '',
    time: '',
  });
  const [selectedCenterId, setSelectedCenterId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role === 'admin') {
        fetchTrainCenters();
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const fetchTrainCenters = async () => {
    try {
      const data = await getAllTrainCenters();
      setTrainCenters(data.trainCentres);
    } catch (error) {
      console.error('Error fetching training centers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedTime = formData.time ? formatTime(formData.time) : '';
      const updatedFormData = { ...formData, time: formattedTime };

      if (selectedCenterId) {
        await updateTrainCenter(selectedCenterId, updatedFormData);
        alert('Training center updated successfully');
      } else {
        await createTrainCenter(updatedFormData);
        alert('Training center created successfully');
      }

      setFormData({ name: '', location: '', capacity: '', availableSeats: '', contactInfo: '', date: '', time: '' });
      setSelectedCenterId('');
      fetchTrainCenters();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit training center');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteTrainCenter(selectedCenterId);
      alert('Training center deleted successfully');
      setSelectedCenterId('');
      fetchTrainCenters();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete training center');
    }
  };

  const handleSelectCenter = (centerId) => {
    setSelectedCenterId(centerId);
    const selectedCenter = trainCenters.find(center => center._id === centerId);
    if (selectedCenter) {
      setFormData({
        name: selectedCenter.name,
        location: selectedCenter.location,
        capacity: selectedCenter.capacity,
        availableSeats: selectedCenter.availableSeats,
        contactInfo: selectedCenter.contactInfo,
        date: selectedCenter.date || '',
        time: selectedCenter.time || '',
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedCenterId('');
    setFormData({
      name: '',
      location: '',
      capacity: '',
      availableSeats: '',
      contactInfo: '',
      date: '',
      time: '',
    });
  };

  const formatTime = (time) => {
    const date = new Date(`01/01/2020 ${time}`);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-500 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Admin Options</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white">
        <section>
          <h2 className="text-xl font-bold mb-4">{selectedCenterId ? 'Update Training Center' : 'Create Training Center'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="name" className="block font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter training center name"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block font-medium mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block font-medium mb-1">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter capacity"
                required
              />
            </div>
            <div>
              <label htmlFor="availableSeats" className="block font-medium mb-1">
                Available Seats
              </label>
              <input
                type="number"
                id="availableSeats"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter available seats"
                required
              />
            </div>
            <div>
              <label htmlFor="contactInfo" className="block font-medium mb-1">
                Contact Info
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter contact information"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter date"
              />
            </div>
            <div>
              <label htmlFor="time" className="block font-medium mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter time"
              />
            </div>
            <div className="col-span-2 text-right">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
                {selectedCenterId ? 'Update' : 'Create'}
              </button>
              {selectedCenterId && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="ml-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  Create New
                </button>
              )}
            </div>
          </form>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">Manage Training Centers</h2>
          <div className="grid grid-cols-1 gap-4">
            {trainCenters.map((center) => (
              <div key={center._id} className="bg-white rounded-md shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">{center.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectCenter(center._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded-md"
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCenterId(center._id);
                        handleDelete(e);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p><strong>Location:</strong> {center.location}</p>
                <p><strong>Capacity:</strong> {center.capacity}</p>
                <p><strong>Available Seats:</strong> {center.availableSeats}</p>
                <p><strong>Contact Info:</strong> {center.contactInfo}</p>
                <p><strong>Date:</strong> {center.date}</p>
                <p><strong>Time:</strong> {center.time}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
