import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWarehouse, FaBars, FaTimes } from 'react-icons/fa'; // Import icons for hamburger menu
import classNames from 'classnames'; // Import classNames for conditional classes

const Header = ({ isLoggedIn, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center relative">
      <div className='flex md:items-center items-start md:ml-2'>
        <Link to="/" className="text-xl font-bold md:text-center text-center md:mt-0 md:w-fit w-72 flex md:items-center items-center md:ml-2"><FaWarehouse className="h-12 w-7 text-white md:mr-4" />Inventory Management System</Link>
      </div>

      {/* Hamburger Menu */}
      <div className="block lg:hidden absolute right-4 top-4"> {/* Show on small screens only */}
        <button onClick={toggleMenu} className="text-white focus:outline-none mt-3">
          {isOpen ? <FaTimes className="h-6 w-6 " /> : <FaBars className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className={classNames('lg:flex md:relative absolute top-full md:w-fit w-full left-0 bg-gray-800 text-white p-4', { 'hidden': !isOpen }, 'items-center z-10')}>
        <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4  ">
          <li><Link to="/">Home</Link></li>
          {!isLoggedIn && <li><Link to="/signin">Sign In</Link></li>}
          {!isLoggedIn && <li><Link to="/register">Register</Link></li>}
          {isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li>}
          {isLoggedIn && <li><button onClick={handleLogout} className="text-white">Logout</button></li>}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
