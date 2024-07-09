import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from './Footer';
import Header from './Header';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    document.title = 'Register - Inventory Management System';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      toast.success('User registered successfully');
      setFormData({
        username: '',
        email: '',
        password: ''
      });
      navigate('/signin');
    } catch (error) {
      setError(error.response ? error.response.data : 'Server error');
      toast.error(error.response ? error.response.data : 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <main>
          <div className="min-h-[80.7vh] flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={formData.username.length <= 4 || !formData.email || !formData.password || loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
      <span className='my-3'>Already a User? <Link className='text-blue-400' to="/signin">Sign In</Link></span>
    </div>
    </main>
    </>
  );
};

export default Register;
