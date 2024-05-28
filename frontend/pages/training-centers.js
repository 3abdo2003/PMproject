// pages/trainingCenters.js
import { useState, useEffect } from 'react';
import { getAllTrainCenters } from '../services/trainCentre';
import { FaUserAlt, FaChair, FaPhone } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const TrainingCenters = () => {
  const [trainCenters, setTrainCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
            <div className="mt-6 flex items-center">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-300 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default TrainingCenters;
