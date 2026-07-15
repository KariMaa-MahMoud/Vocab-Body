import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import History from './pages/History';
import Calendar from './pages/Calendar';
import Practice from './pages/Practice';
import Stats from './pages/Stats';
import { UserProvider, useUser } from './contexts/UserContext';

function MainApp() {
  const { currentUser, addUser } = useUser();
  const [newUserName, setNewUserName] = useState('');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center">
          <span className="text-6xl block mb-6 animate-bounce">👋</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Welcome to Vocab Buddy!</h1>
          <p className="text-gray-500 mb-8 font-medium">Who is learning today?</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (newUserName.trim()) {
              const avatars = ['👦', '👧', '🤖', '🦊', '🐼', '🐯'];
              const avatar = avatars[Math.floor(Math.random() * avatars.length)];
              addUser(newUserName.trim(), avatar);
            }
          }}>
            <input 
              type="text" 
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter your name" 
              className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-gray-100 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 mb-6 transition-all outline-none"
              required
              autoFocus
            />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 text-lg rounded-2xl hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Let's Go! 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/history" element={<History />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
