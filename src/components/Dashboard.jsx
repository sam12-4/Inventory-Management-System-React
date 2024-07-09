// Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield, FaChartLine, FaBoxes, FaRegListAlt, FaExchangeAlt } from 'react-icons/fa';

const Dashboard = () => {
  const userName = localStorage.getItem('userName')
  const cards = [
    { name: 'Admin', icon: <FaUserShield size={32} />, link: '/admin' },
    { name: 'Sales', icon: <FaChartLine size={32} />, link: '/sales' },
    { name: 'Stock', icon: <FaBoxes size={32} />, link: '/stock' },
    { name: 'Item', icon: <FaRegListAlt size={32} />, link: '/item' },
    { name: 'Transaction', icon: <FaExchangeAlt size={32} />, link: '/transaction' },
  ];
  console.log(userName);

  return (
    <div className="min-h-[81.4vh] bg-gray-100">
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to your Dashboard {userName && `${userName}`}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
          {cards.map((card, index) => (
            <Link to={card.link} key={index} className="bg-white p-6 rounded-lg py-9 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center hover:bg-gradient-to-b hover:from-white hover:via-blue-500 hover:to-blue-600 hover:text-white">
              {card.icon}
              <h2 className="text-xl font-semibold mt-4">{card.name}</h2>
            </Link>
          ))}
        </div>
      </main>
      
    </div>
  );
};

export default Dashboard;
