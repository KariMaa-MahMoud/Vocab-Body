import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useFavorites } from '../hooks/useFavorites';
import FlashcardMode from '../components/FlashcardMode';
import QuizMode from '../components/QuizMode';
import { BrainCircuit, LibrarySquare, Star, Folder, ArrowLeft } from 'lucide-react';

export default function Practice() {
  const { history } = useHistory();
  const { favorites } = useFavorites();
  
  const [activeDeck, setActiveDeck] = useState<string | null>(null);
  const [mode, setMode] = useState<'flashcards' | 'quiz'>('flashcards');

  // Gather all generated words
  const allWords = history.flatMap(entry => entry.words);

  // Deduplicate words based on English word
  const uniqueAllWords = Array.from(new Map(allWords.map(item => [item.word, item])).values());
  const uniqueFavorites = Array.from(new Map(favorites.map(item => [item.word, item])).values());

  // Group words by topic
  const topics = Array.from(new Set(history.map(entry => entry.topic)));
  const wordsByTopic = topics.map(topic => {
    const wordsForTopic = history.filter(entry => entry.topic === topic).flatMap(entry => entry.words);
    const uniqueWordsForTopic = Array.from(new Map(wordsForTopic.map(item => [item.word, item])).values());
    return { topic, words: uniqueWordsForTopic };
  });

  const getActiveWords = () => {
    if (activeDeck === 'all') return uniqueAllWords;
    if (activeDeck === 'favorites') return uniqueFavorites;
    const topicDeck = wordsByTopic.find(d => d.topic === activeDeck);
    if (topicDeck) return topicDeck.words;
    return [];
  };

  const activeWords = getActiveWords();

  if (!activeDeck) {
    return (
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <span>🧠</span> Practice Decks
          </h1>
          <p className="text-gray-500">Choose a deck to start practicing your vocabulary.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* All Words Deck */}
          <div 
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => setActiveDeck('all')}
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LibrarySquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">All Words</h3>
            <p className="text-gray-500 font-medium">{uniqueAllWords.length} cards</p>
          </div>

          {/* Favorites Deck */}
          <div 
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => setActiveDeck('favorites')}
          >
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Favorites</h3>
            <p className="text-gray-500 font-medium">{uniqueFavorites.length} cards</p>
          </div>

          {/* Topic Decks */}
          {wordsByTopic.map(deck => (
            <div 
              key={deck.topic}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setActiveDeck(deck.topic)}
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Folder className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{deck.topic}</h3>
              <p className="text-gray-500 font-medium">{deck.words.length} cards</p>
            </div>
          ))}
        </div>
        
        {uniqueAllWords.length === 0 && (
          <div className="mt-8 bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
            <span className="text-4xl block mb-4">📭</span>
            <p className="text-gray-600 font-medium">No words generated yet. Go to the Home page to generate some!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveDeck(null)}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Decks"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {activeDeck === 'all' ? 'All Words' : activeDeck === 'favorites' ? 'Favorites' : activeDeck}
            </h1>
            <p className="text-gray-500 text-sm font-medium">{activeWords.length} cards</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-1 border border-gray-200 inline-flex">
          <button
            onClick={() => setMode('flashcards')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              mode === 'flashcards' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LibrarySquare className="w-4 h-4" /> Flashcards
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              mode === 'quiz' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BrainCircuit className="w-4 h-4" /> Quiz
          </button>
        </div>
      </div>

      {activeWords.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <span className="text-6xl block mb-4">📭</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No words found</h2>
          <p className="text-gray-500">
            {activeDeck === 'favorites' 
              ? "You haven't added any words to your favorites yet. Click the star icon on a word card to save it!"
              : "Generate some words on the Home page first to start practicing!"}
          </p>
        </div>
      ) : (
        <div className="mt-8">
          {mode === 'flashcards' ? (
            <FlashcardMode words={activeWords} />
          ) : (
            <QuizMode words={activeWords} allWordsPool={uniqueAllWords} />
          )}
        </div>
      )}
    </div>
  );
}
