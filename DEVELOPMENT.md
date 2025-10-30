# Development Guide - EPMS

## Quick Start for Developers

### Installation & Setup

```bash
# Navigate to project directory
cd c:\Users\Srikanth\employee

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

The app will automatically open at `http://localhost:3000`

---

## Project Architecture

### Component Hierarchy

```
App.js (Main)
├── Login.js
│   └── Login.css
└── MainLayout.js
    ├── Header.js
    │   └── Header.css
    ├── Sidebar.js
    │   └── Sidebar.css
    └── Current Page Component
        ├── EmployeeTable.js
        ├── GoalsTable.js
        ├── ReviewCyclesTable.js
        ├── ReviewsTable.js
        └── Profile.js
            └── /styles/
                ├── Table.css
                └── Profile.css
```

### Data Flow

```
User Input
    ↓
Component State (useState)
    ↓
API Service Call (ApiService.js)
    ↓
Promise Resolution
    ↓
State Update
    ↓
Re-render
    ↓
User Sees Result
```

---

## Core Files & Their Purposes

### App.js
**Purpose**: Main application component with routing logic

**Key Functions**:
- `handleLogin(userData)` - Store user session
- `handleLogout()` - Clear user session
- Conditional rendering based on login state

**Key State**:
- `isLoggedIn` - Authentication status
- `currentUser` - User object

### Login.js
**Purpose**: Authentication interface

**Key Functions**:
- `handleSubmit(e)` - Validate credentials
- `handleDemoLogin(demoUser)` - Quick demo access
- Calls `ApiService.login()`

**Features**:
- Form validation
- Error handling
- Loading state management
- Demo buttons

### MainLayout.js
**Purpose**: Layout wrapper for authenticated area

**Key Functions**:
- `renderPage()` - Conditional rendering based on current page
- Page switching logic

**Key State**:
- `currentPage` - Which module is active
- `sidebarOpen` - Sidebar visibility

### Header.js
**Purpose**: Top navigation bar

**Props**:
- `currentUser` - User information to display
- `onLogout()` - Logout callback
- `onMenuClick()` - Sidebar toggle
- `sidebarOpen` - Current sidebar state

### Sidebar.js
**Purpose**: Side navigation menu

**Props**:
- `currentPage` - Active page indicator
- `onPageChange(pageId)` - Navigation callback
- `isOpen` - Show/hide sidebar

**Menu Items**:
```javascript
[
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
  { id: 'reviewcycles', label: 'Review Cycles', icon: '📋' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
  { id: 'profile', label: 'My Profile', icon: '👤' }
]
```

### EmployeeTable.js
**Purpose**: Employee CRUD operations

**Key State**:
```javascript
employees        // All employee records
loading          // Loading state
error            // Error message
showForm         // Form visibility
editingId        // Currently editing employee ID
formData         // Form input values
```

**Key Functions**:
- `loadEmployees()` - Fetch from API
- `handleSubmit(e)` - Create/Update employee
- `handleEdit(employee)` - Populate form for editing
- `handleDelete(id)` - Remove employee with confirmation

**Form Fields**:
- name, email, department, position, joinDate, salary

### GoalsTable.js
**Purpose**: Goal management

**Key State**:
```javascript
goals            // All goals
formData         // Form with progress slider
editingId        // Current edit target
```

**Key Functions**:
- `loadGoals()` - Fetch goals
- `handleSubmit(e)` - Create/Update goal
- `getProgressColor(progress)` - Color logic for progress bar

**Special Features**:
- Progress slider (0-100%)
- Status dropdown
- Color-coded progress bars

### ReviewCyclesTable.js
**Purpose**: Review cycle management

**Key Validation**:
- Start date must be before end date
- All date fields required

**Features**:
- Date validation
- Status tracking
- Cycle description

### ReviewsTable.js
**Purpose**: Performance review management

**Key Features**:
- Employee dropdown selector
- Rating slider (0-5 stars)
- Feedback text area
- Status tracking (Draft/Submitted)
- Dynamic employee list population

**Special Logic**:
- When employee changes, automatically update `employeeName`
- 5-star rating visualization

### Profile.js
**Purpose**: User profile and statistics page

**Key State**:
```javascript
userGoals        // Goals assigned to logged-in user
userReviews      // Reviews for logged-in user
loading          // Data loading state
```

