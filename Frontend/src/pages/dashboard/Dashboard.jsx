import { useState, useEffect } from "react";
import api from "../../api/axios";

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
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default Dashboard;