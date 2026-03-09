import { Link, useNavigate } from 'react-router-dom';

import API from '../services/api';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface RegisterForm {
  full_name: string;
  email: string;
  password: string;
  role: 'candidate' | 'employer';
}

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', data);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
  <img src="/devhire-logo.svg" alt="DevHire" className="h-16" />
</div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register('full_name', { required: 'Full name is required' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:border-blue-400 transition">
                <input {...register('role', { required: true })} type="radio" value="candidate" className="text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">👤 Candidate</p>
                  <p className="text-xs text-gray-500">Looking for jobs</p>
                </div>
              </label>
              <label className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:border-blue-400 transition">
                <input {...register('role', { required: true })} type="radio" value="employer" className="text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">🏢 Employer</p>
                  <p className="text-xs text-gray-500">Hiring developers</p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
