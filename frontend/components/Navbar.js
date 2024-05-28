// components/Navbar.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-blue-900 text-white">
      <a className="flex items-center gap-2 font-bold" href="#">
        <span>Exam Booking</span>
      </a>
      <nav className="flex items-center gap-4">
        <Link href="/" legacyBehavior>
          <a
            className={`px-2 py-1 rounded-md hover:bg-blue-800 focus:bg-blue-800 ${router.pathname === '/' ? 'bg-blue-800' : ''}`}
            data-active="/"
          >
            Home
          </a>
        </Link>
        <Link href="/training-centers" legacyBehavior>
          <a
            className={`px-2 py-1 rounded-md hover:bg-blue-800 focus:bg-blue-800 ${router.pathname === '/training-centers' ? 'bg-blue-800' : ''}`}
            data-active="/training-centers"
          >
            Training Centers
          </a>
        </Link>
        <button
          onClick={handleProfileClick}
          className={`px-2 py-1 rounded-md hover:bg-blue-800 focus:bg-blue-800 ${router.pathname === '/profile' ? 'bg-blue-800' : ''}`}
          data-active="/profile"
        >
          {isLoggedIn ? 'Profile' : 'Login'}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
