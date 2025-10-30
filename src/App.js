import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import ApiService from './services/ApiService';
import Register from './components/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('login');


  useEffect(() => {
    // Check if user is already logged in
    const checkLogin = async () => {
      try {
        const response = await ApiService.getCurrentUser();
        if (response.success && response.data) {
          setIsLoggedIn(true);
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.log('No user logged in');
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  const handleUserUpdate = (updatedUser) => {
    if (!updatedUser) {
      return;
    }
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setPage("login");
  };

  const handleRegister = () =>{
    setPage("register")
  }
  const handleLoginChange = () =>{
    setPage("login")
  }

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="app">
      {isLoggedIn ? ( <MainLayout currentUser={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} /> ) : (page==="login" ? <Login onLogin={handleLogin} handleRegister={handleRegister}/>: 
        <Register onRegister={handleLoginChange} />
      )} 
    </div>
  );
}

export default App;
