# Review System Documentation

## Overview
The Review System manages employee performance reviews organized by review cycles. It demonstrates a **one-to-many relationship** between review cycles and individual employee reviews.

---

## Data Structure

### 1. Review Cycles
A **Review Cycle** is a time period during which performance reviews are conducted.

**Table Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Unique cycle identifier |
| cycle_name | String | Name of the review cycle (e.g., "Q1 2025 Performance Review") |
| start_date | Date | Review period start date (YYYY-MM-DD) |
| end_date | Date | Review period end date (YYYY-MM-DD) |
| status | String | Status: `planned`, `in progress`, `completed` |
| description | String | Details about the review cycle |

**Example:**
```json
{
  "id": 1,
  "cycle_name": "Q1 2025 Performance Review",
  "start_date": "2025-01-01",
  "end_date": "2025-03-31",
  "status": "completed",
  "description": "First quarter performance evaluation for all employees"
}
```

---

### 2. Reviews
A **Review** is an individual performance evaluation for an employee within a specific review cycle.

**Table Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Unique review identifier |
| review_cycle_id | Integer | FK to review cycle (defines which cycle this review belongs to) |
| emp_id | Integer | FK to employee (which employee is being reviewed) |
| emp_name | String | Employee's full name (denormalized for display) |
| reviewer_id | Integer | FK to employee who conducted the review (manager) |
| reviewer_name | String | Reviewer's full name |
| rating | Decimal | Performance rating (0-5 scale, supports 0.5 increments) |
| comments | String | Detailed feedback and comments |
| status | String | Status: `draft`, `submitted`, `completed` |
| created_date | Date | Date review was created/last modified |

**Example:**
```json
{
  "id": 1,
  "review_cycle_id": 1,
  "emp_id": 1,
  "emp_name": "Vinod Kumar",
  "reviewer_id": 5,
  "reviewer_name": "Prasad Manager",
  "rating": 4.5,
  "comments": "Excellent performance in Q1...",
  "status": "completed",
  "created_date": "2025-03-28"
}
```

---

## Data Relationships

### Relationship Diagram
```
Review Cycles (1) ──── (Many) Reviews
       ↓
       └────→ Employee Reviews for that cycle

Employees (1) ──── (Many) Reviews
       ↓
       └────→ All reviews for that employee

Review Cycles + Employee IDs = Filtered Reviews
```

### How to Query
- **Get all reviews for a cycle:** Filter reviews where `review_cycle_id = X`
- **Get all reviews for an employee:** Filter reviews where `emp_id = X`
- **Get all reviews in a cycle for an employee:** Filter where `review_cycle_id = X AND emp_id = Y`
- **Get average rating for employee:** Calculate avg of `rating` where `emp_id = X`

---

## UI Components

### 1. Review Cycles Table (`ReviewCyclesTable.js`)
**Purpose:** Display all review cycles

**Features:**
- List all review cycles with dates and status
- Color-coded status badges (planned, in progress, completed)
- Add/Edit/Delete review cycles
- Modal dialog for form input
- Date validation (start date < end date)

**Columns:**
- Cycle Name
- Start Date
- End Date
- Status (Badge)
- Description
- Actions (Edit, Delete)

---

### 2. Reviews Table (`ReviewsTable.js`)
**Purpose:** Display individual performance reviews with filters

**Features:**
- List all reviews with employee, reviewer, cycle, rating, and comments
- Filter by:
  - Employee dropdown (linked to employee database)
  - Review Cycle dropdown (linked to review cycles)
- Add/Edit/Delete reviews
- Star rating display (e.g., ⭐⭐⭐⭐ 4.5/5)
- Color-coded ratings:
  - **Green** (4.5+): Excellent
  - **Orange** (3.5-4.4): Good
  - **Red** (<3.5): Needs Improvement
- Modal dialog for form input
- Status badges

**Columns:**
- Employee Name
- Reviewer Name
- Review Cycle
- Rating (with stars)
- Comments
- Status (Badge: draft, submitted, completed)
- Created Date
- Actions (Edit, Delete)

---

## Data Flow

### Adding a Review
1. User clicks "+ Add Review"
2. Modal opens with form
3. User selects:
   - Employee (dropdown from employees table)
   - Review Cycle (dropdown from review cycles)
   - Rating (0-5 slider)
   - Comments (textarea)
   - Status (draft/submitted/completed)
