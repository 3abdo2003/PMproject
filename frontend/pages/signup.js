import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../services/auth';
import Select from 'react-select';
import countries from 'world-countries';

const SignUpPage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    nationalID: '',
    passportNumber: '',
    password: '',
    role: '', // Set default role as 'admin'
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const countryOptions = [
    { value: 'EG', label: 'Egypt' },
    ...countries
      .filter(country => country.cca2 !== 'EG')
      .map(country => ({
        value: country.cca2, // Use the ISO 3166-1 alpha-2 code for the value
        label: country.name.common // Use the common name for the label
      }))
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleCountryChange = (selectedOption) => {
    setUserData({
      ...userData,
      country: selectedOption ? selectedOption.value : '',
      nationalID: '',
      passportNumber: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Filter out empty fields
      const payload = { ...userData };
      if (!payload.nationalID) delete payload.nationalID;
      if (!payload.passportNumber) delete payload.passportNumber;

      await register(payload);
      router.push('/login');
    } catch (error) {
      console.error(error);
      setError('Registration failed. Please check your details and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="mx-auto max-w-md p-8 bg-white border border-blue-300 rounded-lg shadow-lg space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Register</h1>
          <p className="text-gray-500">Create your account to get started.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="first-name">
                First Name
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                id="first-name"
                name="firstName"
                placeholder="John"
                value={userData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="last-name">
                Last Name
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                id="last-name"
                name="lastName"
                placeholder="Doe"
                value={userData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              id="email"
              name="email"
              placeholder="m@example.com"
              value={userData.email}
              onChange={handleChange}
              required
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              type="password"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              id="phone"
              name="phone"
              placeholder="+1 (555) 555-5555"
              value={userData.phone}
              onChange={handleChange}
              required
              type="tel"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="country">
              Country
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              id="country"
              name="country"
              options={countryOptions}
              onChange={handleCountryChange}
              isClearable
              placeholder="Select a country"
            />
          </div>
          {userData.country === 'EG' && (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="nationalID">
                National ID
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                id="nationalID"
                name="nationalID"
                value={userData.nationalID}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {userData.country && userData.country !== 'EG' && (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="passportNumber">
                Passport Number
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                id="passportNumber"
                name="passportNumber"
                value={userData.passportNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800">
            Sign Up
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
