import React, { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useUser } from '../contexts/UserContext';
import WordCard from '../components/WordCard';
import { VocabularyItem, HistoryEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [age, setAge] = useState('9-12');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isLoading, setIsLoading] = useState(false);
  const [currentWords, setCurrentWords] = useState<VocabularyItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { saveToHistory, getPreviousWordsForTopic } = useHistory();
  const { currentUser } = useUser();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentWords(null);

    const previousWords = getPreviousWordsForTopic(topic, age, difficulty);

    try {
      const response = await fetch('/api/generate-words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          age,
          difficulty,
          previousWords,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate words. Please try again.');
      }

      const data = await response.json();
      
      if (data.words && data.words.length > 0) {
        setCurrentWords(data.words);
        
        // Save to history
        const newEntry: HistoryEntry = {
          id: uuidv4(),
          date: new Date().toISOString(),
          topic,
          age,
          difficulty,
          words: data.words,
        };
        saveToHistory(newEntry);
      } else {
        setError('No words generated. Please try a different topic.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgeTheme = () => {
    switch (age) {
      case '6-8':
        return { emoji: '🧸', color: 'bg-yellow-50', border: 'border-yellow-200' };
      case '9-12':
        return { emoji: '🎮', color: 'bg-green-50', border: 'border-green-200' };
      case '13-15':
        return { emoji: '🎧', color: 'bg-purple-50', border: 'border-purple-200' };
      case '16+':
        return { emoji: '🎓', color: 'bg-slate-50', border: 'border-slate-200' };
      default:
        return { emoji: '📚', color: 'bg-blue-50', border: 'border-blue-200' };
    }
  };

  const theme = getAgeTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className={`rounded-2xl shadow-sm border ${theme.border} p-8 mb-8 transition-colors duration-500 ${theme.color}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Hi, {currentUser?.name}! {theme.emoji}</h1>
          <p className="text-gray-600">Enter a topic and let's discover some exciting vocabulary.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-1">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Topic / Subject
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Science, Space, History"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age Group
              </label>
              <select
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                <option value="6-8">6-8 years</option>
                <option value="9-12">9-12 years</option>
                <option value="13-15">13-15 years</option>
                <option value="16+">16+ years</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                '✨ Generate Words'
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center mb-8 border border-red-100">
          {error}
        </div>
      )}

      {currentWords && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Here are your words for "{topic}"!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentWords.map((item, index) => (
              <WordCard key={index} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
