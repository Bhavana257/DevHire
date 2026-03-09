export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'candidate' | 'employer' | 'admin';
  is_active: boolean;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  company_name: string;
  location: string;
  salary_min: number;
  salary_max: number;
  job_type: string;
  experience_level: string;
  skills_required: string;
  is_active: boolean;
  employer_id: number;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  candidate_id: number;
  status: 'applied' | 'shortlisted' | 'rejected' | 'hired';
  cover_letter: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
