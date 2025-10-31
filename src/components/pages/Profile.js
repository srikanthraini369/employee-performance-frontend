import { useState, useEffect } from 'react';
import '../styles/Profile.css';
import '../styles/Table.css';
import ApiService from '../../services/ApiService';

const Profile = ({ currentUser, onUserUpdate }) => {
  const [userData, setUserData] = useState(currentUser);
  const [userGoals, setUserGoals] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    emp_code: '',
    first_name: '',
    last_name: '',
    gender: '',
    phoneNo: '',
    email: '',
    password: '',
    manager_id: '',
    department: '',
    job_title: '',
    active: 'yes'
  });

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const userId = currentUser?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      let employeeData = currentUser;
      try {
        const employeeResponse = await ApiService.getEmployeeById(userId);
        employeeData = employeeResponse?.data || employeeResponse;
      } catch (fetchError) {
        employeeData = currentUser;
      }

      setUserData(employeeData);
      setError('');

      const goalsResponse = await ApiService.getGoals();
      const reviewsResponse = await ApiService.getReviews();

      const firstName = employeeData?.first_name || '';
      const lastName = employeeData?.last_name || '';
      const goalEmployeeName = lastName ? `${firstName} ${lastName}` : firstName;
      const filteredGoals = goalsResponse.data?.filter(goal => goal.emp_name === goalEmployeeName) || [];
      const filteredReviews = reviewsResponse.data?.filter(review => review.emp_id === userId) || [];

      setUserGoals(filteredGoals);
      setUserReviews(filteredReviews);
      setFormData((previous) => ({
        ...previous,
        emp_code: employeeData?.emp_code || '',
        first_name: firstName,
        last_name: lastName,
        gender: employeeData?.gender || '',
        phoneNo: employeeData?.phoneNo || '',
        email: employeeData?.email || '',
        manager_id: employeeData?.manager_id || '',
        department: employeeData?.department || '',
        job_title: employeeData?.job_title || '',
        active: employeeData?.active || 'yes'
      }));
    } catch (err) {
      console.error('Error loading profile data:', err);
      setError('Failed to load profile data');
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const openEditForm = () => {
    if (!userData) {
      return;
    }

    setFormData({
      emp_code: userData.emp_code || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      gender: userData.gender || '',
      phoneNo: userData.phoneNo || '',
      email: userData.email || '',
      password: userData.password || '',
      manager_id: userData.manager_id || '',
      department: userData.department || '',
      job_title: userData.job_title || '',
      active: userData.active || 'yes'
    });
    setShowEditForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const closeEditForm = () => {
    setShowEditForm(false);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.emp_code || !formData.first_name || !formData.last_name || !formData.email || !formData.phoneNo || !formData.department || !formData.job_title) {
      setError('Please fill in all required fields');
      return;
    }

    if (!userData?.id) {
      setError('User ID not found');
      return;
    }

    try {
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }

      const response = await ApiService.updateEmployee(userData.id, payload);
      const updatedData = response?.data || response || {};
      const mergedData = { ...userData, ...payload, ...updatedData };

      setUserData(mergedData);
      setFormData((previous) => ({
        ...previous,
        emp_code: mergedData.emp_code || '',
        first_name: mergedData.first_name || '',
        last_name: mergedData.last_name || '',
        gender: mergedData.gender || '',
        phoneNo: mergedData.phoneNo || '',
        email: mergedData.email || '',
        manager_id: mergedData.manager_id || '',
        department: mergedData.department || '',
        job_title: mergedData.job_title || '',
        active: mergedData.active || 'yes',
        password: ''
      }));
      localStorage.setItem('currentUser', JSON.stringify(mergedData));
      if (onUserUpdate) {
        onUserUpdate(mergedData);
      }

      setShowEditForm(false);
      setSuccess('Profile updated successfully');
      await loadUserData({ showLoader: false });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const getAverageRating = () => {
    if (userReviews.length === 0) return 0;
    const sum = userReviews.reduce((acc, review) => acc + parseFloat(review.rating), 0);
    return (sum / userReviews.length).toFixed(2);
  };

  const getCompletedGoalsCount = () => {
    return userGoals.filter(goal => goal.status?.toLowerCase() === 'completed').length;
  };

  const getInProgressGoalsCount = () => {
    return userGoals.filter(goal => goal.status?.toLowerCase() === 'in progress').length;
  };

  if (loading) {
    return <div className="loader">Loading profile...</div>;
  }

  return (
    <div className="page-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}
      {success && <div className="alert alert-success"><span>{success}</span></div>}

      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-avatar">{userData?.first_name?.charAt(0) || '👤'}</div>
          <div className="profile-info">
            <h2>{userData?.first_name} {userData?.last_name}</h2>
            <p className="position">{userData?.job_title}</p>
            <p className="department">Department: {userData?.department}</p>
            <p className="email">Email: {userData?.email}</p>
            <p className="phone">Phone: {userData?.phoneNo}</p>
          </div>
          <button className="profile-edit-btn" onClick={openEditForm} title="Edit Profile">✏️</button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{userGoals.length}</div>
            <div className="stat-label">Total Goals</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{getCompletedGoalsCount()}</div>
            <div className="stat-label">Completed Goals</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">{getInProgressGoalsCount()}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{getAverageRating()}/5</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>
      </div>

      {showEditForm && (
        <div className="modal-overlay" onClick={closeEditForm}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="form-container">
              <div className="form-header">
                <h2>Edit Profile</h2>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee Code *</label>
                    <input type="text" name="emp_code" value={formData.emp_code} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Leave blank to keep current password" />
                  </div>
                  <div className="form-group">
                    <label>Manager ID</label>
                    <input type="text" name="manager_id" value={formData.manager_id} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department *</label>
                    <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Active Status</label>
                    <select name="active" value={formData.active} onChange={handleInputChange}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-success">Update</button>
                  <button type="button" className="btn-secondary" onClick={closeEditForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Goals Section */}
      <div className="profile-section">
        <h3>My Goals</h3>
        {userGoals.length === 0 ? (
          <p className="no-data">No goals assigned yet</p>
        ) : (
          <div className="goals-list">
            {userGoals.map(goal => (
              <div key={goal.id} className="goal-item">
                <div className="goal-header">
                  <h4>{goal.title}</h4>
                  <span className={`badge badge-${goal.status?.toLowerCase().replace(' ', '')}`}>{goal.status}</span>
                </div>
                <p className="goal-description">{goal.descriptionText}</p>
                <div className="goal-meta">
                  <span className="created-by">Created By: {goal.created_by}</span>
                </div>
                <div className="goal-dates">
                  <p className="goal-date">Start: {goal.start_date}</p>
                  <p className="goal-date">End: {goal.end_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="profile-section">
        <h3>Performance Reviews</h3>
        {userReviews.length === 0 ? (
          <p className="no-data">No reviews yet</p>
        ) : (
          <div className="reviews-list">
            {userReviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <h4>Review Cycle #{review.review_cycle_id}</h4>
                  <div className="review-rating">
                    {'⭐'.repeat(Math.floor(review.rating))} {review.rating}/5
                  </div>
                </div>
                <p className="reviewer">Reviewer: {review.reviewer_name}</p>
                <p className="review-comments">{review.comments}</p>
                <div className="review-footer">
                  <span className={`badge badge-${review.status?.toLowerCase()}`}>{review.status}</span>
                  <span className="review-date">{review.created_date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;