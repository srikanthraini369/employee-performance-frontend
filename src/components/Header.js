import './Header.css';

const Header = ({ currentUser, onLogout, onMenuClick, sidebarOpen }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          {sidebarOpen ? '☰' : '➤'}
        </button>
        <div className="logo">
          <span className="logo-text">📊 EPMS</span>
          <span className="logo-subtitle">Employee Performance Management</span>
        </div>
      </div>

      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">{currentUser?.first_name[0]}</div>
          <div className="user-details">
            <div className="user-name">{currentUser?.first_name}</div>
            <div className="user-position">{currentUser?.department}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;