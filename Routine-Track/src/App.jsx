import { useState, useEffect } from 'react'
import LandingPage from './component/LandingPage'
import Dashboard from './component/dashboard_panel/user_dash_board'
import './index.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  // On mount, check if a valid PHP session already exists (handles page refresh)
  useEffect(() => {
    fetch("http://localhost/routine-tracker/get_user.php", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setIsLoggedIn(true);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  if (checking) return null;

  return (
    <main>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </main>
  )
}

export default App
