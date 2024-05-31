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
    price: '',
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

      setFormData({ name: '', location: '', capacity: '', availableSeats: '', contactInfo: '', date: '', time: '', price: '' });
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
        price: selectedCenter.price || '',
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
      price: '',
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
              />
            </div>
            <div>
              <label htmlFor="price" className="block font-medium mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter price"
                required
              />
            </div>
            <div className="col-span-2 flex justify-between">
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                {selectedCenterId ? 'Update' : 'Create'}
              </button>
              {selectedCenterId && (
                <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                  Delete
                </button>
              )}
              <button onClick={handleCreateNew} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                Create New
              </button>
            </div>
          </form>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">Training Centers List</h2>
          <ul className="divide-y divide-gray-200">
            {trainCenters.map(center => (
              <li key={center._id} className="py-2 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{center.name}</h3>
                  <p className="text-gray-600">{center.location}</p>
                  <p className="text-gray-600">Capacity: {center.capacity}</p>
                  <p className="text-gray-600">Available Seats: {center.availableSeats}</p>
                  <p className="text-gray-600">Price: {center.price}</p>
                </div>
                <button
                  onClick={() => handleSelectCenter(center._id)}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
