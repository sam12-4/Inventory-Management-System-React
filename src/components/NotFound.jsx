// NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80.7vh] flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <Link to="/" className="bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
