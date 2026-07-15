import { Volume2, Star } from 'lucide-react';
import { VocabularyItem } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface WordCardProps {
  item: VocabularyItem;
}

export default function WordCard({ item }: WordCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(item.word);

  const handleTTS = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(item.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech is not supported in this browser.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md relative group">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => toggleFavorite(item)}
          className={`p-2 rounded-full transition-colors ${
            isFav ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'
          }`}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className="w-5 h-5" fill={isFav ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleTTS}
          className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50"
          title="Listen to pronunciation"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2 mt-4">{item.word}</h3>
      <p className="text-xl text-blue-600 font-medium mb-4">{item.translation}</p>
      <div className="bg-gray-50 rounded-lg p-4 w-full mt-auto">
        <p className="text-gray-600 italic text-sm">"{item.example}"</p>
      </div>
    </div>
  );
}
