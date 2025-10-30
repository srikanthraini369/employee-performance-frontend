import { useState, useEffect } from 'react';
import '../styles/Table.css';
import ApiService from '../../services/ApiService';

const GoalsTable = ({ currentUser }) => {
  
  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.is_admin
  console.log(user);              // shows the actual object
  console.log(user?.is_admin);  // safely logs the first name (or undefined if null)


  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    descriptionText: '',
    status: 'in progress',
    created_by: '',
    emp_id: '',
    emp_name: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadGoals();
    loadEmployees();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getGoals();
      setGoals(response.data);
    } catch (err) {
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await ApiService.getEmployees();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.descriptionText || !formData.emp_id || !formData.start_date || !formData.end_date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) { 
        await ApiService.updateGoal(editingId, formData);
        setSuccess('Goal updated successfully');
      } else {
        await ApiService.createGoal(formData);
        setSuccess('Goal created successfully');
      }
      
      resetForm();
      loadGoals();
      loadEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleEdit = (goal) => {
    setFormData({
      title: goal.title,
      descriptionText: goal.descriptionText,
      status: goal.status,
      created_by: goal.created_by,
      emp_id: goal.emp_id,
      emp_name: goal.emp_name,
      start_date: goal.start_date,
      end_date: goal.end_date
    });
    setEditingId(goal.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await ApiService.deleteGoal(deleteId);
      setSuccess('Goal deleted successfully');
      setShowDeleteConfirm(false);
      setDeleteId(null);
      loadGoals();
      setTimeout(() => setSuccess(''), 3000);
      alert('Goal deleted successfully!');
    } catch (err) {
      setError(err.message || 'Delete failed');
      setShowDeleteConfirm(false);
      setDeleteId(null);
      alert('Failed to delete goal: ' + (err.message || 'Delete failed'));
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      descriptionText: '',
      status: 'in progress',
      created_by: '',
      emp_id: '',
      emp_name: '',
      start_date: '',
      end_date: ''
    });
    setError('');
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#48bb78';
    if (progress >= 60) return '#ed8936';
    return '#f56565';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Goals Management</h1>
       {isAdmin && <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Goal</button>} 
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}
      {success && <div className="alert alert-success"><span>{success}</span></div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-container">
              <div className="form-header">
                <h2>{editingId ? 'Edit Goal' : 'Add New Goal'}</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Goal Title *</label>
                    <input type="text"  name="title" value={formData.title} onChange={handleInputChange} placeholder="Goal title" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea  name="descriptionText" value={formData.descriptionText} onChange={handleInputChange} placeholder="Goal description" rows="3" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Employee *</label>
                    <select name="emp_id" value={formData.emp_id} onChange={(e) => {
                        const selectedEmployee = employees.find(emp => emp.id === parseInt(e.target.value));
                        setFormData(prev => ({ ...prev, emp_id: e.target.value, emp_name: selectedEmployee?.first_name + ' ' + selectedEmployee?.last_name || ''}));}} required >
                        <option value="">Select Employee</option> {employees.map(emp => (
                        <option key={emp.id} value={emp.id}> {emp.first_name} {emp.last_name} </option> ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Created By</label>
                    <input type="text" name="created_by" value={formData.created_by} onChange={handleInputChange} placeholder="Created by" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status *</label>
                    <select  name="status"  value={formData.status}  onChange={handleInputChange}  required  >
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange}  required  />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input type="date" name="end_date"  value={formData.end_date} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-success"> {editingId ? 'Update' : 'Create'} </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}> Cancel </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirmation">
              <div className="delete-icon">⚠️</div>
              <h2>Delete Goal</h2>
              <p>Are you sure you want to delete this goal? This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-danger" onClick={confirmDelete}>  Yes, Delete </button>
                <button className="btn-secondary" onClick={cancelDelete}> Cancel </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader">Loading goals...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                {isAdmin&& <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {goals.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No goals found</td>
                </tr>
              ) : (
                goals.map(goal => (
                  <tr key={goal.id}>
                    <td>{goal.id}</td>
                    <td>{goal.title}</td>
                    <td>{goal.emp_name}</td>
                    <td>{goal.created_by}</td>
                    <td> <span className={`badge badge-${goal.status.toLowerCase().replace(' ', '')}`}> {goal.status} </span> </td>
                    <td>{goal.start_date}</td>
                    <td>{goal.end_date}</td>
                   {isAdmin&&  <td className="actions-cell">
                      <button className="btn-sm btn-warning" onClick={() => handleEdit(goal)} > Edit </button>
                      <button className="btn-sm btn-danger" onClick={() => handleDelete(goal.id)} > Delete </button> 
                   
                    </td>}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GoalsTable;