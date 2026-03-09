import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Job } from '../types';

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      const res = await API.get(`/jobs/?${params.toString()}`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Find Your Next Role</h1>
          <p className="text-blue-200 mb-8">Browse hundreds of developer jobs</p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="🔍 Search by title or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              placeholder="📍 Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="md:w-48 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={fetchJobs}
              className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No jobs found</p>
            <p className="text-gray-400 mt-2">Try different search terms</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 mb-4">{jobs.length} jobs found</p>
            {jobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-100 hover:border-blue-200 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600">{job.title}</h2>
                      <p className="text-blue-600 font-medium mt-1">{job.company_name}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">📍 {job.location}</span>
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">💼 {job.job_type.replace('_', ' ')}</span>
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">⭐ {job.experience_level}</span>
                        {job.salary_min && (
                          <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm">
                            💰 ${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {job.skills_required && (
                        <p className="text-gray-500 text-sm mt-2">🛠 {job.skills_required}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
