import { useState } from 'react';
import './MainLayout.css';
import Header from './Header';
import Sidebar from './Sidebar';
import EmployeeTable from './pages/EmployeeTable';
import GoalsTable from './pages/GoalsTable';
import ReviewCyclesTable from './pages/ReviewCyclesTable';
import ReviewsTable from './pages/ReviewsTable';
import Profile from './pages/Profile';

const MainLayout = ({ currentUser, onLogout, onUserUpdate }) => {
  const [currentPage, setCurrentPage] = useState('employees');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'employees':
        return <EmployeeTable />;
      case 'goals':
        return <GoalsTable currentUser={currentUser} />;
      case 'reviewcycles':
        return <ReviewCyclesTable />;
      case 'reviews':
        return <ReviewsTable currentUser={currentUser} />;
      case 'profile':
        return <Profile currentUser={currentUser} onUserUpdate={onUserUpdate} />;
      default:
        return <EmployeeTable />;
    }
  };

  return (
    <div className="main-layout">
      <Header 
        currentUser={currentUser} 
        onLogout={onLogout}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="layout-content">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isOpen={sidebarOpen}
        />
        <div className="main-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;