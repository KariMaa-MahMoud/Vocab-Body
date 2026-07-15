import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type User = {
  id: string;
  name: string;
  avatar: string;
};

type UserContextType = {
  users: User[];
  currentUser: User | null;
  addUser: (name: string, avatar: string) => void;
  switchUser: (id: string) => void;
  deleteUser: (id: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('vocab_users');
    if (stored) return JSON.parse(stored);
    return [];
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem('vocab_current_user_id');
  });

  useEffect(() => {
    localStorage.setItem('vocab_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('vocab_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('vocab_current_user_id');
    }
  }, [currentUserId]);

  const addUser = (name: string, avatar: string) => {
    const newUser = { id: uuidv4(), name, avatar };
    setUsers(prev => [...prev, newUser]);
    if (!currentUserId) {
      setCurrentUserId(newUser.id);
    }
    // Migration for first user
    if (users.length === 0) {
      ['vocab_history', 'vocab_favorites', 'vocab_quiz_results', 'vocab_learned'].forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          localStorage.setItem(`${key}_${newUser.id}`, data);
        }
      });
    }
  };

  const switchUser = (id: string) => {
    setCurrentUserId(id);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUserId === id) {
      setCurrentUserId(null);
    }
  };

  const currentUser = users.find(u => u.id === currentUserId) || null;

  return (
    <UserContext.Provider value={{ users, currentUser, addUser, switchUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
