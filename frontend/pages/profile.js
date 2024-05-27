'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProfilePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
    setTimeout(() => {
        window.location.reload();
      }, 10); // You can adjust the delay time as needed
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-4xl font-semibold text-blue-700 mb-6">Profile</h1>
      <button 
        onClick={handleLogout} 
        className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
