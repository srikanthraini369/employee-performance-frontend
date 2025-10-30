// ============================================
// EMPLOYEE MANAGEMENT SYSTEM - TEST DATA SEEDER
// Paste this entire script into browser console (F12)
// ============================================

const BASE_URL = 'http://localhost:8080';
const headers = { 'Content-Type': 'application/json' };

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// TEST DATA
// ============================================

const testEmployees = [
  {
    emp_code: 'EM001',
    first_name: 'Rajesh',
    last_name: 'Kumar',
    email: 'rajesh.kumar@company.com',
    phoneNo: '9876543210',
    password: 'Password@123',
    department: 'IT',
    job_title: 'Senior Developer',
    gender: 'male',
    manager_id: null,
    active: 'yes'
  },
  {
    emp_code: 'EM002',
    first_name: 'Priya',
    last_name: 'Singh',
    email: 'priya.singh@company.com',
    phoneNo: '9876543211',
    password: 'Password@123',
    department: 'HR',
    job_title: 'HR Manager',
    gender: 'female',
    manager_id: 1,
    active: 'yes'
  },
  {
    emp_code: 'EM003',
    first_name: 'Amit',
    last_name: 'Patel',
    email: 'amit.patel@company.com',
    phoneNo: '9876543212',
    password: 'Password@123',
    department: 'Sales',
    job_title: 'Sales Executive',
    gender: 'male',
    manager_id: 1,
    active: 'yes'
  }
];

const testReviewCycles = [
  {
    cycle_name: 'Q1 2025 Performance Review',
    start_date: '2025-01-01',
    end_date: '2025-03-31',
    status: 'in progress',
    description: 'First quarter performance evaluation for all employees'
  },
  {
    cycle_name: 'Q2 2025 Performance Review',
    start_date: '2025-04-01',
    end_date: '2025-06-30',
    status: 'planned',
    description: 'Second quarter performance evaluation for all employees'
  }
];

const testGoals = [
  {
    title: 'Complete API Development',
    descriptionText: 'Build comprehensive REST APIs for employee management system',
    status: 'in progress',
    emp_id: 1,
    emp_name: 'Rajesh Kumar',
    created_by: 'Admin',
    start_date: '2025-01-15',
    end_date: '2025-03-15'
  },
  {
    title: 'HR Process Improvement',
    descriptionText: 'Streamline and automate the recruitment process',
    status: 'in progress',
    emp_id: 2,
    emp_name: 'Priya Singh',
    created_by: 'Admin',
    start_date: '2025-01-20',
    end_date: '2025-02-28'
  },
  {
    title: 'Sales Target Q1',
    descriptionText: 'Achieve 50 new leads and close 10 deals',
    status: 'in progress',
    emp_id: 3,
    emp_name: 'Amit Patel',
    created_by: 'Admin',
    start_date: '2025-01-01',
    end_date: '2025-03-31'
  }
];

const testReviews = [
  {
    emp_id: 1,
    emp_name: 'Rajesh Kumar',
    review_cycle_id: 1,
    reviewer_id: 2,
    reviewer_name: 'Priya Singh',
    rating: 4.5,
    comments: 'Excellent technical skills and problem-solving abilities. Great team player.',
    status: 'submitted',
    created_date: '2025-01-25'
  },
  {
    emp_id: 2,
    emp_name: 'Priya Singh',
    review_cycle_id: 1,
    reviewer_id: 1,
    reviewer_name: 'Rajesh Kumar',
    rating: 4.0,
    comments: 'Good leadership and strategic HR management skills. Needs more hands-on involvement.',
    status: 'submitted',
    created_date: '2025-01-25'
  },
  {
    emp_id: 3,
    emp_name: 'Amit Patel',
    review_cycle_id: 1,
    reviewer_id: 1,
    reviewer_name: 'Rajesh Kumar',
    rating: 3.5,
    comments: 'Good sales performance but needs improvement in follow-up and documentation.',
    status: 'submitted',
    created_date: '2025-01-25'
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

async function createEmployee(emp) {
  try {
    console.log(`Creating employee: ${emp.first_name} ${emp.last_name}...`);
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(emp)
    });
    const result = await response.json();
    console.log(`✅ Employee created:`, result);
    return result.data || result;
  } catch (error) {
    console.error(`❌ Failed to create employee:`, error);
    return null;
  }
}

async function createReviewCycle(cycle) {
  try {
    console.log(`Creating review cycle: ${cycle.cycle_name}...`);
    const response = await fetch(`${BASE_URL}/CyclesSave`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(cycle)
    });
    const result = await response.json();
    console.log(`✅ Review cycle created:`, result);
    return result.data || result;
  } catch (error) {
    console.error(`❌ Failed to create review cycle:`, error);
    return null;
  }
}

async function createGoal(goal) {
  try {
    console.log(`Creating goal: ${goal.title}...`);
    const response = await fetch(`${BASE_URL}/savegoals`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(goal)
    });
    const result = await response.json();
    console.log(`✅ Goal created:`, result);
    return result.data || result;
  } catch (error) {
    console.error(`❌ Failed to create goal:`, error);
    return null;
  }
}

async function createReview(review) {
  try {
    console.log(`Creating review for: ${review.emp_name}...`);
    const response = await fetch(`${BASE_URL}/saveReviews`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(review)
    });
    const result = await response.json();
    console.log(`✅ Review created:`, result);
    return result.data || result;
  } catch (error) {
    console.error(`❌ Failed to create review:`, error);
    return null;
  }
}

// ============================================
// MAIN SEEDING FUNCTION
// ============================================

async function seedTestData() {
  console.log('🚀 Starting test data seeding...\n');
  
  try {
    // Step 1: Create Employees
    console.log('📝 STEP 1: Creating Employees...');
    console.log('═══════════════════════════════════════\n');
    for (const emp of testEmployees) {
      await createEmployee(emp);
      await sleep(500);
    }
    
    // Step 2: Create Review Cycles
    console.log('\n📝 STEP 2: Creating Review Cycles...');
    console.log('═══════════════════════════════════════\n');
    for (const cycle of testReviewCycles) {
      await createReviewCycle(cycle);
      await sleep(500);
    }
    
    // Step 3: Create Goals
    console.log('\n📝 STEP 3: Creating Goals...');
    console.log('═══════════════════════════════════════\n');
    for (const goal of testGoals) {
      await createGoal(goal);
      await sleep(500);
    }
    
    // Step 4: Create Reviews
    console.log('\n📝 STEP 4: Creating Reviews...');
    console.log('═══════════════════════════════════════\n');
    for (const review of testReviews) {
      await createReview(review);
      await sleep(500);
    }
    
    console.log('\n✅ ✅ ✅ ALL TEST DATA CREATED SUCCESSFULLY ✅ ✅ ✅');
    console.log('\n📊 Summary:');
    console.log(`   - Employees: ${testEmployees.length}`);
    console.log(`   - Review Cycles: ${testReviewCycles.length}`);
    console.log(`   - Goals: ${testGoals.length}`);
    console.log(`   - Reviews: ${testReviews.length}`);
    console.log('\n🔄 Refreshing page in 2 seconds...');
    
    await sleep(2000);
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

// ============================================
// RUN THE SEEDER
// ============================================

console.log('%c🎯 EMPLOYEE MANAGEMENT TEST DATA SEEDER', 'font-size: 16px; font-weight: bold; color: #0066cc;');
console.log('%cPaste this in your browser console to populate test data', 'font-size: 12px; color: #666;');
console.log('\n');

seedTestData();
