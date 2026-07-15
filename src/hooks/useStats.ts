import { useState, useEffect } from 'react';
import { QuizResult } from '../types';
import { useUser } from '../contexts/UserContext';

export function useStats() {
  const { currentUser } = useUser();
  
  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`vocab_quiz_results_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`vocab_quiz_results_${currentUser.id}`);
      setQuizResults(stored ? JSON.parse(stored) : []);
    } else {
      setQuizResults([]);
    }
  }, [currentUser?.id]);

  const saveQuizResult = (result: QuizResult) => {
    if (!currentUser) return;
    const key = `vocab_quiz_results_${currentUser.id}`;
    setQuizResults(prev => {
      const updated = [result, ...prev];
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  return { quizResults, saveQuizResult };
}
