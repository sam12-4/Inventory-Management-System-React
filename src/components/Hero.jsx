import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gray-200 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Manage Your Inventory Efficiently</h2>
        <p className="text-xl mb-8">A modern solution for all your inventory management needs.</p>
        <div className='flex gap-4 justify-center'>
        {!localStorage.getItem("token") && <Link to="/register"><button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Get Started</button></Link>}
        
        {!localStorage.getItem("token") && <Link to="/signin"><button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Sign In</button></Link>}

        {localStorage.getItem("token") && <Link to="/dashboard"><button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">{localStorage.getItem("userName")}'s Dashboard</button></Link>
        }
      </div>
      </div>
    </section>
  );
};

export default Hero;
