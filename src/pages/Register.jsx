import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    code: '',
    acceptedTerms: false
  });
  const [message, setMessage] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return score;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return score; // max 6
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['#ff4d4d', '#ff751a', '#ffb84d', '#ffe066', '#a3d977', '#4caf50'];

  const handleSendCode = async () => {
    if (!formData.email) {
      setMessage('Please enter your email first.');
      return;
    }
    if (!formData.name) {
      setMessage('Please enter your name first.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/send-verification-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });
      const data = await res.json();
      if (res.ok) setMessage('Verification code sent. Check your email.');
      else setMessage(data.error || 'Failed to send code.');
    } catch {
      setMessage('Error sending code.');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.acceptedTerms) {
      setShowTermsModal(true);
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/verify-code-and-register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, timezone: userTimezone }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration complete!');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch {
      setMessage('Error registering.');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <form className="bg-gray-800 p-6 rounded-lg shadow-md w-80" onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold mb-4">Register</h2>

          <input
            className="w-full p-2 mb-4 rounded"
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            className="w-full p-2 mb-4 rounded"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded mb-4"
            onClick={handleSendCode}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
          <input
            className="w-full p-2 mb-1 rounded"
            name="code"
            type="text"
            placeholder="Verification Code"
            value={formData.code}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            className="w-full p-2 mb-1 rounded"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          {formData.password && (
            <div className="mb-4">
              <div
                className="h-2 rounded"
                style={{
                  width: `${(passwordStrength / 6) * 100}%`,
                  backgroundColor: strengthColors[passwordStrength - 1] || '#ccc',
                  transition: 'width 0.3s ease'
                }}
              />
              <p className="text-sm mt-1" style={{ color: strengthColors[passwordStrength - 1] || '#ccc' }}>
                {strengthLabels[passwordStrength - 1] || 'Very Weak'}
              </p>
            </div>
          )}

          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              disabled={loading}
              required
              className="mr-2"
            />
            I accept the <button type="button" onClick={() => setShowTermsModal(true)} className="underline text-blue-400">Terms and Conditions</button>
          </label>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {message && <p className="mt-2 text-center">{message}</p>}
        </form>
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-lg max-h-[80vh] overflow-y-auto text-white relative">
            <h3 className="text-xl font-bold mb-4">Terms and Conditions</h3>
            <p className="mb-4">
              By registering, you agree to allow us to collect your location/timezone information for a better user experience. Your data will be securely handled and not shared with third parties.
            </p>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setShowTermsModal(false)}
            >
              &times;
            </button>
            <button
              className="mt-4 bg-green-500 hover:bg-green-600 p-2 rounded"
              onClick={() => {
                setFormData(prev => ({ ...prev, acceptedTerms: true }));
                setShowTermsModal(false);
              }}
            >
              Accept Terms and Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
