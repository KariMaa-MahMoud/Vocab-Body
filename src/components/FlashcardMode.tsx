import { useState } from 'react';
import { VocabularyItem } from '../types';
import { motion } from 'motion/react';
import { Volume2, ChevronRight, ChevronLeft, RotateCcw, CheckCircle } from 'lucide-react';
import { useLearned } from '../hooks/useLearned';

interface FlashcardModeProps {
  words: VocabularyItem[];
}

export default function FlashcardMode({ words }: FlashcardModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { isLearned, toggleLearned } = useLearned();

  const currentWord = words[currentIndex];
  const isCurrentLearned = isLearned(currentWord.word);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  const handleTTS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <div className="flex justify-between w-full items-center mb-4 px-4">
        <div className="text-sm font-medium text-gray-500">
          Card {currentIndex + 1} of {words.length}
        </div>
        <button
          onClick={() => toggleLearned(currentWord.word)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
            isCurrentLearned 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CheckCircle className={`w-4 h-4 ${isCurrentLearned ? 'text-green-600' : 'text-gray-400'}`} />
          {isCurrentLearned ? 'Learned' : 'Mark as Learned'}
        </button>
      </div>

      <div 
        className="relative w-full aspect-[4/3] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-blue-100 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
            <button
              onClick={handleTTS}
              className="absolute top-6 right-6 text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50"
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <h2 className="text-5xl font-extrabold text-gray-900">{currentWord.word}</h2>
            <p className="text-gray-400 mt-6 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Click to flip
            </p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-blue-600 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-center"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <h2 className="text-4xl font-bold mb-4">{currentWord.translation}</h2>
            <div className="bg-blue-700/50 rounded-xl p-6 w-full mt-4">
              <p className="text-blue-100 italic text-lg leading-relaxed">
                "{currentWord.example}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={handlePrev}
          className="p-4 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="p-4 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
