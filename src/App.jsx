// App.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    navigate('/signin')
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
