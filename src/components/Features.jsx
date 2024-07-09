import React from 'react';
import { FaBoxes, FaChartLine, FaUsers } from 'react-icons/fa';

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Features</h2>
        <div className="flex justify-around items-start flex-wrap">
          <FeatureCard
            icon={<FaBoxes className="text-blue-600 text-6xl mb-4" />}
            title="Inventory Tracking"
            description="Easily track your inventory with real-time updates and detailed analytics."
          />
          <FeatureCard
            icon={<FaChartLine className="text-blue-600 text-6xl mb-4" />}
            title="Analytics"
            description="Gain insights into your inventory management with powerful analytics tools."
          />
          <FeatureCard
            icon={<FaUsers className="text-blue-600 text-6xl mb-4" />}
            title="User Management"
            description="Manage user roles and permissions with ease, ensuring security and control."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="w-80 p-6 bg-gray-200 rounded-lg shadow-md text-center mb-8 flex flex-col items-center transform transition duration-300 hover:bg-gradient-to-b hover:from-white hover:via-blue-500 hover:to-blue-600 hover:text-white">
    <div className="icon-wrapper">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

export default Features;
