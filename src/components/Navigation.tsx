import { Link, useLocation } from 'react-router-dom';
import { Home, History, Calendar, BrainCircuit, BarChart3 } from 'lucide-react';
import UserSwitcher from './UserSwitcher';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/practice', label: 'Practice', icon: BrainCircuit },
    { path: '/stats', label: 'Dashboard', icon: BarChart3 },
    { path: '/history', label: 'History', icon: History },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center mr-6">
            <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <span className="text-3xl">📚</span>
              <span className="hidden lg:inline">Vocab Buddy</span>
            </Link>
          </div>
          <div className="flex-1 flex overflow-x-auto hide-scrollbar space-x-2 mr-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:mr-1.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex-shrink-0">
            <UserSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
