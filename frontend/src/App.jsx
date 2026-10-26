import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginView from './views/LoginView';
import TeacherDashboard from './views/TeacherDashboard';
import StudentDashboard from './views/StudentDashboard';
import { authService } from './services/api';

export default function App() {
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  if (!user) {
    return <LoginView onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col text-zinc-900">
      <Navbar user={user} />
      <main className="flex-1 pb-16">
        {user.role === 'teacher' ? (
          <TeacherDashboard user={user} />
        ) : (
          <StudentDashboard user={user} />
        )}
      </main>
    </div>
  );
}