4. Form validates all required fields
5. Data sent to backend API
6. Table refreshes with new review

### Editing a Review
1. User clicks "Edit" on a review
2. Modal opens with existing data pre-filled
3. User modifies fields
4. Form validates
5. Data updated in backend
6. Table refreshes

### Deleting a Review
1. User clicks "Delete" on a review
2. Confirmation modal appears
3. On confirm:
   - Review deleted from database
   - Success alert shown
   - Table refreshes
4. On cancel: Modal closes, no changes

---

## Dummy Data Provided

### Review Cycles (5 cycles)
1. **Q1 2025** - Completed (Jan-Mar)
2. **Q2 2025** - In Progress (Apr-Jun)
3. **Q3 2025** - Planned (Jul-Sep)
4. **Annual 2025** - In Progress (Full year)
5. **Mid-Year Check-in** - Planned (Jun-Jul)

### Reviews (10 reviews)
- **Vinod Kumar**: 3 reviews (Q1: 4.5, Q2: 4.2, Annual: 4.3)
- **Priya Singh**: 2 reviews (Q1: 3.8, Q2: 4.0)
- **Amit Patel**: 2 reviews (Q1: 3.5, Q2: 3.8 - draft)
- **Neha Desai**: 2 reviews (Q1: 4.7, Q2: 4.8)
- **Prasad Manager**: 1 review (Q2: 4.3)

---

## Best Practices for Displaying Data

### 1. Show Reviews by Cycle
Create a view that shows:
- Cycle name and period
- Number of reviews for that cycle
- Average rating across reviews
- List of reviews with employees and ratings

### 2. Show Reviews by Employee
Create a view that shows:
- Employee name
- All reviews across all cycles
- Trend over time (improving/declining)
- Latest review details

### 3. Dashboard Analytics
Consider adding:
- Average rating by department
- Review completion percentage
- Ratings distribution (pie chart: excellent/good/needs improvement)
- Recent reviews list

### 4. Filtering Strategy
Current implementation supports:
- ✅ Filter by employee
- ✅ Filter by review cycle
- 📝 Future: Add combined filters and date range filters

---

## API Endpoints Needed

```bash
# Review Cycles
GET    /api/review-cycles              # Get all cycles
POST   /api/review-cycles              # Create cycle
PUT    /api/review-cycles/:id          # Update cycle
DELETE /api/review-cycles/:id          # Delete cycle

# Reviews
GET    /api/reviews                    # Get all reviews
POST   /api/reviews                    # Create review
PUT    /api/reviews/:id                # Update review
DELETE /api/reviews/:id                # Delete review
GET    /api/reviews?cycle_id=X         # Filter by cycle
GET    /api/reviews?emp_id=X           # Filter by employee
GET    /api/reviews?review_cycle_id=X&emp_id=Y  # Filter by both
```

---

## Status Codes

### Review Cycle Status
- **planned**: Cycle hasn't started yet
- **in progress**: Cycle is currently active
- **completed**: Cycle is closed and all reviews are finalized

### Review Status
- **draft**: Review is being written, not yet submitted
- **submitted**: Review has been submitted by reviewer
- **completed**: Review has been reviewed and finalized

---

## Rating Scale

| Rating | Label | Color | Meaning |
|--------|-------|-------|---------|
| 4.5-5.0 | Excellent | 🟢 Green | Exceeds expectations |
| 3.5-4.4 | Good | 🟠 Orange | Meets/exceeds most expectations |
| 2.5-3.4 | Satisfactory | 🔴 Red | Meets some expectations |
| <2.5 | Needs Improvement | 🔴 Red | Below expectations |

---

## Usage Example

```javascript
// In your component
const [selectedCycle, setSelectedCycle] = useState(null);
const [selectedEmployee, setSelectedEmployee] = useState(null);

// Filter reviews
const filteredReviews = reviews.filter(review => {
  const cycleMatch = !selectedCycle || review.review_cycle_id === selectedCycle;
  const empMatch = !selectedEmployee || review.emp_id === selectedEmployee;
  return cycleMatch && empMatch;
});
```

---

## Files Location
- Review Cycles Component: `src/components/pages/ReviewCyclesTable.js`
- Reviews Component: `src/components/pages/ReviewsTable.js`
- Dummy Data - Cycles: `src/data/reviewCycles.json`
- Dummy Data - Reviews: `src/data/reviews.json`
