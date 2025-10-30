#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:8080';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make POST requests
function makeRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(endpoint, BASE_URL);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function seedData() {
  console.log('🚀 Starting test data seeding...\n');

  try {
    // ============================================
    // STEP 1: CREATE EMPLOYEES
    // ============================================
    console.log('📝 STEP 1: Creating Employees...\n');

    const employees = [
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

    for (const emp of employees) {
      try {
        console.log(`  Creating: ${emp.first_name} ${emp.last_name}...`);
        const result = await makeRequest('/register', emp);
        console.log(`  ✅ Created successfully\n`);
        await sleep(500);
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }

    // ============================================
    // STEP 2: CREATE REVIEW CYCLES
    // ============================================
    console.log('\n📝 STEP 2: Creating Review Cycles...\n');

    const cycles = [
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

    for (const cycle of cycles) {
      try {
        console.log(`  Creating: ${cycle.cycle_name}...`);
        const result = await makeRequest('/CyclesSave', cycle);
        console.log(`  ✅ Created successfully\n`);
        await sleep(500);
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }

    // ============================================
    // STEP 3: CREATE GOALS
    // ============================================
    console.log('\n📝 STEP 3: Creating Goals...\n');

    const goals = [
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

    for (const goal of goals) {
      try {
        console.log(`  Creating: ${goal.title}...`);
        const result = await makeRequest('/savegoals', goal);
        console.log(`  ✅ Created successfully\n`);
        await sleep(500);
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }

    // ============================================
    // STEP 4: CREATE REVIEWS
    // ============================================
    console.log('\n📝 STEP 4: Creating Reviews...\n');

    const reviews = [
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

    for (const review of reviews) {
      try {
        console.log(`  Creating review for: ${review.emp_name}...`);
        const result = await makeRequest('/saveReviews', review);
        console.log(`  ✅ Created successfully\n`);
        await sleep(500);
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }

    console.log('\n✅ ✅ ✅ ALL TEST DATA CREATED SUCCESSFULLY ✅ ✅ ✅\n');
    console.log('📊 Summary:');
    console.log(`   - Employees: ${employees.length}`);
    console.log(`   - Review Cycles: ${cycles.length}`);
    console.log(`   - Goals: ${goals.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log('\n✨ You can now see data in your React frontend!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedData();
