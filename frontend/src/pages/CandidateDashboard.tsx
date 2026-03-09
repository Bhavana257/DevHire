import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Application } from '../types';

const statusColors: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  hired: 'bg-green-100 text-green-700',
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/applications/my').then(res => {
      setApplications(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    hired: applications.filter(a => a.status === 'hired').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Welcome back, {user?.full_name}! 👋</h1>
          <p className="text-blue-200 mt-1">Track your job applications</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applied', value: stats.total, color: 'bg-blue-600', icon: '📋' },
            { label: 'Pending', value: stats.applied, color: 'bg-blue-400', icon: '⏳' },
            { label: 'Shortlisted', value: stats.shortlisted, color: 'bg-yellow-500', icon: '⭐' },
            { label: 'Hired', value: stats.hired, color: 'bg-green-500', icon: '🎉' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} text-white rounded-xl p-5 text-center shadow`}>
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-90 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link to="/jobs" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            🔍 Browse Jobs
          </Link>
          <Link to="/candidate/applications" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
            📋 All Applications
          </Link>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Applications</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">No applications yet</p>
              <Link to="/jobs" className="text-blue-600 font-medium hover:underline mt-2 inline-block">
                Browse jobs and apply!
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">Application #{app.job_id}</p>
                    <p className="text-sm text-gray-500">{new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
