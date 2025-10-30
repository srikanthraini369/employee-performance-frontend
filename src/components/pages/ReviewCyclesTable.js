import React,{ useState, useEffect } from "react";
import "../styles/Table.css";
import reviewCyclesData from "../../data/reviewCycles.json";
import reviewsData from "../../data/reviews.json";
import ApiService from "../../services/ApiService";

const ReviewCyclesTable = () => {

  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.is_admin
  console.log(user);              // shows the actual object
  console.log(user?.is_admin);  // safely logs the first name (or undefined if null)


  const [cycles, setCycles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedCycles, setExpandedCycles] = useState({});
  const [formData, setFormData] = useState({
    cycle_name: "",
    start_date: "",
    end_date: "",
    status: "planned",
    description: "",
  });

  useEffect(() => {
    loadReviewCycles();
  }, []);

  const loadReviewCycles = async () => {
    try {
      setLoading(true);
      // setCycles(reviewCyclesData);
      const res = await ApiService.getReviewCycles();
      setCycles(res.data);
      // setReviews(reviewsData);
      const response = await ApiService.getReviews();
      setReviews(response.data);
    } catch (err) {
      setError("Failed to load review cycles");
    } finally {
      setLoading(false);
    }
  };

  const toggleCycleExpand = (cycleId) => {
    setExpandedCycles((prev) => ({
      ...prev,
      [cycleId]: !prev[cycleId],
    }));
  };

  const getCycleReviews = (cycleId) => {
    return reviews.filter((review) => review.review_cycle_id === cycleId);
  };

  const getAverageRating = (cycleId) => {
    const cycleReviews = getCycleReviews(cycleId);
    if (cycleReviews.length === 0) return 0;
    const sum = cycleReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / cycleReviews.length).toFixed(1);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#48bb78";
    if (rating >= 3.5) return "#ed8936";
    return "#f56565";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.cycle_name || !formData.start_date || !formData.end_date) {
      setError("Please fill in all required fields");
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError("Start date must be before end date");
      return;
    }

    try {
      if (editingId) {
        await ApiService.updateReviewCycle(editingId, formData);
        setSuccess("Review cycle updated successfully");
      } else {
        await ApiService.createReviewCycle(formData);
        setSuccess("Review cycle created successfully");
      }

      resetForm();
      loadReviewCycles();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const handleEdit = (cycle) => {
    setFormData({
      cycle_name: cycle.cycle_name,
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      status: cycle.status,
      description: cycle.description,
    });
    setEditingId(cycle.id);
    setShowForm(true);
  };

  const handleDelete = (id) => { setDeleteId(id); setShowDeleteConfirm(true); };
  const confirmDelete = async () => {
    try {await ApiService.deleteReviewCycle(deleteId); setSuccess("Review cycle deleted successfully"); setShowDeleteConfirm(false); setDeleteId(null); loadReviewCycles(); setTimeout(() => setSuccess(""), 3000);  alert("Review cycle deleted successfully!"); } 
    catch (err) { setError(err.message || "Delete failed"); setShowDeleteConfirm(false); setDeleteId(null); alert( "Failed to delete review cycle: " + (err.message || "Delete failed")); }
  };

  const cancelDelete = () => { setShowDeleteConfirm(false); setDeleteId(null); };

  const resetForm = () => { setShowForm(false); setEditingId(null); setFormData({ cycle_name: "", start_date: "", end_date: "", status: "planned", description: "", }); setError("");  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Review Cycles</h1>
        {isAdmin && <button className="btn-primary" onClick={() => setShowForm(true)}> + Add Review Cycle </button>}
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-container">
              <div className="form-header">
                <h2>
                  {editingId ? "Edit Review Cycle" : "Add New Review Cycle"}
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cycle Name *</label>
                    <input type="text" name="cycle_name" value={formData.cycle_name} onChange={handleInputChange} placeholder="e.g., Q1 2025 Performance Review" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input  type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status *</label>
                    <select name="status" value={formData.status}  onChange={handleInputChange} required >
                      <option value="planned">Planned</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange}  placeholder="Review cycle description" rows="3" />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-success"> {editingId ? "Update" : "Create"} </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}  > Cancel </button>
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
              <h2>Delete Review Cycle</h2>
              <p> Are you sure you want to delete this review cycle? This action cannot be undone. </p>
              <div className="modal-actions">
                <button className="btn-danger" onClick={confirmDelete}> Yes, Delete </button>
                <button className="btn-secondary" onClick={cancelDelete}> Cancel </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader">Loading review cycles...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}></th>
                <th>Review Cycle</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Reviews</th>
                <th>Avg Rating</th>
                <th>Description</th>
                {isAdmin&& <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {cycles.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No review cycles found
                  </td>
                </tr>
              ) : (
                cycles.map((cycle) => {
                  const cycleReviews = getCycleReviews(cycle.id);
                  const avgRating = getAverageRating(cycle.id);
                  const isExpanded = expandedCycles[cycle.id];
                  return (
                    <React.Fragment key={cycle.id}>
                      <tr>
                        <td style={{ textAlign: "center", cursor: "pointer" }}>
                          <button onClick={() => toggleCycleExpand(cycle.id)} style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer", }} > {isExpanded ? "▼" : "▶"} </button>
                        </td>
                        <td className="name-cell">{cycle.cycle_name}</td>
                        <td>{cycle.start_date}</td>
                        <td>{cycle.end_date}</td>
                        <td>
                          <span className={`badge badge-${cycle.status .toLowerCase() .replace(" ", "")}`} > {cycle.status} </span>
                        </td>
                        <td style={{ textAlign: "center" }}> {cycleReviews.length} </td>
                        <td style={{ textAlign: "center", color: getRatingColor(avgRating), fontWeight: "bold", }} > {avgRating > 0 ? `${avgRating}/5` : "N/A"} </td>
                        <td className="description">{cycle.description}</td>
                        {isAdmin&& <td className="actions-cell">
                          <button className="btn-sm btn-warning" onClick={() => handleEdit(cycle)} > Edit </button>
                          <button className="btn-sm btn-danger" onClick={() => handleDelete(cycle.id)} > Delete </button> </td>}
                      </tr>
                      {isExpanded && cycleReviews.length > 0 && (
                        <tr style={{ backgroundColor: "#f9fafb" }}>
                          <td colSpan="9" style={{ padding: "20px" }}>
                            <div style={{ marginLeft: "20px" }}>
                              <h3 style={{marginTop: 0, marginBottom: "15px", color: "#333", }} > Reviews in this Cycle ({cycleReviews.length}) </h3>
                              <table style={{ width: "100%", borderCollapse: "collapse", }} >
                                <thead>
                                  <tr style={{ backgroundColor: "#e5e7eb", borderBottom: "1px solid #d1d5db", }} >
                                    <th style={{ padding: "10px", textAlign: "left", fontSize: "14px", }} > Employee </th>
                                    <th style={{ padding: "10px", textAlign: "left", fontSize: "14px", }} >  Reviewer </th>
                                    <th style={{ padding: "10px", textAlign: "left", fontSize: "14px", }} > Rating </th>
                                    <th style={{ padding: "10px", textAlign: "left", fontSize: "14px", }} > Comments </th>
                                    <th style={{ padding: "10px", textAlign: "left", fontSize: "14px", }} > Status </th>
                                    <th style={{ padding: "10px", textAlign: "left", fontSize: "14px", }} >  Date </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cycleReviews.map((review) => (
                                    <tr key={review.id} style={{ borderBottom: "1px solid #e5e7eb", }} >
                                      <td style={{ padding: "10px", fontSize: "14px", }} >  {review.emp_name} </td>
                                      <td style={{ padding: "10px", fontSize: "14px", }} > {review.reviewer_name} </td>
                                      <td style={{ padding: "10px", fontSize: "14px", color: getRatingColor(review.rating), fontWeight: "bold", }} > {"⭐".repeat(Math.floor(review.rating))}{" "} {review.rating}/5 </td>
                                      <td style={{ padding: "10px", fontSize: "14px", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", }} > {review.comments} </td>
                                      <td style={{ padding: "10px", fontSize: "14px", }} > 
                                      <span className={`badge badge-${review.status.toLowerCase()}`} > {review.status} </span> 
                                      </td>
                                      <td style={{ padding: "10px", fontSize: "14px", }} > {review.created_date} </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                      {isExpanded && cycleReviews.length === 0 && (
                        <tr style={{ backgroundColor: "#f9fafb" }}>
                          <td colSpan="9" style={{ padding: "15px", textAlign: "center", color: "#666", }} >  No reviews for this cycle yet </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewCyclesTable;
