#!/usr/bin/env python3

import requests
import json
import time
import sys

BASE_URL = 'http://localhost:8080'

def test_backend():
    """Test if backend is running"""
    try:
        response = requests.get(f'{BASE_URL}/fetchall', timeout=5)
        print(f'✅ Backend is running (Status: {response.status_code})')
        data = response.json()
        current_count = len(data.get('data', []))
        print(f'   Current employees: {current_count}')
        return True
    except Exception as e:
        print(f'❌ Backend connection failed: {str(e)}')
        return False

def create_employee(emp_data):
    """Create a single employee"""
    try:
        response = requests.post(
            f'{BASE_URL}/register',
            json=emp_data,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        if response.status_code in [200, 201]:
            print(f"  ✅ Created: {emp_data['first_name']} {emp_data['last_name']}")
            return True
        else:
            print(f"  ❌ Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def create_review_cycle(cycle_data):
    """Create a single review cycle"""
    try:
        response = requests.post(
            f'{BASE_URL}/CyclesSave',
            json=cycle_data,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        if response.status_code in [200, 201]:
            print(f"  ✅ Created: {cycle_data['cycle_name']}")
            return True
        else:
            print(f"  ❌ Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def create_goal(goal_data):
    """Create a single goal"""
    try:
        response = requests.post(
            f'{BASE_URL}/savegoals',
            json=goal_data,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        if response.status_code in [200, 201]:
            print(f"  ✅ Created: {goal_data['title']}")
            return True
        else:
            print(f"  ❌ Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def create_review(review_data):
    """Create a single review"""
    try:
        response = requests.post(
            f'{BASE_URL}/saveReviews',
            json=review_data,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        if response.status_code in [200, 201]:
            print(f"  ✅ Created review for: {review_data['emp_name']}")
            return True
        else:
            print(f"  ❌ Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("🚀 EMPLOYEE MANAGEMENT TEST DATA SEEDER")
    print("=" * 60)
    
    # Test backend
    print("\n🔍 Testing backend connection...")
    if not test_backend():
        print("\n⚠️  Make sure your backend is running on http://localhost:8080")
        sys.exit(1)
    
    # Employees
    print("\n📝 STEP 1: Creating Employees...\n")
    employees = [
        {
            'emp_code': 'EM001',
            'first_name': 'Rajesh',
            'last_name': 'Kumar',
            'email': 'rajesh.kumar@company.com',
            'phoneNo': '9876543210',
            'password': 'Password@123',
            'department': 'IT',
            'job_title': 'Senior Developer',
            'gender': 'male',
            'active': 'yes'
        },
        {
            'emp_code': 'EM002',
            'first_name': 'Priya',
            'last_name': 'Singh',
            'email': 'priya.singh@company.com',
            'phoneNo': '9876543211',
            'password': 'Password@123',
            'department': 'HR',
            'job_title': 'HR Manager',
            'gender': 'female',
            'manager_id': 1,
            'active': 'yes'
        },
        {
            'emp_code': 'EM003',
            'first_name': 'Amit',
            'last_name': 'Patel',
            'email': 'amit.patel@company.com',
            'phoneNo': '9876543212',
            'password': 'Password@123',
            'department': 'Sales',
            'job_title': 'Sales Executive',
            'gender': 'male',
            'manager_id': 1,
            'active': 'yes'
        }
    ]
    
    emp_count = 0
    for emp in employees:
        if create_employee(emp):
            emp_count += 1
        time.sleep(0.5)
    
    # Review Cycles
    print("\n📝 STEP 2: Creating Review Cycles...\n")
    cycles = [
        {
            'cycle_name': 'Q1 2025 Performance Review',
            'start_date': '2025-01-01',
            'end_date': '2025-03-31',
            'status': 'in progress',
            'description': 'First quarter performance evaluation for all employees'
        },
        {
            'cycle_name': 'Q2 2025 Performance Review',
            'start_date': '2025-04-01',
            'end_date': '2025-06-30',
            'status': 'planned',
            'description': 'Second quarter performance evaluation for all employees'
        }
    ]
    
    cycle_count = 0
    for cycle in cycles:
        if create_review_cycle(cycle):
            cycle_count += 1
        time.sleep(0.5)
    
    # Goals
    print("\n📝 STEP 3: Creating Goals...\n")
    goals = [
        {
            'title': 'Complete API Development',
            'descriptionText': 'Build comprehensive REST APIs for employee management system',
            'status': 'in progress',
            'emp_id': 1,
            'emp_name': 'Rajesh Kumar',
            'created_by': 'Admin',
            'start_date': '2025-01-15',
            'end_date': '2025-03-15'
        },
        {
            'title': 'HR Process Improvement',
            'descriptionText': 'Streamline and automate the recruitment process',
            'status': 'in progress',
            'emp_id': 2,
            'emp_name': 'Priya Singh',
            'created_by': 'Admin',
            'start_date': '2025-01-20',
            'end_date': '2025-02-28'
        },
        {
            'title': 'Sales Target Q1',
            'descriptionText': 'Achieve 50 new leads and close 10 deals',
            'status': 'in progress',
            'emp_id': 3,
            'emp_name': 'Amit Patel',
            'created_by': 'Admin',
            'start_date': '2025-01-01',
            'end_date': '2025-03-31'
        }
    ]
    
    goal_count = 0
    for goal in goals:
        if create_goal(goal):
            goal_count += 1
        time.sleep(0.5)
    
    # Reviews
    print("\n📝 STEP 4: Creating Reviews...\n")
    reviews = [
        {
            'emp_id': 1,
            'emp_name': 'Rajesh Kumar',
            'review_cycle_id': 1,
            'reviewer_id': 2,
            'reviewer_name': 'Priya Singh',
            'rating': 4.5,
            'comments': 'Excellent technical skills and problem-solving abilities. Great team player.',
            'status': 'submitted',
            'created_date': '2025-01-25'
        },
        {
            'emp_id': 2,
            'emp_name': 'Priya Singh',
            'review_cycle_id': 1,
            'reviewer_id': 1,
            'reviewer_name': 'Rajesh Kumar',
            'rating': 4.0,
            'comments': 'Good leadership and strategic HR management skills. Needs more hands-on involvement.',
            'status': 'submitted',
            'created_date': '2025-01-25'
        },
        {
            'emp_id': 3,
            'emp_name': 'Amit Patel',
            'review_cycle_id': 1,
            'reviewer_id': 1,
            'reviewer_name': 'Rajesh Kumar',
            'rating': 3.5,
            'comments': 'Good sales performance but needs improvement in follow-up and documentation.',
            'status': 'submitted',
            'created_date': '2025-01-25'
        }
    ]
    
    review_count = 0
    for review in reviews:
        if create_review(review):
            review_count += 1
        time.sleep(0.5)
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ ✅ ✅ DATA SEEDING COMPLETE ✅ ✅ ✅")
    print("=" * 60)
    print("\n📊 Summary:")
    print(f"   ✓ Employees created: {emp_count}")
    print(f"   ✓ Review Cycles created: {cycle_count}")
    print(f"   ✓ Goals created: {goal_count}")
    print(f"   ✓ Reviews created: {review_count}")
    print("\n✨ You can now refresh your React frontend to see all data!\n")

if __name__ == '__main__':
    main()
