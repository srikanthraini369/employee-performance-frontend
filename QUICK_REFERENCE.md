# EPMS - Quick Reference Guide

## 🚀 Start Application
```bash
cd c:\Users\Srikanth\employee
npm start
# Opens http://localhost:3000
```

## 🔑 Login Credentials
| Account | Username | Password |
|---------|----------|----------|
| Admin | admin | any |
| User | user | any |

Or click the demo buttons on login page.

---

## 📍 Navigation Map

```
Login Page
    ↓
Main Dashboard
    ├── 👥 Employees
    ├── 🎯 Goals
    ├── 📋 Review Cycles
    ├── ⭐ Reviews
    └── 👤 My Profile
```

---

## 📋 Module Quick Access

### Employees (`/employees`)
- **View**: See all employee records
- **Add**: Click "+ Add Employee"
- **Edit**: Click "Edit" on any row
- **Delete**: Click "Delete" (with confirmation)
- **Columns**: ID, Name, Email, Department, Position, Join Date, Salary, Status

**Sample Data**: 5 employees from Engineering, HR, Sales, Finance

### Goals (`/goals`)
- **View**: See all goals with progress
- **Add**: Click "+ Add Goal"
- **Status**: In Progress | Completed | On Hold | Cancelled
- **Progress**: Slider 0-100% with color coding
- **Color Codes**: 
  - 🟢 Green: 80%+ progress
  - 🟡 Orange: 60-80%
  - 🔴 Red: Below 60%

### Review Cycles (`/reviewcycles`)
- **View**: See all review periods
- **Add**: Click "+ Add Review Cycle"
- **Dates**: Start date must be before end date
- **Status**: Planned | In Progress | Completed
- **Use For**: Q1-Q4, Mid-year, Year-end reviews

### Reviews (`/reviews`)
- **View**: See all performance reviews
- **Add**: Click "+ Add Review"
- **Rating**: 0-5 stars (drag slider)
- **Comments**: Required feedback field
- **Status**: Draft | Submitted
- **Color Codes**:
  - 🔴 Red: 0-2 stars (needs improvement)
  - 🟡 Yellow: 2-4 stars (satisfactory)
  - 🟢 Green: 4-5 stars (excellent)

### Profile (`/profile`)
- **Stats**: Total Goals, Completed, In Progress, Avg Rating
- **Goals**: Grid of assigned goals
- **Reviews**: List of received reviews
- **Read-Only**: View only (no editing)

---

## 🎯 Common Tasks

### Create New Employee
1. Click "Employees" in sidebar
2. Click "+ Add Employee"
3. Fill form: Name, Email, Department, Position
4. Optional: Join Date, Salary
5. Click "Create"

### Track Goal Progress
1. Click "Goals" in sidebar
2. Click "+ Add Goal"
3. Enter: Title, Description, Target Date
4. Set Status and Progress
5. Click "Create"
6. Edit later to update progress

### Schedule Review Cycle
1. Click "Review Cycles"
2. Click "+ Add Review Cycle"
3. Enter: Name, Start Date, End Date
4. Set Status: Planned/In Progress/Completed
5. Add optional description
6. Click "Create"

### Submit Performance Review
1. Click "Reviews"
2. Click "+ Add Review"
3. Select Employee from dropdown
4. Set Rating (0-5 stars)
5. Write Comments
6. Set Status: Draft or Submitted
7. Click "Create"

### View Performance Profile
1. Click "My Profile" in sidebar
2. See your stats card
3. View assigned goals
4. Review feedback received
5. Check average rating

---

## 🎨 UI Elements Reference

### Buttons
| Button | Color | Use |
|--------|-------|-----|
| Primary | Purple | Main actions (Add, Create, Update) |
| Secondary | Gray | Cancel, Back |
| Success | Green | Confirm, Save |
| Danger | Red | Delete, Remove |
| Warning | Orange | Edit, Modify |

### Status Badges
| Status | Color | Meaning |
|--------|-------|---------|
| Active | Green | Employee is active |
| In Progress | Red | Work ongoing |
| Completed | Green | Task finished |
| Planned | Yellow | Scheduled |
| Draft | Blue | Not submitted |
| Submitted | Green | Finalized |