**Key Functions**:
- `getAverageRating()` - Calculate average rating
- `getCompletedGoalsCount()` - Count completed goals
- `getInProgressGoalsCount()` - Count in-progress goals

**Displays**:
- User information card
- 4 statistics cards
- Goals grid
- Reviews list

### ApiService.js
**Purpose**: Mock API service for all data operations

**Structure**:
- Each operation returns a Promise
- Artificial delay (300ms) simulates network
- Dummy data included
- All methods have success/error handling

**Method Categories**:
1. Employee operations (5 methods)
2. Goal operations (5 methods)
3. Review cycle operations (3 methods)
4. Review operations (5 methods)
5. Auth operations (3 methods)

**Example Pattern**:
```javascript
getEmployees() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: [...] });
    }, this.baseDelay);
  });
}
```

---

## CSS Architecture

### CSS File Organization

**App.css** - Global styles
- Color variables (gradients)
- Utility classes (.btn-*, .text-*, spacing)
- Alert styles
- Button variants

**Component CSS Files** - Component-specific styles
- Login.css - Authentication forms
- Header.css - Navigation bar
- Sidebar.css - Side menu
- MainLayout.css - Layout structure
- Table.css - Data tables and forms
- Profile.css - Profile page styles

### Color Palette

```css
Primary Gradient: #667eea → #764ba2 (Purple)
Success: #48bb78 (Green)
Danger: #f56565 (Red)
Warning: #ed8936 (Orange)
Info: #3182ce (Blue)
Background: #f5f5f5 (Light Gray)
Border: #e0e0e0 (Gray)
Text: #333 (Dark Gray)
```

### Class Naming Convention

**Utilities**:
```css
.btn-primary     /* Primary button */
.btn-success     /* Success button */
.btn-danger      /* Danger button */
.btn-sm          /* Small button */
.mt-2            /* Margin top */
.mb-3            /* Margin bottom */
.p-2             /* Padding */
.text-center     /* Text center */
```

**Component Specific**:
```css
.login-container
.login-box
.form-group
.data-table
.badge
.progress-bar
```

### Responsive Breakpoint

```css
@media (max-width: 768px) {
  /* Mobile/tablet adjustments */
  .sidebar { width: 0; }  /* Hide sidebar */
  .form-row { grid-template-columns: 1fr; }  /* Single column forms */
  /* Adjusted font sizes and spacing */
}
```

---

## State Management Pattern

### Example Component Pattern

```javascript
import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

const ComponentName = () => {
  // State declarations
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    field1: '',
    field2: ''
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Async data loading
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getMethod();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.createMethod(formData);
      setSuccess('Created successfully');
      loadData(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      {error && <div className="alert alert-error">{error}</div>}
      {/* Form and table components */}
    </div>
  );
};

export default ComponentName;
```

---

## Adding a New Page/Module

### Step 1: Create Component File
Create `src/components/pages/NewModule.js`

```javascript
import { useState, useEffect } from 'react';
import '../styles/Table.css';
import ApiService from '../../services/ApiService';

const NewModule = () => {
  // Component code
  return (
    <div className="page-container">
      {/* Content */}
    </div>
  );
};

export default NewModule;
```

### Step 2: Add API Methods
In `ApiService.js`, add:

```javascript
getNewData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: [...] });
    }, this.baseDelay);
  });
}

createNewData(data) {
  // Implementation
}

updateNewData(id, data) {
  // Implementation
}

deleteNewData(id) {
  // Implementation
}
```

### Step 3: Import in MainLayout.js

```javascript
import NewModule from './pages/NewModule';

// In renderPage():
case 'newmodule':
  return <NewModule />;
```

### Step 4: Add to Sidebar
In `Sidebar.js`, add to `menuItems`:

```javascript
{ id: 'newmodule', label: 'New Module', icon: '📌' }
```

---

## Styling a New Component

### Step 1: Create CSS File
Create `src/components/styles/NewModule.css`

### Step 2: Follow Naming Convention

```css
.newmodule-container { /* Main container */ }
.newmodule-header { /* Header area */ }
.newmodule-content { /* Content area */ }
.newmodule-item { /* Individual items */ }
```

### Step 3: Use Utility Classes
Leverage existing utilities from `App.css`:

```jsx
<button className="btn-primary mt-2 mb-3">Action</button>
<div className="p-2 text-center">Content</div>
```

### Step 4: Import in Component

```javascript
import '../styles/NewModule.css';
```

---

## Common Tasks

