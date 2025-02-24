import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-editor-bg">
      <div className="bg-editor-sidebar p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-editor-text">Login</h2>
        
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

          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full bg-editor-accent hover:bg-editor-accent/90
                     text-white font-medium py-2 px-4 rounded
                     transition-colors duration-150"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-editor-text/50">
          Don't have an account?{' '}
          <Link to="/register" className="text-editor-accent hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
} 