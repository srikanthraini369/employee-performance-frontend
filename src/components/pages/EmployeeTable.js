import { useState, useEffect } from 'react';
import '../styles/Table.css';
import ApiService from '../../services/ApiService';



const EmployeeTable = () => {

  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.is_admin
  console.log(user);              // shows the actual object
  console.log(user?.is_admin);  // safely logs the first name (or undefined if null)

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
    loadEmployees();
  }, []);

  // const loadEmployees = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await ApiService.getEmployees();
  //     console.log("response", response);
  //     console.log("response data", response.data);
  //     setEmployees(response.data);
  //   } catch (err) {
  //     setError('Failed to load employees');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadEmployees = async () => {
  try {
    setLoading(true);
    const response = await ApiService.getEmployees();
    console.log("response", response);
    console.log("response data", response.data);

    // Filter only employees with is_admin = true
    const adminEmployees = response.data.filter(emp => emp.is_admin === false);

    setEmployees(adminEmployees);
  } catch (err) {
    console.error(err);
    setError('Failed to load employees');
  } finally {
    setLoading(false);
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
    console.log("formData", formData);
    e.preventDefault();
    setError('');

    if (!formData.emp_code || !formData.first_name || !formData.last_name || !formData.email || !formData.phoneNo || !formData.department || !formData.job_title) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await ApiService.updateEmployee(editingId, formData);
        setSuccess('Employee updated successfully');
      } else {
        await ApiService.createEmployee(formData);
        setSuccess('Employee created successfully');
      }
      
      setFormData({ emp_code: '', first_name: '', last_name: '', gender: '', phoneNo: '', email: '', password: '', manager_id: '', department: '', job_title: '', active: 'yes' });
      setEditingId(null);
      setShowForm(false);
      loadEmployees();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      emp_code: employee.emp_code || '',
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      gender: employee.gender || '',
      phoneNo: employee.phoneNo || '',
      email: employee.email || '',
      password: employee.password || '',
      manager_id: employee.manager_id || '',
      department: employee.department || '',
      job_title: employee.job_title || '',
      active: employee.active || 'yes'
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await ApiService.deleteEmployee(deleteId);
      setSuccess('Employee deleted successfully');
      setShowDeleteConfirm(false);
      setDeleteId(null);
      loadEmployees();
      setTimeout(() => setSuccess(''), 3000);
      alert('Employee deleted successfully!');
    } catch (err) {
      setError(err.message || 'Delete failed');
      setShowDeleteConfirm(false);
      setDeleteId(null);
      alert('Failed to delete employee: ' + (err.message || 'Delete failed'));
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ emp_code: '', first_name: '', last_name: '', gender: '', phoneNo: '', email: '', password: '', manager_id: '', department: '', job_title: '', active: 'yes' });
    setError('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Employees</h1>
        {isAdmin && <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Employee</button>}
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}
      {success && <div className="alert alert-success"><span>{success}</span></div>}

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-container">
              <div className="form-header">
                <h2>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee Code *</label>
                    <input type="text" name="emp_code" value={formData.emp_code} onChange={handleInputChange} placeholder="e.g., EM095476" required  />
                  </div>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="First name" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Last name" required />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} >
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
                    <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleInputChange} placeholder="e.g., 8657469542" required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" required />
                  </div>
                </div><div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password"name="password" value={formData.password}onChange={handleInputChange}placeholder="Password" />
                  </div>
                  <div className="form-group">
                    <label>Manager ID</label>
                    <input type="text"name="manager_id" value={formData.manager_id}onChange={handleInputChange}placeholder="Manager ID"/>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department *</label>
                    <input type="text"name="department" value={formData.department}onChange={handleInputChange}placeholder="e.g., IT, HR, Sales"required />
                  </div>
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} placeholder="e.g., Java Developer" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Active Status</label>
                    <select name="active" value={formData.active} onChange={handleInputChange}  >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-success"> {editingId ? 'Update' : 'Create'} </button>
                  <button type="button" className="btn-secondary" onClick={handleCancel}> Cancel </button>
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
              <h2>Delete Employee</h2>
              <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-danger" onClick={confirmDelete}> Yes, Delete </button> 
                <button className="btn-secondary" onClick={cancelDelete}> Cancel </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader">Loading employees...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th> 
                <th>Employee Code</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Manager ID</th>
                <th>Email</th>
                {/* <th>Password</th> */}
                <th>Phone</th>
                <th>Department</th>
                <th>Job Title</th>
                <th>Status</th> 
                <th>HireDate</th>
               {isAdmin&& <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center">No employees found</td>
                </tr>
              ) : (
                employees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>  
                    <td>{employee.emp_code}</td>
                    <td className="name-cell">{employee.first_name + ' ' + employee.last_name}</td>
                    <td>{employee.gender}</td>
                    <td>{employee.manager_id}</td>
                    <td>{employee.email}</td>
                    {/* <td>{employee.password}</td>   */}
                    <td>{employee.phoneNo}</td>
                    <td>{employee.department}</td>
                    <td>{employee.job_title}</td>
                    <td>
                      <span className={`badge badge-${employee.active === 'yes' ? 'active' : 'inactive'}`}>
                        {employee.active === 'yes' ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{new Date(employee.hire_date).toLocaleDateString()}</td>
                    {isAdmin&& <td className="actions-cell">
                      <button 
                        className="btn-sm btn-warning"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-sm btn-danger"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </button>
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

export default EmployeeTable;