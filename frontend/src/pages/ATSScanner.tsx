import { useState, useEffect } from 'react';
import API from '../services/api';
import { Job } from '../types';

const ATSScanner = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/jobs/').then(res => setJobs(res.data));
  }, []);

  const handleScan = async () => {
    if (!selectedJob || !resumeText) return;
    setLoading(true);
    try {
      const res = await API.post(`/applications/ats-scan?job_id=${selectedJob}&resume_text=${encodeURIComponent(resumeText)}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">ATS Resume Scanner 🤖</h1>
          <p className="text-blue-200 mt-1">Check how well your resume matches a job description</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">1️⃣ Select Job</h2>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a job --</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} @ {job.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">2️⃣ Paste Your Resume</h2>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={12}
                placeholder="Paste your resume text here...&#10;&#10;Example:&#10;Skills: React, TypeScript, Node.js, PostgreSQL&#10;Experience: 3 years of software development..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <p className="text-gray-400 text-xs mt-2">{resumeText.length} characters</p>
            </div>

            <button
              onClick={handleScan}
              disabled={loading || !selectedJob || !resumeText}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? '🔍 Scanning...' : '🚀 Scan My Resume'}
            </button>
          </div>

          {/* Results Section */}
          <div>
            {!result ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-gray-500 text-lg font-medium">Your ATS Score will appear here</p>
                <p className="text-gray-400 text-sm mt-2">Select a job and paste your resume to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Score Card */}
                <div className={`bg-white rounded-2xl shadow-sm p-6 border-2 ${getScoreBg(result.score)}`}>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">ATS Match Score</h2>
                  <div className={`text-7xl font-black ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div
                      className={`h-3 rounded-full transition-all ${result.score >= 70 ? 'bg-green-500' : result.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <p className="text-lg mt-3 font-medium">{result.recommendation}</p>
                </div>

                {/* Matched Keywords */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 mb-3">✅ Matched Keywords ({result.matched_keywords.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_keywords.length === 0 ? (
                      <p className="text-gray-400 text-sm">No keywords matched</p>
                    ) : (
                      result.matched_keywords.map((kw: string) => (
                        <span key={kw} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ {kw}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 mb-3">❌ Missing Keywords ({result.missing_keywords.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.length === 0 ? (
                      <p className="text-green-600 text-sm font-medium">🎉 All keywords matched!</p>
                    ) : (
                      result.missing_keywords.map((kw: string) => (
                        <span key={kw} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                          ✗ {kw}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScanner;
