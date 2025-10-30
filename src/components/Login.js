import { useState } from 'react';
// import { Link } from 'react-router-dom';
import './Login.css';
import ApiService from '../services/ApiService';

const Login = ({ onLogin ,handleRegister}) => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => { e.preventDefault(); setError(''); setLoading(true);

    try {
      const response = await ApiService.login(email, password);
      if (response.status === 200) {
        onLogin(response.data);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoUser) => { setemail(demoUser); setPassword('password'); setError(''); setLoading(true);

    try {
      const response = await ApiService.login(demoUser, 'password');
      if (response.success) {
        onLogin(response.data);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Employee Performance Management</h1>
          <p>Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form"> {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" value={email} onChange={(e) => setemail(e.target.value)}  placeholder="Enter your email"  disabled={loading} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input  type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" disabled={loading} required />
          </div>

          <button type="submit" className="btn-login" disabled={loading}> {loading ? 'Logging in...' : 'Login'} </button>
        </form>

          {/* <div className="demo-section">
          <p>Demo Accounts:</p>
          <button  type="button"  className="btn-demo" onClick={() => handleDemoLogin('admin')} disabled={loading} > Admin Account </button>
          <button  type="button"  className="btn-demo" onClick={() => handleDemoLogin('user')} disabled={loading} > User Account </button>
        </div> */}

        <div className="login-footer">
        <p>Don't have an Account</p>
         &nbsp;
        <button onClick={handleRegister}>Register</button>
        </div>

        

        {/* <div className="login-footer">
          <p>This is a demo application. Use any email/password to login.</p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;