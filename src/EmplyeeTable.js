import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "./App.css"

// Main component
export default function EmployeeTable({ apiEndpoint }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const dt = useRef(null);

  // Add form state
  const [employee, setEmployee] = useState({
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
    active: ''
  });

  // Sample fallback data
  const fallbackData = [
    {
      id: 1,
      emp_code: '87965426',
      first_name: 'Venu',
      last_name: 'Rayani',
      gender: 'male',
      phoneNo: 1234567890,
      email: 'sr4@gmail.com',
      password: 'sri123',
      manager_id: 3,
      department: 'Software Solutions',
      job_title: 'Java Developer',
      hire_date: '2025-10-17',
      active: 'yes'
    },
    {
      id: 2,
      emp_code: 'EM095476',
      first_name: 'Nagarjuna',
      last_name: 'Devandala',
      gender: 'male',
      phoneNo: 8657469542,
      email: 'naga@gmail.com',
      password: 'abc123',
      manager_id: 3,
      department: 'IT',
      job_title: 'Java Developer',
      hire_date: '2025-10-17',
      active: 'yes'
    }
  ];

  // Load CSS on mount
  useEffect(() => {
    const css = `
      .epms-container { max-width: 1100px; margin: 24px auto; font-family: Inter, Roboto, Arial, sans-serif; }
      .epms-card { background: #fff; border-radius: 8px; box-shadow: 0 6px 18px rgba(12,12,12,0.06); padding: 18px; }
      .epms-header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; }
      .epms-title { font-size:18px; font-weight:600; color:#222; }
      .p-input-icon-left .p-inputtext { width:260px; }
      .action-btns > button { margin-right:8px; }
      .no-data { text-align:center; padding:24px 0; color:#666; }
      .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
      .modal-content { background:#fff; padding:20px; border-radius:8px; width:400px; max-height:90vh; overflow-y:auto; box-shadow:0 4px 16px rgba(0,0,0,0.2); }
      .modal-content input { width:100%; padding:8px; margin-top:4px; margin-bottom:8px; border:1px solid #ccc; border-radius:4px; }
      .modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:12px; }
    `;
    const style = document.createElement('style');
    style.id = 'epms-styles';
    style.innerHTML = css;
    document.head.appendChild(style);
    return () => document.getElementById('epms-styles')?.remove();
  }, []);

  // Fetch data or fallback
  useEffect(() => {
    if (!apiEndpoint) {
      setEmployees(fallbackData);
      return;
    }

    setLoading(true);
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json.data)) setEmployees(json.data);
        else if (Array.isArray(json)) setEmployees(json);
        else setEmployees(fallbackData);
      })
      .catch(() => setEmployees(fallbackData))
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  // Template renderers
  const nameBodyTemplate = (rowData) => (
    <div>
      <div style={{ fontWeight: 600 }}>
        {rowData.first_name} {rowData.last_name}
      </div>
      <div style={{ fontSize: 12, color: '#666' }}>{rowData.job_title}</div>
    </div>
  );

  const actionsBodyTemplate = (rowData) => (
    <div className="action-btns">
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => onEdit(rowData)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-text" onClick={() => onDelete(rowData)} />
    </div>
  );

  const onEdit = (row) => alert(`Edit employee: ${row.first_name} ${row.last_name}`);
  const onDelete = (row) => {
    if (window.confirm(`Delete employee ${row.first_name} ${row.last_name}?`)) {
      setEmployees((prev) => prev.filter((e) => e.id !== row.id));
    }
  };

  // 👉 handle form change
  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // 👉 handle save
  const handleSave = async (e) => {
    e.preventDefault();
    console.log("employee",employee)
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });

      if (response.ok) {
        alert('Employee saved successfully!');
        setEmployees([...employees, { ...employee, id: employees.length + 1 }]);
        setShowForm(false);
        setEmployee({
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
          active: ''
        });
      } else {
        alert('Failed to save employee.');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee!');
    }
  };

  return (
    <div className="epms-container">
      <div className="epms-card">
          <div className="epms-header">
      <div className="epms-title">Employees</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
        <Button label="Add" icon="pi pi-plus" onClick={() => setShowForm(true)} />
      </div>
    </div>

         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f4f4f4' }}>
              <tr>
                <th >ID</th>
                <th >Emp Code</th>
                <th >Name</th>
                <th >Gender</th>
                <th >Email</th>
                <th >Department</th>
                <th >Job Title</th>
                <th >Hire Date</th>
                <th >Active</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {fallbackData.map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td>{e.id}</td>
                  <td >{e.emp_code}</td>
                  <td >
                    <strong>{e.first_name} {e.last_name}</strong>
                  </td>
                  <td>{e.gender}</td>
                  <td>{e.email}</td>
                  <td>{e.department}</td>
                  <td>{e.job_title}</td>
                  <td>{e.hire_date}</td>
                  <td>{e.active}</td>
                  <td>
                    <button onClick={() => alert(`Edit ${e.first_name}`)} >✏️</button>
                    <button onClick={() => onDelete(e.id)} >🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        {/* <DataTable
          ref={dt}
          value={employees}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          globalFilter={globalFilter}
          emptyMessage={<div className="no-data">No employees found</div>}
          responsiveLayout="scroll"
          className="p-mt-2"
        >
          <Column field="id" header="ID" sortable />
          <Column field="emp_code" header="Emp Code" sortable />
          <Column header="Name" body={nameBodyTemplate} sortable />
          <Column field="gender" header="Gender" sortable style={{ width: '110px' }} />
          <Column field="email" header="Email" />
          <Column field="department" header="Department" />
          <Column field="job_title" header="Job Title" />
          <Column field="hire_date" header="Hire Date" />
          <Column field="active" header="Active" style={{ width: '90px' }} />
          <Column header="Actions" body={actionsBodyTemplate} style={{ width: '120px' }} />
        </DataTable> */}
      </div>

      {/* Add Employee Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Employee</h3>
            
            <form onSubmit={handleSave} className="mt-4 border p-4 rounded shadow-md">
          <h2 className="text-lg font-bold mb-3">Add New Employee</h2>

          <div className="mb-2">
            <label>Employee Code:</label>
            <input
              type="text"
              name="emp_code"
              value={employee.emp_code}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-2">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={employee.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={employee.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Gender:</label>
            <select
              name="gender"
              value={employee.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="mb-2">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNo"
              value={employee.phoneNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={employee.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Manager ID:</label>
            <input
              type="text"
              name="manager_id"
              value={employee.manager_id}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Department:</label>
            <input
              type="text"
              name="department"
              value={employee.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Job Title:</label>
            <input
              type="text"
              name="job_title"
              value={employee.job_title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label>Active:</label>
            <select
              name="active"
              value={employee.active}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
          </div>
        </div>
      )}
    </div>
  );
}
