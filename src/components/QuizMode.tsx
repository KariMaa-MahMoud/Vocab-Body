import { useState, useMemo } from 'react';
import { VocabularyItem } from '../types';
import { useStats } from '../hooks/useStats';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface QuizModeProps {
  words: VocabularyItem[];
  allWordsPool: VocabularyItem[]; // Needed to generate wrong answers
}

export default function QuizMode({ words, allWordsPool }: QuizModeProps) {
  const { saveQuizResult } = useStats();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Initialize quiz
  const initQuiz = () => {
    if (words.length < 4) return; // Need at least 4 words for options
    
    // Pick 10 random words or less if we don't have 10
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, Math.min(10, words.length));

    const generatedQuestions = selectedWords.map(targetWord => {
      // Pick 3 wrong translations from allWordsPool
      const wrongOptions = allWordsPool
        .filter(w => w.word !== targetWord.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.translation);
      
      const options = [...wrongOptions, targetWord.translation].sort(() => 0.5 - Math.random());

      return {
        word: targetWord.word,
        correctAnswer: targetWord.translation,
        options
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
  };

  // Run on mount
  useMemo(() => {
    initQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  if (words.length < 4) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <span className="text-4xl block mb-4">📚</span>
        <h3 className="text-xl font-bold text-gray-800">Not enough words</h3>
        <p className="text-gray-500">You need at least 4 words in your collection to take a quiz.</p>
      </div>
    );
  }

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple clicks
    setSelectedAnswer(answer);

    const isCorrect = answer === questions[currentIndex].correctAnswer;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
        saveQuizResult({
          id: uuidv4(),
          date: new Date().toISOString(),
          score: score + (isCorrect ? 1 : 0),
          total: questions.length
        });
      }
    }, 1500);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md mx-auto">
        <span className="text-6xl block mb-4">{percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
        <p className="text-xl text-gray-600 mb-8">
          You scored <span className="font-bold text-blue-600">{score}</span> out of {questions.length}
        </p>
        <button
          onClick={initQuiz}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Play Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6 text-sm font-medium text-gray-500">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8">
        <p className="text-gray-500 mb-2 uppercase tracking-wider text-sm font-semibold">What is the translation for:</p>
        <h2 className="text-4xl font-extrabold text-gray-900">{currentQ.word}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentQ.options.map((option: string, idx: number) => {
          let btnClass = "bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-800";
          let icon = null;

          if (selectedAnswer) {
            if (option === currentQ.correctAnswer) {
              btnClass = "bg-green-50 border-green-500 text-green-800 font-bold";
              icon = <CheckCircle className="w-5 h-5 text-green-600" />;
            } else if (option === selectedAnswer) {
              btnClass = "bg-red-50 border-red-500 text-red-800";
              icon = <XCircle className="w-5 h-5 text-red-600" />;
            } else {
              btnClass = "bg-white border-gray-200 opacity-50";
            }
          }

          return (
            <motion.button
              key={idx}
              whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={`p-4 rounded-xl border-2 text-lg text-left transition-all flex items-center justify-between ${btnClass}`}
            >
              {option}
              {icon}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
