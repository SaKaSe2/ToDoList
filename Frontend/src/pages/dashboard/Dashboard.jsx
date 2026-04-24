import { useState, useEffect } from "react";
import api from "../../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_focus_minutes: 0,
    completed_tasks: 0,
    total_tasks: 0,
    completion_rate: 0,
    weekly_data: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setStats(response.data);
      } catch (error) {
        console.error("Gagal mengambil analitik");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-800">Analitik Produktivitas</h1>
        
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center py-10 animate-pulse">
          <i className="fa-solid fa-server text-3xl text-blue-300 mb-4 animate-bounce"></i>
          <h3 className="font-bold text-blue-800 text-lg">Membangunkan Server...</h3>
        </div>

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
      <h1 className="text-2xl font-black text-slate-800">Analitik Produktivitas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Tugas Selesai</p>
          <p className="text-4xl font-black text-primary">
            {stats.completed_tasks} <span className="text-lg text-slate-400">/ {stats.total_tasks}</span>
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Waktu Fokus</p>
          <p className="text-4xl font-black text-indigo-600">
            {stats.total_focus_minutes} <span className="text-lg text-slate-400">mnt</span>
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <p className="text-sm font-bold text-slate-500 mb-2">Tingkat Penyelesaian</p>
          <p className="text-4xl font-black text-emerald-600">
            {stats.completion_rate}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6">
        <div className="mb-6">
          <h2 className="text-lg font-black text-slate-800">Tren Produktivitas Mingguan</h2>
          <p className="text-sm text-slate-500">Perbandingan waktu fokus dan tugas selesai dalam 7 hari terakhir.</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weekly_data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="focusMinutes" name="Fokus (Menit)" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar yAxisId="right" dataKey="completedTasks" name="Tugas Selesai" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;