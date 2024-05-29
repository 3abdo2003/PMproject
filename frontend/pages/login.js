'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../services/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State variable for error message
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error messages
    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user information including the role
      router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 10); // You can adjust the delay time as needed
    } catch (error) {
      console.error(error);
      setError('Login failed. Please check your email and password and try again.'); // Set error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">Login</h2>
        {error && <div className="mb-6 text-red-500">{error}</div>} {/* Display error message */}
        <div className="mb-6">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg">Login</button>
        <div className="mt-4 text-center">
          <a href="/forgetpassword" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>
        <div className="mt-4 text-center">
          <a href="/signup" className="text-blue-600 hover:underline">Don't have an account? Sign up</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