### Add Form Validation

```javascript
const validateForm = () => {
  if (!formData.name) {
    setError('Name is required');
    return false;
  }
  if (!formData.email || !formData.email.includes('@')) {
    setError('Valid email is required');
    return false;
  }
  return true;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Continue with submission
};
```

### Show Loading States

```javascript
<button className="btn-primary" disabled={loading}>
  {loading ? 'Processing...' : 'Submit'}
</button>
```

### Add Confirmation Dialog

```javascript
const handleDelete = async (id) => {
  if (!window.confirm('Delete this item?')) return;
  // Proceed with deletion
};
```

### Create Color-Coded Status Display

```javascript
const getStatusColor = (status) => {
  const colors = {
    'active': '#48bb78',
    'inactive': '#f56565',
    'pending': '#ed8936'
  };
  return colors[status] || '#999';
};

<span style={{ color: getStatusColor(item.status) }}>
  {item.status}
</span>
```

---

## API Service Integration Pattern

### Current (Mock)
```javascript
const response = await ApiService.getEmployees();
// Always returns predefined data
```

### For Real Backend
Replace ApiService methods with actual fetch calls:

```javascript
async getEmployees() {
  try {
    const response = await fetch('/api/employees', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
```

---

## Performance Optimization Tips

1. **Pagination**: Add pagination for large datasets
   ```javascript
   const [page, setPage] = useState(1);
   const pageSize = 10;
   const paginatedData = data.slice((page-1)*pageSize, page*pageSize);
   ```

2. **Memoization**: Use useCallback for expensive functions
   ```javascript
   const handleSubmit = useCallback(async (e) => { /* ... */ }, []);
   ```

3. **Lazy Loading**: Load data only when needed
   ```javascript
   const [expanded, setExpanded] = useState({});
   ```

4. **Code Splitting**: Load components on demand (future enhancement)

---

## Browser DevTools Tips

### Console
- Check for JavaScript errors
- Log data with `console.log()`
- Monitor API calls

### Network
- View API delays
- Check response payloads
- Monitor file sizes

### Storage
- View localStorage data (session info)
- Debug state persistence

### React DevTools
- Inspect component hierarchy
- Track state changes
- Profile performance

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Login with demo account
- [ ] Navigate all pages
- [ ] Test form validation
- [ ] Test CRUD operations (Create, Read, Update, Delete)
- [ ] Test error scenarios
- [ ] Test on mobile browser
- [ ] Test sidebar toggle
- [ ] Test logout

### Test Data
- Check that dummy data loads
- Verify calculations (avg rating, goal counts)
- Test with empty states

---

## Deployment Checklist

Before deploying to production:

- [ ] Update `ApiService.js` to use real API endpoints
- [ ] Implement proper authentication
- [ ] Remove demo login buttons
- [ ] Add environment variables
- [ ] Test with production API
- [ ] Set up HTTPS
- [ ] Optimize bundle size
- [ ] Add error tracking (Sentry, etc.)
- [ ] Set up monitoring
- [ ] Create backup strategy
- [ ] Document API endpoints
- [ ] Set up CI/CD pipeline

---

## Troubleshooting Development Issues

### Hot Module Replacement (HMR) Not Working
```bash
# Restart dev server
npm start
```

### CSS Not Updating
- Hard refresh: `Ctrl+Shift+R`
- Clear cache
- Check CSS import path

### State Not Updating
- Check dependency arrays in useEffect
- Ensure setState is called, not direct state modification
- Check for closure issues in async code

### Form Data Not Binding
```javascript
// ✅ Correct
const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

// ❌ Wrong
formData.name = value; // Direct mutation
```

---

## Best Practices

### Code Style
- Use consistent indentation (2 spaces)
- Use camelCase for variables and functions
- Use PascalCase for components
- Use UPPERCASE for constants

### Component Structure
- One component per file
- Keep components focused and small
- Extract reusable logic to hooks
- Use proper prop validation

### State Management
- Keep state as close to where it's used
- Lift state only when necessary
- Use useState for simple state
- Consider useReducer for complex state

### Error Handling
- Always show user-friendly error messages
- Log errors to console in development
- Validate input before processing
- Handle edge cases

---

## Resources

- React Documentation: https://react.dev
- JavaScript ES6+: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- CSS Guide: https://developer.mozilla.org/en-US/docs/Web/CSS

---

**Last Updated**: 2024
**Version**: 1.0.0