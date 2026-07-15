import { useHistory } from '../hooks/useHistory';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import WordCard from '../components/WordCard';

export default function History() {
  const { history, clearHistory } = useHistory();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleClear = () => {
    clearHistory();
    setShowConfirm(false);
  };

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <span className="text-6xl mb-4 block">📭</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No history yet</h2>
          <p className="text-gray-500">Go generate some words to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <span>🕰️</span> Learning History
        </h1>
        
        {showConfirm ? (
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <span className="text-sm font-medium text-red-800">Are you sure?</span>
            <button 
              onClick={handleClear}
              className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Yes, reset
            </button>
            <button 
              onClick={() => setShowConfirm(false)}
              className="text-sm px-3 py-1 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            Reset All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {history.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const dateStr = format(new Date(entry.date), 'MMMM d, yyyy - h:mm a');

          return (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleExpand(entry.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-xl">📝</span> {entry.topic}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1 flex gap-3">
                    <span>📅 {dateStr}</span>
                    <span>•</span>
                    <span>👦 {entry.age}</span>
                    <span>•</span>
                    <span>⭐ {entry.difficulty}</span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {entry.words.map((item, idx) => (
                      <WordCard key={idx} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
