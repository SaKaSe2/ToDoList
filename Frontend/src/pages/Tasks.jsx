import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [useLocation, setUseLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsFetching(true);
    try {
      const res = await api.get('/tasks');
      if (Array.isArray(res.data)) {
        setTasks(res.data);
        checkLocationReminders(res.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal terhubung ke server. Silakan coba lagi.");
    } finally {
      setIsFetching(false);
    }
  };

  const checkLocationReminders = (taskData) => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      
      taskData.forEach(task => {
        if (!task.is_completed && task.latitude && task.longitude) {
          const dist = calculateDistance(latitude, longitude, task.latitude, task.longitude);
          if (dist <= (task.location_radius_meters || 100)) {
            if (Notification.permission === "granted") {
              new Notification("Tugas di Dekat Anda!", { body: `Anda berada di dekat: ${task.title}` });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission();
            }
          }
        }
      });
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const addTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    let payload = { title, scheduled_at: scheduledAt || null };

    if (useLocation && navigator.geolocation) {
      await new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            payload.latitude = pos.coords.latitude;
            payload.longitude = pos.coords.longitude;
            resolve();
          },
          (err) => resolve(),
          { timeout: 3000 }
        );
      });
    }

    try {
      const tempId = Date.now().toString();
      const optimisticTask = { id: tempId, ...payload, is_completed: false };
      setTasks(prev => [optimisticTask, ...prev]);

      setTitle("");
      setScheduledAt("");
      setUseLocation(false);

      const res = await api.post('/tasks', payload);
      
      setTasks(prev => prev.map(t => t.id === tempId ? res.data : t));
      toast.success("Tugas berhasil ditambahkan!");
    } catch (error) {
      toast.error("Gagal menambahkan tugas");
      fetchTasks();
    }
    setLoading(false);
  };

  const toggleComplete = async (task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t));
    
    try {
      await api.put(`/tasks/${task.id}`, { is_completed: !task.is_completed });
    } catch (error) {
      toast.error("Gagal mengubah status");
      fetchTasks();
    }
  };

  const smartReschedule = async (taskId) => {
    const newDate = new Date();
    newDate.setHours(newDate.getHours() + 2);
    
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, scheduled_at: newDate.toISOString() } : t));
    
    try {
      await api.post(`/tasks/${taskId}/reschedule`);
      toast.success("Berhasil dijadwalkan ulang (+2 jam)!");
      fetchTasks();
    } catch (error) {
      toast.error("Gagal menjadwalkan ulang");
      fetchTasks();
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Yakin ingin menghapus tugas ini?")) return;
    
    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Tugas berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus tugas");
      setTasks(previousTasks);
    }
  };

  const [focusSession, setFocusSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [focusLoading, setFocusLoading] = useState(false);

  useEffect(() => {
    let interval = null;
    if (focusSession && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (focusSession && timeLeft === 0) {
      stopFocus();
    }
    return () => clearInterval(interval);
  }, [focusSession, timeLeft]);

  const startFocus = async (task) => {
    setFocusLoading(true);
    try {
      const res = await api.post('/focus/start', { smart_task_id: task.id });
      setFocusSession({ ...res.data, taskTitle: task.title });
      setTimeLeft(25 * 60);
      toast.success("Sesi Fokus dimulai! Selamat bekerja tanpa gangguan.");
    } catch (error) {
      toast.error("Gagal memulai sesi fokus");
    }
    setFocusLoading(false);
  };

  const stopFocus = async () => {
    if (!focusSession) return;
    setFocusLoading(true);
    try {
      await api.post(`/focus/${focusSession.id}/stop`);
      toast.success("Sesi Fokus disimpan! Cek menu Dashboard.");
      setFocusSession(null);
    } catch (error) {
      toast.error("Gagal menghentikan sesi fokus");
    }
    setFocusLoading(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 relative pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">Tugas Pintar</h1>
      </div>

      {focusSession && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-80 bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700 animate-slide-up z-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Mode Fokus Penuh</p>
              <p className="text-white font-medium truncate w-48">{focusSession.taskTitle}</p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter mb-6 font-mono text-center">
            {formatTime(timeLeft)}
          </div>
          <button onClick={stopFocus} disabled={focusLoading} className="w-full bg-white text-slate-900 font-black py-3 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50">
            {focusLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : "Hentikan Sesi"}
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4 items-end relative z-10">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1">Tugas Baru</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none rounded-xl px-4 py-2 transition-all"
              placeholder="Apa yang ingin Anda kerjakan hari ini?"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-slate-500 mb-1">Waktu (Opsional)</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none rounded-xl px-4 py-2 transition-all"
            />
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="geo"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              className="mr-2 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="geo" className="text-sm font-medium text-slate-600">Gunakan lokasi</label>
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-black shadow-lg shadow-blue-200 hover:shadow-none hover:translate-y-0.5 transition-all disabled:opacity-50">
            {loading ? "..." : "Tambah"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {isFetching ? (
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center py-10 animate-pulse">
            <i className="fa-solid fa-server text-3xl text-blue-300 mb-4 animate-bounce"></i>
            <h3 className="font-bold text-blue-800 text-lg">Membangunkan Server...</h3>
          </div>
        ) : (
          <>
            {tasks.map(task => (
              <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={task.is_completed} 
                    onChange={() => toggleComplete(task)} 
                    className="w-6 h-6 rounded border-slate-300 text-emerald-500 focus:ring-emerald-200 transition-all cursor-pointer" 
                  />
                  <div>
                    <p className={`font-bold text-lg ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title} {task.is_ai_generated && <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-1 rounded-full ml-2 uppercase font-black tracking-widest">AI</span>}
                    </p>
                    {(task.scheduled_at || task.latitude) && (
                      <p className="text-xs font-medium text-slate-400 mt-1 flex gap-3">
                        {task.scheduled_at && <span><i className="fa-regular fa-clock"></i> {new Date(task.scheduled_at).toLocaleString('id-ID')}</span>}
                        {task.latitude && <span><i className="fa-solid fa-location-dot"></i> Geolocation aktif</span>}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteTask(task.id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-500 font-black w-8 h-8 rounded-xl transition-colors flex items-center justify-center" title="Hapus Tugas">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                  {task.scheduled_at && new Date(task.scheduled_at) < new Date() && !task.is_completed && (
                     <button onClick={() => smartReschedule(task.id)} className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 font-black px-4 py-2 rounded-xl transition-colors">
                       Jadwalkan Ulang
                     </button>
                  )}
                  {!task.is_completed && !focusSession && (
                    <button onClick={() => startFocus(task)} disabled={focusLoading} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-black px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
                      {focusLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-stopwatch mr-1"></i> Fokus</>}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-check text-2xl text-slate-300"></i>
                </div>
                <p className="font-bold text-slate-400">Belum ada tugas. Selamat menikmati hari Anda!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tasks;
