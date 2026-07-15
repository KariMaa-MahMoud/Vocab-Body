import { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';
import { useUser } from '../contexts/UserContext';

export function useHistory() {
  const { currentUser } = useUser();
  
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`vocab_history_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`vocab_history_${currentUser.id}`);
      setHistory(stored ? JSON.parse(stored) : []);
    } else {
      setHistory([]);
    }
  }, [currentUser?.id]);

  const saveToHistory = (entry: HistoryEntry) => {
    if (!currentUser) return;
    const key = `vocab_history_${currentUser.id}`;
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(key, JSON.stringify(updatedHistory));
  };

  const getPreviousWordsForTopic = (topic: string, age: string, difficulty: string): string[] => {
    const topicHistory = history.filter(
      (entry) => entry.topic.toLowerCase() === topic.toLowerCase() && entry.age === age && entry.difficulty === difficulty
    );
    const words = topicHistory.flatMap((entry) => entry.words.map((w) => w.word));
    return Array.from(new Set(words)); // Unique words
  };

  const clearHistory = () => {
    if (!currentUser) return;
    const key = `vocab_history_${currentUser.id}`;
    setHistory([]);
    localStorage.removeItem(key);
  };

  return { history, saveToHistory, getPreviousWordsForTopic, clearHistory };
}
