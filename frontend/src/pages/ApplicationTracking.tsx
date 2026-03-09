import { useState, useEffect } from 'react';
import API from '../services/api';
import { Application } from '../types';

const statusColors: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-700 border-blue-200',
  shortlisted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  hired: 'bg-green-100 text-green-700 border-green-200',
};

const statusIcons: Record<string, string> = {
  applied: '📋',
  shortlisted: '⭐',
  rejected: '❌',
  hired: '🎉',
};

const ApplicationTracking = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/applications/my').then(res => {
      setApplications(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">My Applications 📋</h1>
          <p className="text-blue-200 mt-1">Track all your job applications</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Pipeline Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {['applied', 'shortlisted', 'hired', 'rejected'].map((status) => (
            <div key={status} className={`rounded-xl p-4 text-center border-2 cursor-pointer transition ${statusColors[status]} ${filter === status ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setFilter(filter === status ? 'all' : status)}>
              <div className="text-2xl">{statusIcons[status]}</div>
              <div className="text-2xl font-bold mt-1">{applications.filter(a => a.status === status).length}</div>
              <div className="text-sm font-medium capitalize mt-1">{status}</div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {['all', 'applied', 'shortlisted', 'hired', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            filtered.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Application #{app.id}</h3>
                  <p className="text-gray-500 text-sm mt-1">Job ID: {app.job_id}</p>
                  {app.cover_letter && (
                    <p className="text-gray-600 text-sm mt-2 italic">"{app.cover_letter.substring(0, 100)}..."</p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border capitalize ${statusColors[app.status]}`}>
                    {statusIcons[app.status]} {app.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracking;
