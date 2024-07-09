// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Register from './components/Register.jsx';
import SignIn from './components/SignIn.jsx';
import Dashboard from './components/Dashboard.jsx';
import Admin from './components/Admin.jsx';
import Sales from './components/Sales.jsx';
import Stock from './components/Stock.jsx';
import Item from './components/Item.jsx';
import Transaction from './components/Transaction.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Home from './components/Home.jsx';
import NotFound from './components/NotFound.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <ProtectedRoute requiresAuth={false} />,
        children: [{ path: "/register", element: <Register /> }],
      },
      {
        path: "/signin",
        element: <ProtectedRoute requiresAuth={false} />,
        children: [{ path: "/signin", element: <SignIn /> }],
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute requiresAuth={true} />,
        children: [{ path: "/dashboard", element: <Dashboard /> }],
      },
      {
        path: "/admin",
        element: <ProtectedRoute requiresAuth={true} />,
        children: [{ path: "/admin", element: <Admin /> }],
      },
      {
        path: "/sales",
        element: <ProtectedRoute requiresAuth={true} />,
        children: [{ path: "/sales", element: <Sales /> }],
      },
      {
        path: "/stock",
        element: <ProtectedRoute requiresAuth={true} />,
        children: [{ path: "/stock", element: <Stock /> }],
      },
      {
        path: "/item",
        element: <ProtectedRoute requiresAuth={true} />,
        children: [{ path: "/item", element: <Item /> }],
      },
      {
        path: "/transaction",
        element: <ProtectedRoute requiresAuth={true} />,
        children: [{ path: "/transaction", element: <Transaction /> }],
      },
      {
        path : "*",
        element: <NotFound />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <ToastContainer />
    <RouterProvider router={router} />
  </>
  // {/* </React.StrictMode> */}
);
