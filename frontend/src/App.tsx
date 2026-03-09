import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard';
import ApplicationTracking from './pages/ApplicationTracking';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import JobDetail from './pages/JobDetail';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import React from 'react';
import Register from './pages/Register';

const ProtectedRoute = ({ children, role }: { children: React.ReactElement, role?: string }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/candidate/dashboard" element={
          <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute role="candidate"><ApplicationTracking /></ProtectedRoute>
        } />
        <Route path="/employer/dashboard" element={
          <ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
