import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import BaseLayout from './BaseLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Result from './pages/Result';
import reportWebVitals from './reportWebVitals';
import Scan from './pages/Scan';
import ManualEntry from './pages/ManualEntry';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import History from './pages/History';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/scan',
        element: <PrivateRoute><Scan /></PrivateRoute>,
      },
      {
        path: '/manual-entry',
        element: <PrivateRoute><ManualEntry /></PrivateRoute>,
      },
      {
        path: '/chat',
        element: <PrivateRoute><Chat /></PrivateRoute>,
      },
      {
        path: '/result',
        element: <PrivateRoute><Result /></PrivateRoute>,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/history',
        element: <History />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
