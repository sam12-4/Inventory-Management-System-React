// SignIn.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signin', formData);
      const { token, userName } = response.data; // Assuming response.data contains the token
      
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('userName', userName)
      toast.success('Login successful');
      // Update the authentication state
      navigate('/dashboard');
      setTimeout(() => {
        window.location.reload(); // Ensure Header updates
        }, 1000);
      console.log("response", response.data);
      console.log(token, userName);
    } catch (error) {
      setError(error.response ? error.response.data : 'Server error');
      toast.error(error.response ? error.response.data : 'Server error');
    }
  };

  return (
    <div className="min-h-[80.7vh] flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
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
            disabled={!formData.email || !formData.password}
          >
            Sign In
          </button>
        </form>
        <span className='my-3'>New user? <Link className='text-blue-400' to="/register">Register</Link></span>
      </div>
    </div>
  );
};

export default SignIn;
