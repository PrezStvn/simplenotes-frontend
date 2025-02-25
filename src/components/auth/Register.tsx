import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2 className="auth-title">Register</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-editor-text/70 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-editor-bg border border-editor-border rounded
                       text-editor-text focus:outline-none focus:border-editor-accent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-editor-text/70 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-editor-bg border border-editor-border rounded
                       text-editor-text focus:outline-none focus:border-editor-accent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-editor-text/70 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 bg-editor-bg border border-editor-border rounded
                       text-editor-text focus:outline-none focus:border-editor-accent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-editor-accent hover:bg-editor-accent/90
                     text-white font-medium py-2 px-4 rounded
                     transition-colors duration-150"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-editor-text/50">
          Already have an account?{' '}
          <Link to="/login" className="text-editor-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
} 