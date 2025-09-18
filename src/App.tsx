import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import CompanyAdminDashboard from './components/CompanyAdminDashboard';
import TeamInchargeDashboard from './components/TeamInchargeDashboard';
import TelecallerDashboard from './components/TelecallerDashboard';

function App() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    role: 'superadmin' | 'companyadmin' | 'teamincharge' | 'telecaller';
  } | null>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user.role === 'superadmin' ? (
              <Navigate to="/superadmin" replace />
            ) : user.role === 'companyadmin' ? (
              <Navigate to="/companyadmin" replace />
            ) : user.role === 'teamincharge' ? (
              <Navigate to="/teamincharge" replace />
            ) : (
              <Navigate to="/telecaller" replace />
            )
          }
        />
        <Route
          path="/superadmin"
          element={
            user.role === 'superadmin' ? (
              <SuperAdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/companyadmin"
          element={
            user.role === 'companyadmin' || user.role === 'superadmin' ? (
              <CompanyAdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/teamincharge"
          element={
            ['teamincharge', 'companyadmin', 'superadmin'].includes(user.role) ? (
              <TeamInchargeDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/telecaller"
          element={<TelecallerDashboard user={user} onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;