// src/services/apiService.js

const BASE_URL = 'http://localhost:8080'; // your Spring Boot backend base URL

class ApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  
  async register(user) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(user),
    });
    return this.handleResponse(res);
  }


  // ✅ Helper method for handling responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'API request failed');
    }
    return await response.json();
  }

  // ✅ EMPLOYEE OPERATIONS
  async getEmployees() {
    const res = await fetch(`${BASE_URL}/fetchall`);
    return res.json();
  }

  async getEmployeeById(id) {
    const res = await fetch(`${BASE_URL}/employees/${id}`);
    return this.handleResponse(res);
  }

  async createEmployee(employee) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(employee),
    });
    return this.handleResponse(res);
  }

  async updateEmployee(id, employee) {
    console.log("updateEmployee called with id:", id);
    console.log("Received employee object:", employee);
    const res = await fetch(`${BASE_URL}/empupdate/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(employee),
    });
    // return res.json();
    return this.handleResponse(res);
  }

  async deleteEmployee(id) {
    const res = await fetch(`${BASE_URL}/delete?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }

  // ✅ GOAL OPERATIONS
  async getGoals() {
    const res = await fetch(`${BASE_URL}/goalfetchall`);
    return res.json();
  }

  async getGoalsByEmployee(employeeId) {
    const res = await fetch(`${BASE_URL}/goals/employee/${employeeId}`);
    return this.handleResponse(res);
  }

  async createGoal(goal) {
    const res = await fetch(`${BASE_URL}/savegoals`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(goal),
    });
    return this.handleResponse(res);
  }

  async updateGoal(id, goal) {
    const res = await fetch(`${BASE_URL}/goalsUpdate/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(goal),
    });
    return this.handleResponse(res);
  }


  async deleteGoal(id) {
    const res = await fetch(`${BASE_URL}/idremove?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }

  // ✅ REVIEW CYCLE OPERATIONS
  async getReviewCycles() {
    const res = await fetch(`${BASE_URL}/cyclesfetchall`);
    return res.json();
  }

  async createReviewCycle(cycle) {
    const res = await fetch(`${BASE_URL}/CyclesSave`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(cycle),
    });
    return this.handleResponse(res);
  }

  async updateReviewCycle(id, cycle) {
    const res = await fetch(`${BASE_URL}/updateCycles/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(cycle),
    });
    return this.handleResponse(res);
  }

  async deleteReviewCycle(id) {
    const res = await fetch(`${BASE_URL}/CyclesDelete?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }


  // ✅ REVIEW OPERATIONS
      // const res = await fetch(`${BASE_URL}/reviewsfetchByUserId?emp_id=${userId}`);

  async getReviews() {
    const res = await fetch(`${BASE_URL}/reviewsfetchall`);
    return res.json();
  }

  async getReviewsByEmployee(employeeId) {
    const res = await fetch(`${BASE_URL}/reviews/employee/${employeeId}`);
    return this.handleResponse(res);
  }

  async createReview(review) {
    const res = await fetch(`${BASE_URL}/saveReviews`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(review),
    });
    return this.handleResponse(res);
  }

  async updateReview(id, review) {
    const res = await fetch(`${BASE_URL}/updateReviews/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(review),
    });
    return this.handleResponse(res);
  }

  async deleteReview(id) {
    const res = await fetch(`${BASE_URL}/deleteReviews?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }

  // ✅ AUTHENTICATION
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/emplogin?email=${email}&password=${password}`);
    const data = await res.json();
    if (data.data) {
      localStorage.setItem('currentUser', JSON.stringify(data.data));
    }
    return data;
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    return { success: true, message: 'Logged out successfully' };
  }

  async getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      return { success: true, data: JSON.parse(userStr) };
    }
    return { success: false, data: null };
  }
}

export default new ApiService();
