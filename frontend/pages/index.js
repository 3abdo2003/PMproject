import { useState, useEffect } from 'react';
import { getAllTrainCenters, searchTrainCenterByName } from '../services/trainCentre';

const TrainingCenters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trainCentres, setTrainCentres] = useState([]);

  useEffect(() => {
    const fetchTrainCentres = async () => {
      try {
        const data = await getAllTrainCenters();
        setTrainCentres(data.trainCentres);
      } catch (error) {
        console.error('Error fetching train centres:', error.message);
      }
    };

    fetchTrainCentres();
  }, []);

  const handleSearch = async () => {
    try {
      const data = await searchTrainCenterByName(searchTerm);
      setTrainCentres(data.trainCentre ? [data.trainCentre] : []);
    } catch (error) {
      console.error('Error searching train centres:', error.message);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Training Centers</h1>
        <div className="flex items-center border-b border-gray-300 pb-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg mr-4 focus:outline-none"
            placeholder="Search by name..."
          />
          <button onClick={handleSearch} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none">
            Search
          </button>
        </div>
        {trainCentres.length === 0 && (
          <p className="text-gray-600 text-center">No training centers found.</p>
        )}
        {trainCentres.map((centre) => (
          <div key={centre._id} className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">{centre.name}</h2>
              <p className="text-gray-600 mb-2">Location: {centre.location}</p>
              <p className="text-gray-600 mb-2">Capacity: {centre.capacity}</p>
              <p className="text-gray-600">Contact Info: {centre.contactInfo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingCenters;
