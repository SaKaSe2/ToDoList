import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [useLocation, setUseLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
      checkLocationReminders(res.data);
    } catch (error) {
      console.error(error);
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
              new Notification("Task Nearby!", { body: `You are near: ${task.title}` });
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
      // Adding a timeout just in case getCurrentPosition takes too long
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
      // Optimistic update
      const tempId = Date.now().toString();
      const optimisticTask = { id: tempId, ...payload, is_completed: false };
      setTasks(prev => [optimisticTask, ...prev]);

      // Reset form instantly
      setTitle("");
      setScheduledAt("");
      setUseLocation(false);

      const res = await api.post('/tasks', payload);
      
      // Update with real DB ID
      setTasks(prev => prev.map(t => t.id === tempId ? res.data : t));
      toast.success("Task added!");
    } catch (error) {
      toast.error("Failed to add task");
      fetchTasks(); // Revert on failure
    }
    setLoading(false);
  };

  const toggleComplete = async (task) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t));
    
    try {
      await api.put(`/tasks/${task.id}`, { is_completed: !task.is_completed });
    } catch (error) {
      toast.error("Gagal mengubah status");
      fetchTasks(); // Revert on failure
    }
  };

  const smartReschedule = async (taskId) => {
    // Optimistic UI hide button by simulating future date
    const newDate = new Date();
    newDate.setHours(newDate.getHours() + 2);
    
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, scheduled_at: newDate.toISOString() } : t));
    
    try {
      await api.post(`/tasks/${taskId}/reschedule`);
      toast.success("Rescheduled for 2 hours later!");
      fetchTasks(); // Fetch real data from server to be safe
    } catch (error) {
      toast.error("Gagal reschedule");
      fetchTasks();
    }
  };

  const [focusSession, setFocusSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

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
    try {
      const res = await api.post('/focus/start', { smart_task_id: task.id });
      setFocusSession({ ...res.data, taskTitle: task.title });
      setTimeLeft(25 * 60); // 25 mins
      toast.success("Focus session started! Do deep work now.");
    } catch (error) {
      toast.error("Failed to start focus session");
    }
  };

  const stopFocus = async () => {
    if (!focusSession) return;
    try {
      await api.post(`/focus/${focusSession.id}/stop`);
      toast.success("Focus session saved! Check Dashboard.");
      setFocusSession(null);
    } catch (error) {
      toast.error("Failed to stop focus session");
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 relative pb-24">
      <h1 className="text-2xl font-black text-slate-800">Smart Tasks</h1>

      {focusSession && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-80 bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-700 animate-slide-up z-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Deep Work Mode</p>
              <p className="text-white font-medium truncate w-48">{focusSession.taskTitle}</p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter mb-6 font-mono text-center">
            {formatTime(timeLeft)}
          </div>
          <button onClick={stopFocus} className="w-full bg-white text-slate-900 font-black py-3 rounded-xl hover:bg-slate-100 transition-colors">
            Stop Session
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4 items-end relative z-10">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1">New Task</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none rounded-xl px-4 py-2 transition-all"
              placeholder="What needs to be done?"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-slate-500 mb-1">Time (Optional)</label>
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
            <label htmlFor="geo" className="text-sm font-medium text-slate-600">Use location</label>
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-black shadow-lg shadow-blue-200 hover:shadow-none hover:translate-y-0.5 transition-all disabled:opacity-50">
            {loading ? "..." : "Add"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
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
                    {task.scheduled_at && <span><i className="fa-regular fa-clock"></i> {new Date(task.scheduled_at).toLocaleString()}</span>}
                    {task.latitude && <span><i className="fa-solid fa-location-dot"></i> Geo-context active</span>}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {task.scheduled_at && new Date(task.scheduled_at) < new Date() && !task.is_completed && (
                 <button onClick={() => smartReschedule(task.id)} className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 font-black px-4 py-2 rounded-xl transition-colors">
                   Reschedule
                 </button>
              )}
              {!task.is_completed && !focusSession && (
                <button onClick={() => startFocus(task)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-black px-4 py-2 rounded-xl transition-colors">
                  <i className="fa-solid fa-stopwatch mr-1"></i> Focus
                </button>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-2xl text-slate-300"></i>
            </div>
            <p className="font-bold text-slate-400">No tasks yet. Enjoy your day!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
