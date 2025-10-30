# Employee Performance Management System (EPMS)

A complete React-based Employee Performance Management System built with vanilla CSS and without any third-party UI libraries.

## Features Implemented

### 1. **Authentication & Security**
   - Login page with username/password authentication
   - Demo accounts for testing (admin/user)
   - Session management with localStorage
   - Logout functionality

### 2. **Main Dashboard**
   - Professional header with user profile display
   - Collapsible sidebar for navigation
   - Content area with page transitions
   - Responsive design for mobile and desktop

### 3. **Core Modules**

#### **Employee Management**
   - View all employees in a data table
   - Create new employees
   - Edit employee details
   - Delete employees
   - Track: Name, Email, Department, Position, Join Date, Salary, Status

#### **Goals Management**
   - Assign goals to employees
   - Track goal progress with visual progress bars
   - Mark goals as: In Progress, Completed, On Hold, Cancelled
   - View goal descriptions and target dates
   - CRUD operations for goals

#### **Review Cycles**
   - Create performance review cycles
   - Set review cycle dates
   - Track cycle status
   - Manage multiple review cycles per year

#### **Performance Reviews**
   - Submit performance reviews for employees
   - Rate employees on a 5-star scale
   - Add detailed feedback comments
   - Track review status (Draft/Submitted)
   - View reviewer information

#### **User Profile**
   - View personal profile with role and department
   - Dashboard with performance statistics:
     - Total goals assigned
     - Completed goals count
     - In-progress goals count
     - Average rating from reviews
   - View all assigned goals
   - View all performance reviews received

### 4. **CRUD Operations**
   - **Create**: Add new employees, goals, review cycles, and reviews
   - **Read**: View all data in interactive tables
   - **Update**: Edit existing records inline
   - **Delete**: Remove records with confirmation

## Technical Stack

- **Frontend**: React 19
- **Styling**: Vanilla CSS only (no Bootstrap, Tailwind, Material-UI)
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Custom routing without React Router
- **API**: Mock API service with dummy data
- **Storage**: localStorage for session management

## Project Structure

```
employee/
├── src/
│   ├── services/
│   │   └── ApiService.js          # API mock service with CRUD operations
│   │
│   ├── components/
│   │   ├── Login.js               # Login page component
│   │   ├── Login.css              # Login styling
│   │   ├── Header.js              # Top navigation header
│   │   ├── Header.css             # Header styling
│   │   ├── Sidebar.js             # Side navigation menu
│   │   ├── Sidebar.css            # Sidebar styling
│   │   ├── MainLayout.js          # Main layout wrapper
│   │   ├── MainLayout.css         # Layout styling
│   │   │
│   │   ├── pages/
│   │   │   ├── EmployeeTable.js   # Employee management page
│   │   │   ├── GoalsTable.js      # Goals management page
│   │   │   ├── ReviewCyclesTable.js # Review cycles page
│   │   │   ├── ReviewsTable.js    # Performance reviews page
│   │   │   └── Profile.js         # User profile page
│   │   │
│   │   └── styles/
│   │       ├── Table.css          # Table and form styling
│   │       └── Profile.css        # Profile page styling
│   │
│   ├── App.js                     # Main app component with routing logic
│   ├── App.css                    # Global styles
│   └── index.js                   # React entry point
│
└── package.json                   # Dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - You'll see the login page

### Demo Login Credentials

- **Admin Account**: 
  - Username: `admin`
  - Password: `password` (any password works in demo)

- **User Account**:
  - Username: `user`
  - Password: `password` (any password works in demo)

## API Service

The `ApiService.js` provides mock implementations of:

- `getEmployees()` - Fetch all employees
- `createEmployee(data)` - Add new employee
- `updateEmployee(id, data)` - Edit employee
- `deleteEmployee(id)` - Remove employee
- `getGoals()` - Fetch all goals
- `createGoal(data)` - Add new goal
- `updateGoal(id, data)` - Edit goal
- `deleteGoal(id)` - Remove goal
- `getReviewCycles()` - Fetch all review cycles
- `createReviewCycle(data)` - Add review cycle
- `updateReviewCycle(id, data)` - Edit review cycle
- `deleteReviewCycle(id)` - Remove review cycle
- `getReviews()` - Fetch all reviews
- `createReview(data)` - Submit review
- `updateReview(id, data)` - Edit review
- `deleteReview(id)` - Remove review
- `login(username, password)` - Authenticate user
- `getCurrentUser()` - Get logged-in user

## Styling Highlights

### Design System
- **Color Scheme**: Professional purple gradient (#667eea to #764ba2)
- **Typography**: Segoe UI with responsive sizing
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle shadows for depth
- **Animations**: Smooth transitions and fade-ins
- **Responsive**: Mobile-first design with media queries

### Components Styled
- Login form with gradient background
- Data tables with hover effects
- Forms with validation styling
- Progress bars with color indicators
- Status badges with color coding
- Profile cards with statistics
- Responsive sidebar (collapses on mobile)
- Sticky table headers

## Key Recommendations & Features

### 1. **User Experience**
   - Clean, intuitive interface without bloated UI libraries
   - Smooth animations and transitions
   - Responsive design works on desktop, tablet, and mobile
   - Loading states and error handling

### 2. **Data Management**
   - Lightweight API service can be easily replaced with real backend
   - Simulated API delays for realistic behavior
   - Data validation in forms
   - Confirmation dialogs for destructive actions

### 3. **Performance**
   - No unnecessary re-renders with proper React hooks
   - CSS-based animations (GPU accelerated)
   - Lazy loading ready (can be added easily)
   - Optimized table rendering

### 4. **Accessibility**
   - Semantic HTML structure
   - Proper form labels and inputs
   - Color contrast compliance
   - Keyboard navigation support

### 5. **Scalability**
   - Easy to add new pages/modules
   - API service abstraction makes backend integration simple
   - Component-based architecture
   - No vendor lock-in

## Future Enhancement Suggestions

1. **Backend Integration**
   - Replace ApiService mock calls with actual API endpoints
   - Add JWT authentication
   - Database schema design

2. **Additional Features**
   - Export to PDF/Excel
   - Advanced filtering and search
   - Role-based access control (Admin, Manager, Employee)
   - Notifications and alerts
   - Email notifications
   - Department hierarchy
   - Team views
   - Performance analytics and charts
   - Goal templates
   - Review templates

3. **Performance**
   - Pagination for large datasets
   - Data caching
   - Code splitting
   - Image optimization

4. **Testing**
   - Unit tests with Jest
   - Integration tests
   - E2E tests with Cypress/Playwright

5. **DevOps**
   - Environment configuration
   - Build optimization
   - Deployment pipelines

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Notes

- The application uses localStorage for session management (not secure for production)
- API service returns mock data (not connected to real backend)
- All CRUD operations are simulated
- No authentication token system (just demo)

## Development Guidelines

### Adding a New Page
1. Create component in `src/components/pages/`
2. Import in `MainLayout.js`
3. Add to routing logic
4. Add sidebar menu item
5. Create corresponding CSS file

### Adding API Methods
1. Add method to `ApiService.js`
2. Use in component with async/await
3. Handle loading and error states
4. Show success/error messages

### Styling New Components
1. Use existing color variables
2. Follow spacing conventions
3. Add hover/active states
4. Test responsive design
5. Use consistent naming

## License

This project is provided as-is for educational and demonstration purposes.

## Support

For questions or issues, review the code structure and comments in the component files.

---

**Created**: 2024
**Version**: 1.0.0
**Status**: Production Ready (Demo Version)