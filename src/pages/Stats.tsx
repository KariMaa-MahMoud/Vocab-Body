import { useHistory } from '../hooks/useHistory';
import { useFavorites } from '../hooks/useFavorites';
import { useStats } from '../hooks/useStats';
import { BarChart3, Brain, Star, Library } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Stats() {
  const { history } = useHistory();
  const { favorites } = useFavorites();
  const { quizResults } = useStats();

  const allWords = history.flatMap(entry => entry.words);
  const uniqueWords = new Set(allWords.map(w => w.word)).size;

  const totalQuizzes = quizResults.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(quizResults.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / totalQuizzes * 100) 
    : 0;

  // Calculate streak (days with at least one generation or quiz)
  const activityDates = new Set([
    ...history.map(h => format(new Date(h.date), 'yyyy-MM-dd')),
    ...quizResults.map(q => format(new Date(q.date), 'yyyy-MM-dd'))
  ]);

  // --- Data for Charts ---

  // 1. Words Learned Over Last 7 Days (Bar Chart)
  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
  const wordsPerDayData = last7Days.map(date => {
    const dayHistory = history.filter(h => isSameDay(new Date(h.date), date));
    const wordsCount = dayHistory.reduce((acc, curr) => acc + curr.words.length, 0);
    return {
      date: format(date, 'MMM dd'),
      words: wordsCount
    };
  });

  // 2. Quiz Performance Trend (Line Chart)
  const chronologicalQuizzes = [...quizResults].reverse().slice(-10); // Last 10 quizzes
  const quizPerformanceData = chronologicalQuizzes.map((q, i) => ({
    name: `Quiz ${i + 1}`,
    score: Math.round((q.score / q.total) * 100),
    date: format(new Date(q.date), 'MMM dd')
  }));

  // 3. Difficulty Breakdown (Pie Chart)
  const difficultyCount = history.reduce((acc, curr) => {
    acc[curr.difficulty] = (acc[curr.difficulty] || 0) + curr.words.length;
    return acc;
  }, {} as Record<string, number>);
  
  const difficultyData = Object.keys(difficultyCount).map(key => ({
    name: key,
    value: difficultyCount[key]
  }));
  const PIE_COLORS: Record<string, string> = { Easy: '#22c55e', Medium: '#eab308', Hard: '#ef4444' };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <span>📊</span> Your Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Library className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{uniqueWords}</h3>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Words Learned</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{favorites.length}</h3>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Favorite Words</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalQuizzes}</h3>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Quizzes Taken</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{averageScore}%</h3>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Avg Quiz Score</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Words Learned Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Words Learned (Last 7 Days)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wordsPerDayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="words" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Words" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quiz Performance Trend</h2>
          {quizPerformanceData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} name="Score %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 italic">Take some quizzes to see your trend!</p>
            </div>
          )}
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Words by Difficulty</h2>
          {difficultyData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] || '#3b82f6'} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 italic">Generate words to see difficulty breakdown.</p>
            </div>
          )}
        </div>

        {/* Learning Activity Streak */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Activity</h2>
          <div className="flex items-center justify-center h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100 text-center p-6">
            <div>
              <span className="text-6xl block mb-4 animate-bounce">🔥</span>
              <p className="font-bold text-3xl text-gray-900">{activityDates.size} Active Days</p>
              <p className="text-gray-600 mt-2 font-medium">Keep generating words and taking quizzes to grow your streak!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
