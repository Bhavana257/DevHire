import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Job } from '../types';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [viewingApplicants, setViewingApplicants] = useState<number | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', company_name: '',
    location: '', salary_min: '', salary_max: '',
    job_type: 'full_time', experience_level: 'mid',
    category: 'software', skills_required: ''
  });

  const fetchMyJobs = async () => {
    try {
      const res = await API.get('/jobs/');
      const myJobs = res.data.filter((j: Job) => j.employer_id === user?.id);
      setJobs(myJobs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchMyJobs(); }, []);

  const handlePost = async () => {
    try {
      await API.post('/jobs/', {
        ...form,
        salary_min: Number(form.salary_min) || null,
        salary_max: Number(form.salary_max) || null,
      });
      setMessage('✅ Job posted successfully!');
      setShowForm(false);
      setForm({ title: '', description: '', company_name: '', location: '', salary_min: '', salary_max: '', job_type: 'full_time', experience_level: 'mid', category: 'software', skills_required: '' });
      fetchMyJobs();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Failed to post job');
    }
  };

  const handleDelete = async (jobId: number) => {
    if (!window.confirm('Delete this job?')) return;
    await API.delete(`/jobs/${jobId}`);
    fetchMyJobs();
  };

  const loadApplicants = async (jobId: number) => {
    if (viewingApplicants === jobId) {
      setViewingApplicants(null);
      return;
    }
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
      setViewingApplicants(jobId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard 🏢</h1>
            <p className="text-blue-200 mt-1">Manage your job postings</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition"
          >
            + Post New Job
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {message && (
          <div className={`p-4 rounded-xl mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Post Job Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Post a New Job</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'title', label: 'Job Title', placeholder: 'e.g. Senior React Developer' },
                { key: 'company_name', label: 'Company Name', placeholder: 'e.g. TechCorp' },
                { key: 'location', label: 'Location', placeholder: 'e.g. Remote, New York' },
                { key: 'skills_required', label: 'Skills (comma separated)', placeholder: 'React, Node.js, PostgreSQL' },
                { key: 'salary_min', label: 'Min Salary ($)', placeholder: '50000' },
                { key: 'salary_max', label: 'Max Salary ($)', placeholder: '100000' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={form.job_type}
                  onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  value={form.experience_level}
                  onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="software">💻 Software</option>
                  <option value="data">📊 Data</option>
                  <option value="devops">⚙️ DevOps</option>
                  <option value="design">🎨 Design</option>
                  <option value="mobile">📱 Mobile</option>
                  <option value="security">🔒 Security</option>
                  <option value="management">👔 Management</option>
                  <option value="other">🔧 Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the role, responsibilities and requirements..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handlePost} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition">
                Post Job
              </button>
              <button onClick={() => setShowForm(false)} className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: jobs.length, icon: '💼', color: 'bg-blue-600' },
            { label: 'Active Jobs', value: jobs.filter(j => j.is_active).length, icon: '🟢', color: 'bg-green-500' },
            { label: 'Inactive', value: jobs.filter(j => !j.is_active).length, icon: '🔴', color: 'bg-red-500' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} text-white rounded-xl p-5 text-center shadow`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-90 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Job Postings</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">No jobs posted yet</p>
              <button onClick={() => setShowForm(true)} className="text-blue-600 font-medium hover:underline mt-2">
                Post your first job!
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id}>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-bold text-gray-800">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.location} • {job.job_type.replace('_', ' ')} • {(job as any).category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => loadApplicants(job.id)}
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        {viewingApplicants === job.id ? 'Hide Applicants' : 'View Applicants'}
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-500 text-sm font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Applicants Panel */}
                  {viewingApplicants === job.id && (
                    <div className="mt-2 bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <h4 className="font-semibold text-gray-700 mb-3">👥 Applicants ({applicants.length})</h4>
                      {applicants.length === 0 ? (
                        <p className="text-gray-500 text-sm">No applicants yet</p>
                      ) : (
                        <div className="space-y-2">
                          {applicants.map((app: any) => (
                            <div key={app.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                              <div>
                                <p className="font-medium text-gray-800">Candidate #{app.candidate_id}</p>
                                <p className="text-xs text-gray-500">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                                {app.cover_letter && (
                                  <p className="text-xs text-gray-600 mt-1 italic">"{app.cover_letter.substring(0, 80)}..."</p>
                                )}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                app.status === 'hired' ? 'bg-green-100 text-green-700' :
                                app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-700' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
