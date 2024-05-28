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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Format time to HH:MM AM/PM format
      const formattedTime = formData.time ? formatTime(formData.time) : '';
      // Update formData with formatted time
      const updatedFormData = { ...formData, time: formattedTime };
      // Send updated form data to createTrainCenter function
      await createTrainCenter(updatedFormData);
      alert('Training center created successfully');
      setFormData({ name: '', location: '', capacity: '', availableSeats: '', contactInfo: '', date: '', time: '' });
      fetchTrainCenters();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create training center');
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Format time to HH:MM AM/PM format
      const formattedTime = formData.time ? formatTime(formData.time) : '';
      // Update formData with formatted time
      const updatedFormData = { ...formData, time: formattedTime };
      // Send updated form data to updateTrainCenter function
      await updateTrainCenter(selectedCenterId, updatedFormData);
      alert('Training center updated successfully');
      setFormData({ name: '', location: '', capacity: '', availableSeats: '', contactInfo: '', date: '', time: '' });
      setSelectedCenterId('');
      fetchTrainCenters();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update training center');
    }
  };
  
  // Function to format time to HH:MM AM/PM format
  const formatTime = (time) => {
    const date = new Date(`01/01/2020 ${time}`);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
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

  const handleSelectCenter = (e) => {
    const centerId = e.target.value;
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-4xl font-semibold text-blue-700 mb-6">Admin Options</h1>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <form onSubmit={handleCreate} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Create Training Center</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleChange}
            placeholder="Available Seats"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="Contact Info"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="Date"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Time"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </form>

        <form onSubmit={handleUpdate} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Update Training Center</h3>
          <select
            value={selectedCenterId}
            onChange={handleSelectCenter}
            className="w-full p-2 mb-2 border rounded"
            required
          >
            <option value="" disabled>Select Training Center</option>
            {trainCenters.map((center) => (
              <option key={center._id} value={center._id}>
                {center.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleChange}
            placeholder="Available Seats"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="Contact Info"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="Date"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Time"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </form>

        <form onSubmit={handleDelete} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Delete Training Center</h3>
          <select
            value={selectedCenterId}
            onChange={(e) => setSelectedCenterId(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          >
            <option value="" disabled>Select Training Center</option>
            {trainCenters.map((center) => (
              <option key={center._id} value={center._id}>
                {center.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
