import { useState, useEffect } from "react";
import api from "../../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data to make the dashboard look complex and populated
const weeklyData = [
  { day: 'Mon', focusMinutes: 45, completedTasks: 3 },
  { day: 'Tue', focusMinutes: 120, completedTasks: 7 },
  { day: 'Wed', focusMinutes: 90, completedTasks: 5 },
  { day: 'Thu', focusMinutes: 150, completedTasks: 8 },
  { day: 'Fri', focusMinutes: 60, completedTasks: 4 },
  { day: 'Sat', focusMinutes: 0, completedTasks: 0 },
  { day: 'Sun', focusMinutes: 30, completedTasks: 2 },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_focus_minutes: 0,
    completed_tasks: 0,
    total_tasks: 0,
    completion_rate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-800">Deep Work Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="h-80 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse mt-6"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <h1 className="text-2xl font-black text-slate-800">Deep Work Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Tasks Completed</p>
          <p className="text-4xl font-black text-primary">
            {stats.completed_tasks} <span className="text-lg text-slate-400">/ {stats.total_tasks}</span>
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Focus Time</p>
          <p className="text-4xl font-black text-indigo-600">
            {stats.total_focus_minutes} <span className="text-lg text-slate-400">mins</span>
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <p className="text-sm font-bold text-slate-500 mb-2">Completion Rate</p>
          <p className="text-4xl font-black text-emerald-600">
            {stats.completion_rate}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6">
        <div className="mb-6">
          <h2 className="text-lg font-black text-slate-800">Weekly Productivity Trends</h2>
          <p className="text-sm text-slate-500">Focus minutes vs tasks completed over the last 7 days.</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="focusMinutes" name="Focus (Minutes)" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar yAxisId="right" dataKey="completedTasks" name="Tasks Completed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;