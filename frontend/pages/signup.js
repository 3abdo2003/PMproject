'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../services/auth';

const SignUpPage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalID: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState(''); // State variable for error message
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error messages
    try {
      await register(userData);
      router.push('/login');
    } catch (error) {
      console.error(error);
      setError('Registration failed. Please check your details and try again.'); // Set error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">Sign Up</h2>
        {error && <div className="mb-6 text-red-500">{error}</div>} {/* Display error message */}
        {Object.keys(userData).map((key) => (
          key !== 'role' && (
            <div key={key} className="mb-6">
              <label className="block text-gray-700 capitalize">{key}</label>
              <input
                type={key === 'password' ? 'password' : 'text'}
                name={key}
                value={userData[key]}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          )
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
