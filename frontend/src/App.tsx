import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import ApplicationTracking from './pages/ApplicationTracking';
import AdminDashboard from './pages/AdminDashboard';
import ATSScanner from './pages/ATSScanner';

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
        <Route path="/ats-scanner" element={
          <ProtectedRoute role="candidate"><ATSScanner /></ProtectedRoute>
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
