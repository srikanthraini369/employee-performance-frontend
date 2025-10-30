import { useState } from 'react';
import './Login.css'; // reuse the same CSS for consistent design
import ApiService from '../services/ApiService';

const Register = ({ onRegister}) => {
  const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');

  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let user = { first_name: firstName,last_name: lastName, email, password, is_admin:role }
      const response = await ApiService.register(user);

      if (response.status || response.success) {
        setSuccess('Registration successful! You can now log in.');
        setFirstName('');
        setLastName('');
        setemail('');
        setPassword('');
        setRole('Employee');
        onRegister && onRegister(response.data);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Employee Performance Management</h1>
          <p>Create New Account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form"> {error && <div className="login-error">{error}</div>} {success && <div className="login-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="First Name">First Name</label>
            <input type="text" id="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" disabled={loading} required />
          </div>
          
           <div className="form-group">
            <label htmlFor="Last Name">Last Name</label>
            <input type="text" id="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your Last name" disabled={loading} required />
          </div>


          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setemail(e.target.value)} placeholder="Enter your email" disabled={loading} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" disabled={loading} required />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} required >
              <option value=""> Select Role</option> 
              <option value= "false">Employee</option>
              <option value="true">Admin(Manager)</option>
            </select>
          </div>

          <button type="submit" className="btn-login" disabled={loading}> {loading ? 'Registering...' : 'Register'} </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? Go back to <button onClick={onRegister}>Login</button></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
