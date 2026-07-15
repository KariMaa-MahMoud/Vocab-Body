import { useState, useEffect } from 'react';
import { VocabularyItem } from '../types';
import { useUser } from '../contexts/UserContext';

export function useFavorites() {
  const { currentUser } = useUser();
  
  const [favorites, setFavorites] = useState<VocabularyItem[]>(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`vocab_favorites_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`vocab_favorites_${currentUser.id}`);
      setFavorites(stored ? JSON.parse(stored) : []);
    } else {
      setFavorites([]);
    }
  }, [currentUser?.id]);

  const toggleFavorite = (item: VocabularyItem) => {
    if (!currentUser) return;
    const key = `vocab_favorites_${currentUser.id}`;
    setFavorites(prev => {
      const isFav = prev.some(f => f.word === item.word);
      const newFavs = isFav ? prev.filter(f => f.word !== item.word) : [...prev, item];
      localStorage.setItem(key, JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (word: string) => favorites.some(f => f.word === word);

  return { favorites, toggleFavorite, isFavorite };
}
