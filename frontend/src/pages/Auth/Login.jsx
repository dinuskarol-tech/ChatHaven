import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-chathaven-bg-main px-4">
      <div className="max-w-md w-full bg-chathaven-bg-panel rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-chathaven-accent-primary mb-6 text-center">
          ChatHaven
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-chathaven-text-primary text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-chathaven-bg-main text-chathaven-text-primary border border-chathaven-text-muted rounded focus:outline-none focus:border-chathaven-accent-primary"
              required
            />
          </div>

          <div>
            <label className="block text-chathaven-text-primary text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-chathaven-bg-main text-chathaven-text-primary border border-chathaven-text-muted rounded focus:outline-none focus:border-chathaven-accent-primary"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900 text-red-200 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-chathaven-accent-primary hover:bg-opacity-90 text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-chathaven-text-muted text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-chathaven-accent-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
