import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <h1 className="text-4xl font-semibold text-blue-700">Welcome to Exam Booking</h1>
    </div>
  );
};

export default Home;
