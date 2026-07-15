import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WordCard from '../components/WordCard';

export default function Calendar() {
  const { history } = useHistory();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get all history entries for the selected date
  const selectedDateEntries = selectedDate 
    ? history.filter(entry => isSameDay(new Date(entry.date), selectedDate))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <span>📅</span> Learning Calendar
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
          <button onClick={prevMonth} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
          
          {/* Empty cells before start of month */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white min-h-[100px]" />
          ))}

          {/* Days of month */}
          {daysInMonth.map((day, idx) => {
            const dayHistory = history.filter(entry => isSameDay(new Date(entry.date), day));
            const hasWords = dayHistory.length > 0;
            const isSelected = selectedDate && isSameDay(selectedDate, day);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`bg-white min-h-[100px] p-2 flex flex-col items-center hover:bg-blue-50 transition-colors border-t border-transparent
                  ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'}
                  ${isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-50' : ''}
                `}
              >
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                  ${isToday(day) ? 'bg-blue-600 text-white' : ''}
                  ${isSelected && !isToday(day) ? 'bg-blue-100 text-blue-700' : ''}
                `}>
                  {format(day, 'd')}
                </span>
                
                {hasWords && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Words for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          {selectedDateEntries.length > 0 ? (
            <div className="space-y-8">
              {selectedDateEntries.map((entry) => (
                <div key={entry.id}>
                  <h4 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <span className="text-xl">📝</span> Topic: {entry.topic} <span className="text-sm font-normal text-gray-500 ml-2">({entry.difficulty}, {entry.age} years)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entry.words.map((item, idx) => (
                      <WordCard key={idx} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500 border border-gray-200">
              No words generated on this day.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