### Colors
- 🟣 **Purple Gradient**: Primary theme
- 🟢 **Green**: Success, active, complete
- 🔴 **Red**: Danger, in progress, warning
- 🟡 **Orange**: Attention, caution
- 🔵 **Blue**: Info, draft

---

## 📊 Data Fields

### Employee
```
Name (text) - Required
Email (text) - Required
Department (select) - Required
  Options: Engineering, Sales, HR, Finance, Marketing
Position (text) - Required
Join Date (date) - Optional
Salary (number) - Optional
```

### Goal
```
Title (text) - Required
Description (textarea) - Required
Status (select) - Required
  Options: In Progress, Completed, On Hold, Cancelled
Target Date (date) - Required
Progress (slider 0-100) - Optional
```

### Review Cycle
```
Cycle Name (text) - Required
Start Date (date) - Required
End Date (date) - Required, must be after start
Status (select)
  Options: Planned, In Progress, Completed
Description (textarea) - Optional
```

### Review
```
Employee (select) - Required
Rating (slider 0-5 by 0.5) - Optional
Comments (textarea) - Required
Status (select)
  Options: Draft, Submitted
```

---

## ⚡ Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Focus first input | Tab |
| Submit form | Enter |
| Logout | N/A (use button) |
| Close dialog | Esc (if implemented) |
| Menu toggle | Click hamburger ☰ |

---

## 📱 Responsive Behavior

### Desktop (>768px)
- ✅ Sidebar always visible
- ✅ Multi-column layouts
- ✅ Full feature set visible

### Tablet (768px)
- ✅ Sidebar collapses
- ✅ Adjusted spacing
- ✅ Touch-friendly

### Mobile (<768px)
- ✅ Hamburger menu (☰)
- ✅ Single column
- ✅ Optimized touch targets

---

## 🔄 Common Workflows

### Quarterly Review Process
```
1. Create Review Cycle (Q1, Q2, Q3, Q4)
2. Create Goals for employees
3. Update goal progress regularly
4. Submit performance reviews
5. Check profile for feedback
```

### Employee Onboarding
```
1. Add new employee
2. Assign initial goals
3. Schedule review cycle
4. Set performance targets
5. Monitor progress
```

### Performance Evaluation
```
1. Review employee goals
2. Check goal progress
3. Gather feedback
4. Submit performance review
5. Rate employee (0-5 stars)
6. Provide constructive comments
```

---

## 🐛 Troubleshooting

### Application Won't Start
```bash
# Clear cache
npm cache clean --force

# Reinstall
npm install

# Start fresh
npm start
```

### Login Issues
- Clear browser cache
- Try demo button
- Check browser console for errors

### Styling Looks Odd
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Restart dev server

### Data Lost After Refresh
- **Expected**: Demo mode doesn't persist data
- Use backend API for persistence

### Buttons Not Responding
- Check browser console
- Ensure JavaScript is enabled
- Try different browser

---

## 💾 Data Persistence

### Current (Demo)
- ❌ No data persistence
- ❌ Data resets on page refresh
- ✅ Good for demonstrations
- ✅ Good for testing UI

### For Production
- ✅ Connect to database
- ✅ Use real API endpoints
- ✅ Implement proper authentication
- ✅ Set up secure storage

---

## 🔗 API Quick Reference

All API methods in `ApiService.js`:

### Employee Methods
- `getEmployees()` - Get all employees
- `getEmployeeById(id)` - Get one employee
- `createEmployee(data)` - Add employee
- `updateEmployee(id, data)` - Edit employee
- `deleteEmployee(id)` - Remove employee

### Goal Methods
- `getGoals()` - Get all goals
- `getGoalsByEmployee(id)` - Get employee goals
- `createGoal(data)` - Add goal
- `updateGoal(id, data)` - Edit goal
- `deleteGoal(id)` - Remove goal

