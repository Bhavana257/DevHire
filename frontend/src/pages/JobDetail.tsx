import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/jobs/${id}`).then(res => {
      setJob(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setApplying(true);
    try {
      await API.post('/applications/', { job_id: Number(id), cover_letter: coverLetter });
      setMessage('✅ Application submitted successfully!');
      setShowForm(false);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!job) return <div className="text-center py-20 text-gray-500">Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
              <p className="text-blue-600 text-xl font-medium mt-1">{job.company_name}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {job.is_active ? '🟢 Active' : '🔴 Closed'}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full">📍 {job.location}</span>
            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full">💼 {job.job_type.replace('_', ' ')}</span>
            <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full">⭐ {job.experience_level}</span>
            {job.salary_min && (
              <span className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full">
                💰 ${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2">Job Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.skills_required && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.split(',').map((skill, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{skill.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-lg mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {user?.role === 'candidate' && job.is_active && (
            <>
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Apply Now 🚀
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    placeholder="Write a cover letter (optional)..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Login to Apply 🔐
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
