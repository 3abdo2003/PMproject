'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Calendar from 'react-calendar'; // Assuming you have this or a similar calendar library installed
import 'react-calendar/dist/Calendar.css'; // If using 'react-calendar'
import Spinner from '../components/Spinner'; // Import the Spinner component

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUser(response.data.user);

        if (response.data.user.role === 'admin') {
          setIsAdmin(true);
        }

        // Fetch user bookings
        const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(bookingsResponse.data.bookings);
        setMarkedDates(bookingsResponse.data.bookings.map(booking => new Date(booking.date)));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        router.push('/login');
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 10);
  };

  const handleAdminOptions = () => {
    router.push('/AdminPage');
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="bg-white py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-200">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </span>
            <div className="grid gap-0.5">
              <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={handleAdminOptions}
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Admin Options
              </button>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
            <div className="flex flex-col space-y-1.5 p-6">
              <h2 className="text-2xl font-bold text-[#0077b6]">About</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <div className="font-medium">Name:</div>
                <div>{user.firstName} {user.lastName}</div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <div className="font-medium">Email:</div>
                <div>{user.email}</div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <div className="font-medium">Role:</div>
                <div>{user.role}</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
            <div className="flex flex-col space-y-1.5 p-6">
              <h2 className="text-2xl font-bold text-[#0077b6]">My Bookings</h2>
            </div>
            <div className="p-6 space-y-4">
              {bookings.map(booking => (
                booking.trainingCentre ? (
                  <div key={booking._id} className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div>
                      <h4 className="font-medium">{booking.trainingCentre.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString()} | {booking.time}
                      </p>
                      <p className="text-sm text-gray-500">{booking.trainingCentre.location}</p>
                    </div>
                  </div>
                ) : (
                  <div key={booking._id} className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div>
                      <h4 className="font-medium">Unknown Training Centre</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString()} | {booking.time}
                      </p>
                      <p className="text-sm text-gray-500">Location not available</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