### Review Cycle Methods
- `getReviewCycles()` - Get all cycles
- `createReviewCycle(data)` - Add cycle
- `updateReviewCycle(id, data)` - Edit cycle
- `deleteReviewCycle(id)` - Remove cycle

### Review Methods
- `getReviews()` - Get all reviews
- `getReviewsByEmployee(id)` - Get employee reviews
- `createReview(data)` - Submit review
- `updateReview(id, data)` - Edit review
- `deleteReview(id)` - Remove review

### Auth Methods
- `login(username, password)` - Authenticate
- `logout()` - Sign out
- `getCurrentUser()` - Get session user

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| README_EPMS.md | Full documentation |
| FEATURES.md | User guide |
| DEVELOPMENT.md | Developer guide |
| IMPLEMENTATION_SUMMARY.md | What was built |
| QUICK_REFERENCE.md | This file |

---

## 🎯 Key Features Summary

✅ **Authentication**
- Login with demo accounts
- Session management
- Logout functionality

✅ **Employee Management**
- Add, view, edit, delete employees
- Track employee info and status
- Department and position tracking

✅ **Goals Management**
- Create and track goals
- Visual progress indicators
- Status management

✅ **Review Cycles**
- Define review periods
- Schedule multiple cycles
- Track cycle status

✅ **Performance Reviews**
- Submit reviews with ratings
- Add detailed feedback
- Track review status

✅ **User Profile**
- View personal dashboard
- See performance statistics
- View assigned goals
- Check received feedback

✅ **Professional UI**
- Responsive design
- Custom CSS styling
- Smooth animations
- Color-coded indicators

---

## 🚀 Deployment Guide

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
# Creates optimized build in /build folder
```

### Deploy to Server
1. Run `npm run build`
2. Upload `/build` folder to server
3. Configure web server (nginx, Apache)
4. Point to index.html
5. Set up real API endpoints

---

## 📞 Help Resources

### In-App Help
- Hover over elements for tooltips
- Form labels explain fields
- Error messages guide actions
- Demo buttons show quick access

### Code Comments
- Check component files for detailed comments
- Review ApiService.js for data structure
- Check CSS files for styling notes

### Documentation
- README_EPMS.md - Comprehensive guide
- DEVELOPMENT.md - Code explanations
- FEATURES.md - Feature usage

---

## 🎓 Learning Tips

1. **Start with Login**
   - Understand authentication flow
   - Check how session is stored

2. **Explore Employees Page**
   - See full CRUD implementation
   - Learn table rendering
   - Understand form handling

3. **Check API Service**
   - Understand data structures
   - See Promise pattern
   - Learn mock implementation

4. **Review Component Structure**
   - Understand component composition
   - See state management
   - Learn hooks usage

5. **Study CSS**
   - See responsive design
   - Understand flexbox/grid
   - Learn animations

---

## 🏁 Quick Start (New User)

1. **Clone/Download Project**
   ```bash
   cd c:\Users\Srikanth\employee
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Application**
   ```bash
   npm start
   ```

4. **Login**
   - Click "Admin Account" or "User Account"
   - Or use any username/password

5. **Explore**
   - Navigate using sidebar
   - Try all CRUD operations
   - Check your profile

6. **Learn**
   - Read FEATURES.md for usage
   - Read DEVELOPMENT.md for code
   - Review inline comments

---

## ✨ Pro Tips

1. **Use Demo Buttons**
   - Quick login without typing
   - Perfect for testing

2. **Check Form Validation**
   - Required fields marked with *
   - Form won't submit with errors
   - Error messages are helpful

3. **Explore All Pages**
   - Each module has unique features
   - Profile shows your statistics
   - Tables show all data

4. **Test Responsiveness**
   - Resize browser to test mobile view
   - Use DevTools device emulation
   - Check on actual mobile device

5. **Check Browser Console**
   - See what data is being processed
   - Helps understand flow
   - Useful for debugging

---

## 🎉 You're Ready!

Everything is set up and ready to use. Start exploring and building upon this solid foundation.

**Happy coding! 🚀**

---

**Version**: 1.0.0 | **Last Updated**: 2024