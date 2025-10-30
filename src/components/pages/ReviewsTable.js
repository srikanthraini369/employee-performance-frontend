import { useState, useEffect } from "react";
import "../styles/Table.css";
import reviewsData from "../../data/reviews.json";
import reviewCyclesData from "../../data/reviewCycles.json";
import ApiService from "../../services/ApiService";

const ReviewsTable = () => {
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;

  console.log(user); // shows the actual object
  console.log(user?.first_name); // safely logs the first name (or undefined if null)

  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterCycleId, setFilterCycleId] = useState("");
  const [filterEmpId, setFilterEmpId] = useState("");
  const [filterReviewerId, setFilterReviewerId] = useState("");
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_name: "",
    reviewer_id: user?.id || "",
    reviewer_name: user?.first_name || "",
    review_cycle_id: "",
    cycle_name: "",
    rating: 4,
    comments: "",
    status: "draft",
    created_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getReviews();
      setReviews(response.data);
      // setReviews(reviewsData);
      const res = await ApiService.getReviewCycles();
      setCycles(res.data);
      // setCycles(reviewCyclesData);

      const resp = await ApiService.getEmployees();
      setEmployees(resp.data);

      // const dummyEmployees = [
      //   { id: 1, first_name: 'Vinod', last_name: 'Kumar' },
      //   { id: 2, first_name: 'Priya', last_name: 'Singh' },
      //   { id: 3, first_name: 'Amit', last_name: 'Patel' },
      //   { id: 4, first_name: 'Neha', last_name: 'Desai' },
      //   { id: 5, first_name: 'Prasad', last_name: 'Manager' },
      //   { id: 6, first_name: 'HR', last_name: 'Admin' }
      // ];
      // setEmployees(dummyEmployees);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "emp_id") {
      const employee = employees.find((emp) => emp.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        emp_id: value,
        emp_name: employee?.first_name + " " + employee?.last_name || "",
      }));
    } else if (name === "review_cycle_id") {
      const cycle = cycles.find((c) => c.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        review_cycle_id: value,
        cycle_name: cycle?.cycle_name || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.emp_id || !formData.review_cycle_id || !formData.comments) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await ApiService.updateReview(editingId, formData);
        setSuccess("Review updated successfully");
      } else {
        await ApiService.createReview(formData);
        setSuccess("Review created successfully");
      }

      resetForm();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const handleEdit = (review) => {
    setFormData({
      emp_id: review.emp_id,
      emp_name: review.emp_name,
      reviewer_id: review.reviewer_id,
      reviewer_name: review.reviewer_name,
      review_cycle_id: review.review_cycle_id,
      cycle_name: review.cycle_name,
      rating: review.rating,
      comments: review.comments,
      status: review.status,
      created_date: review.created_date,
    });
    setEditingId(review.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await ApiService.deleteReview(deleteId);
      setSuccess("Review deleted successfully");
      setShowDeleteConfirm(false);
      setDeleteId(null);
      // loadReviews();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
      alert("Review deleted successfully!");
    } catch (err) {
      setError(err.message || "Delete failed");
      setShowDeleteConfirm(false);
      setDeleteId(null);
      alert("Failed to delete review: " + (err.message || "Delete failed"));
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
      emp_id: "",
      emp_name: "",
      reviewer_id: user?.id || "",
      reviewer_name: user?.first_name || "",
      review_cycle_id: "",
      cycle_name: "",
      rating: 4,
      comments: "",
      status: "draft",
      created_date: new Date().toISOString().split("T")[0],
    });
    setError("");
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#48bb78";
    if (rating >= 3.5) return "#ed8936";
    return "#f56565";
  };

  const getFilteredReviews = () => {
    return reviews.filter((review) => {
      const cycleMatch =
        !filterCycleId || review.review_cycle_id === parseInt(filterCycleId);
      const empMatch = !filterEmpId || review.emp_id === parseInt(filterEmpId);
      const reviewerMatch =
        !filterReviewerId || review.reviewer_id === parseInt(filterReviewerId);

      return cycleMatch && empMatch && reviewerMatch;
    });
  };

  const getCycleName = (cycleId) => {
    const cycle = cycles.find((c) => c.id === cycleId);
    return cycle?.cycle_name || "Unknown";
  };

  const getCycleReviewCount = (cycleId) => {
    return reviews.filter((r) => r.review_cycle_id === cycleId).length;
  };

  const getEmployeeReviewCount = (empId) => {
    return reviews.filter((r) => r.emp_id === empId).length;
  };

  const getReviewerReviewCount = (reviewerId) => {
    return reviews.filter((r) => r.reviewer_id === reviewerId).length;
  };

  useEffect(() => {
    console.log(formData, "formData");
    console.log(user, "formData1");
  }, [formData, user]);
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Performance Reviews</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          {" "}
          + Add Review{" "}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {" "}
          <span>{error}</span>{" "}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {" "}
          <span>{success}</span>{" "}
        </div>
      )}

      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#333" }}>
          {" "}
          Filter Reviews by Relationship{" "}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              {" "}
              Filter by Review Cycle{" "}
            </label>
            <select
              value={filterCycleId}
              onChange={(e) => setFilterCycleId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            >
              <option value="">All Cycles</option>
              {cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.cycle_name} ({getCycleReviewCount(cycle.id)} reviews){" "}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Filter by Employee
            </label>
            <select
              value={filterEmpId}
              onChange={(e) => setFilterEmpId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} (
                  {getEmployeeReviewCount(emp.id)} reviews)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Filter by Reviewer
            </label>
            <select
              value={filterReviewerId}
              onChange={(e) => setFilterReviewerId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            >
              <option value="">All Reviewers</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} (
                  {getReviewerReviewCount(emp.id)} reviews )
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-container">
              <div className="form-header">
                <h2>{editingId ? "Edit Review" : "Add New Review"}</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee *</label>
                    <select name="emp_id" value={formData.emp_id}  onChange={handleInputChange} required >
                      <option value="">Select Employee</option> {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}> {emp.first_name} {emp.last_name} </option> ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Review Cycle *</label>
                    <select  name="review_cycle_id" value={formData.review_cycle_id} onChange={handleInputChange} required >
                      <option value="">Select Review Cycle</option> {cycles.map((cycle) => (
                      <option key={cycle.id} value={cycle.id}> {cycle.cycle_name} </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-input">
                      <input type="range" name="rating" min="0" max="5" step="0.5" value={formData.rating} onChange={handleInputChange} />
                      <span>{formData.rating} / 5</span>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Comments *</label>
                    <textarea name="comments" value={formData.comments} onChange={handleInputChange} placeholder="Write your review comments" rows="4" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status *</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} required >
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-success">  {editingId ? "Update" : "Create"} </button>
                  <button type="button" className="btn-secondary" onClick={resetForm} > Cancel </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirmation">
              <div className="delete-icon">⚠️</div>
              <h2>Delete Review</h2>
              <p>  Are you sure you want to delete this review? This action cannot be undone. </p>
              <div className="modal-actions">
                <button className="btn-danger" onClick={confirmDelete}> Yes, Delete </button>
                <button className="btn-secondary" onClick={cancelDelete}>   Cancel </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader">Loading reviews...</div>
      ) : (
        <>
          <div
            style={{backgroundColor: "#e0f2fe", padding: "12px",  borderRadius: "6px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center",  }} >
            <div>
              <strong>Filtered Results:</strong> {getFilteredReviews().length}{" "}
              review(s)
              {filterCycleId &&
                ` in "${getCycleName(parseInt(filterCycleId))}" cycle`}
              {filterEmpId && filterCycleId && ` for`}
              {filterEmpId &&   ` ${ employees.find((e) => e.id === parseInt(filterEmpId)) ?.first_name } ${ employees.find((e) => e.id === parseInt(filterEmpId)) ?.last_name  }`}
            </div>
            {getFilteredReviews().length > 0 && (
              <div style={{ textAlign: "right" }}>
                <strong>Average Rating:</strong>
                <span style={{  marginLeft: "8px", color: getRatingColor( getFilteredReviews().reduce( (sum, r) => sum + r.rating,  0 ) / getFilteredReviews().length ), fontWeight: "bold", fontSize: "16px", }} >
                  {( getFilteredReviews().reduce((sum, r) => sum + r.rating, 0) /  getFilteredReviews().length ).toFixed(1)} /5 </span>
              </div>
            )}
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Reviewer</th>
                  <th>Cycle</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredReviews().length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      {reviews.length === 0
                        ? "No reviews found"
                        : "No reviews match the selected filters"}
                    </td>
                  </tr>
                ) : (
                  getFilteredReviews().map((review) => (
                    <tr key={review.id}>
                      <td>{review.id}</td>
                      <td className="name-cell">{review.emp_name}</td>
                      <td>{review.reviewer_name}</td>
                      <td>{review.review_cycle_id}</td>
                      <td>
                        <div
                          className="rating-display"
                          style={{ color: getRatingColor(review.rating) }}
                        >
                          {"⭐".repeat(Math.floor(review.rating))}{" "}
                          {review.rating}/5
                        </div>
                      </td>
                      <td className="description">{review.comments}</td>
                      <td>
                        <span className={`badge badge-${review.status}`}>
                          {review.status}
                        </span>
                      </td>
                      <td>{review.created_date}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-sm btn-danger"
                          onClick={() => handleDelete(review.id)}
                        >
                          Delete
                        </button>
                        {review.reviewer_id === user?.id && (
                          <button
                            className="btn-sm btn-warning"
                            onClick={() => handleEdit(review)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsTable;
