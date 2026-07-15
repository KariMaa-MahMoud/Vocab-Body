import { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { ChevronDown, Plus, Check } from 'lucide-react';

export default function UserSwitcher() {
  const { users, currentUser, switchUser, addUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
      >
        <span className="text-xl leading-none">{currentUser.avatar}</span>
        <span className="font-medium hidden sm:inline text-gray-700">{currentUser.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100 mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Switch User</p>
          </div>
          
          <div className="max-h-60 overflow-y-auto hide-scrollbar">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                  user.id === currentUser.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{user.avatar}</span>
                  <span className={`font-medium ${user.id === currentUser.id ? 'text-blue-700' : 'text-gray-700'}`}>
                    {user.name}
                  </span>
                </div>
                {user.id === currentUser.id && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-2 pt-2 px-4 pb-2">
            {isAdding ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (newName.trim()) {
                  const avatars = ['👦', '👧', '👨', '👩', '🤖', '🦊', '🐱', '🐼', '🐯', '🦁'];
                  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
                  addUser(newName.trim(), avatar);
                  setNewName('');
                  setIsAdding(false);
                  setIsOpen(false);
                }
              }} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="User Name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 mt-1">
                  <button type="submit" className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-bold flex-1 transition-colors">Add</button>
                  <button type="button" onClick={() => setIsAdding(false)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-bold flex-1 transition-colors">Cancel</button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 font-bold hover:text-blue-700 p-2.5 rounded-lg hover:bg-blue-50 transition-colors border border-dashed border-blue-200 mt-1"
              >
                <Plus className="w-4 h-4" /> Add new user
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
