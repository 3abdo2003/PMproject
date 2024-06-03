'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../services/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 10);
    } catch (error) {
      console.error(error);
      setError('Login failed. Please check your email and password and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="border text-card-foreground w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col space-y-1.5 bg-blue-600 p-6">
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight text-white">Welcome Back</h3>
          <p className="text-sm text-blue-200">Sign in to your account</p>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                className="flex h-10 w-full border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md shadow-sm"
                id="email"
                name="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                className="flex h-10 w-full border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md shadow-sm"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 px-4 w-full"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="/forgetpassword" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <div className="mt-4 text-center">
            <a href="/signup" className="text-blue-600 hover:underline">Don't have an account? Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
