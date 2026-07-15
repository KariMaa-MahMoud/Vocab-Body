import { useState, useEffect } from 'react';
import { VocabularyItem } from '../types';
import { useUser } from '../contexts/UserContext';

export function useLearned() {
  const { currentUser } = useUser();
  
  const [learnedWords, setLearnedWords] = useState<string[]>(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`vocab_learned_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`vocab_learned_${currentUser.id}`);
      setLearnedWords(stored ? JSON.parse(stored) : []);
    } else {
      setLearnedWords([]);
    }
  }, [currentUser?.id]);

  const toggleLearned = (word: string) => {
    if (!currentUser) return;
    const key = `vocab_learned_${currentUser.id}`;
    setLearnedWords(prev => {
      const isLearned = prev.includes(word);
      const newLearned = isLearned ? prev.filter(w => w !== word) : [...prev, word];
      localStorage.setItem(key, JSON.stringify(newLearned));
      return newLearned;
    });
  };

  const isLearned = (word: string) => learnedWords.includes(word);

  return { learnedWords, toggleLearned, isLearned };
}
