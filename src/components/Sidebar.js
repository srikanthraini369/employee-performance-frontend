import './Sidebar.css';

const Sidebar = ({ currentPage, onPageChange, isOpen }) => {
  const menuItems = [
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'reviewcycles', label: 'Review Cycles', icon: '📋' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'profile', label: 'My Profile', icon: '👤' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;