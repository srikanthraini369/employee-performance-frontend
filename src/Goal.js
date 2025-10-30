import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Goal Management Table for Employee Performance Management System
export default function EPMS_Goals_Table({ apiEndpoint }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showForm, setShowForm] = useState(false); // ✅ Added missing state
  const dt = useRef(null);

  const [newGoal, setNewGoal] = useState({
    title: '',
    descriptionText: '',
    created_by: '',
    start_date: '',
    employe: ''
  });

  // fallback data
  const fallbackData = [
    {
      id: 9,
      title: 'employe management',
      descriptionText: 'Creat the spring boot project',
      owner_Name: 'venu',
      created_by: 'Srikanth',
      start_date: '2025-10-22',
      end_date: '2025-10-22',
      status: 'activate',
      created_at: '2025-10-22T12:12:52.5186484',
      employe: {
        id: 1,
        emp_code: '87965426',
        first_name: 'venu',
        last_name: 'Rayani',
        gender: 'male',
        phoneNo: 1234567890,
        email: 'sr4@gmail.com',
        manager_id: 3,
        department: 'softwar solution',
        job_title: 'java Devlopare',
        hire_date: null,
        active: 'yes'
      }
    }
  ];

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

  useEffect(() => {
    if (!apiEndpoint) {
      setGoals(fallbackData);
      return; 
    }

    setLoading(true);
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((json) => {
       if (Array.isArray(json.data)) setGoals(json.data);
        else if (Array.isArray(json)) setGoals(json);
        else setGoals(fallbackData);
      })
      .catch(() => setGoals(fallbackData))
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    console.log("goals",goals)
    try {
      const response = await fetch('http://localhost:8080//savegoals?eid=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goals),
      });
  
        if (response.ok) {

        setGoals((prev) => [...prev, { ...newGoal, id: prev.length + 1 }]);
        setShowForm(false);
        setNewGoal({ 
        title: '', 
        descriptionText: '', 
        owner_Name: '', 
        created_by: '', 
        start_date: '',
        end_date: '', 
        created_at: '', 
        employe: '' 
        });
        }else{
        alert('Failed to save Goals.');
     } 
    }catch (error){
        console.error('Error saving goals:',error);
        alert('Errpr saving goals...!');
        } 
    };

  const onDelete = (row) => {
    if (window.confirm(`Delete goal: ${row.title}?`)) {
      setGoals((prev) => prev.filter((g) => g.id !== row.id));
    }
  };

  return (
    <div className="epms-container">
      <div className="epms-card">
        <div className="epms-header">
          <div className="epms-title">Goals</div>
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
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Employe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fallbackData.map((gl) => (
              <tr key={gl.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{gl.id}</td>
                <td>{gl.title}</td>
                <td>{gl.descriptionText}</td>
                <td>{`${gl.employe.first_name}`}</td>
                <td>{gl.start_date}</td>
                <td>{gl.end_date}</td>
                <td>{gl.created_by}</td>
                <td>{gl.created_at}</td>
                <td>{`${gl.employe.id}`}</td>
                <td>
                  <button onClick={() => alert(`Edit ${gl.title}`)}>✏️</button>
                  <button onClick={() => onDelete(gl)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Goal Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Goal</h3>
           
            <form onSubmit={handleSave}>
                <h2 className="text-lg font-bold mb-3">Add New Goal</h2>

            <div className="mb-2">
                <label>Title:</label>
                <input
                type="text"
                name="title"
                value={goals.title}
                onChange={handleChange}
                required
                />
            </div>

            <div className="mb-2">
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={goals.description}
              onChange={handleChange}
              required
            />
            </div> 

            <div className="mb-2">
            <label>Owner:</label>
            <input
              type="text"
              name="owner"
              value={goals.owner}
              onChange={handleChange}
              required
            />
            </div>
             
            <div className="mb-2">
            <label>Start Date:</label>
            <input
              type="text"
              name="start_date"
              value={goals.start_date}
              onChange={handleChange}
              required
            />
            </div>
            
            <div className="mb-2">
            <label>End Date:</label>
            <input
              type="text"
              name="end_date"
              value={goals.end_date}
              onChange={handleChange}
              required
            />
            </div>
            
            <div className="mb-2">
            <label>Created By:</label>
            <input
              type="text"
              name="created_by"
              value={goals.created_by}
              onChange={handleChange}
              required
            />
            </div>
            
            <div className="mb-2">
            <label>Created At:</label>
            <input
              type="text"
              name="created_at"
              value={goals.created_at}
              onChange={handleChange}
              required
            />
            </div>
            
            <div className="mb-2">
            <label>Employe:</label>
            <input
              type="text"
              name="employe"
              value={goals.employe}
              onChange={handleChange}
              required
            />
            </div>

              {/* {Object.keys(newGoal).map((field) => (
                <div key={field} className="mb-2">
                  <label>{field}:</label>
                  <input name={field} value={newGoal[field]} onChange={handleChange} required />
                </div>
              ))} */}

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button type="submit" 
                className="bg-green-600 text-white px-4 py-2 rounded"
                >
            Save</button>
                <button type="button" 
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