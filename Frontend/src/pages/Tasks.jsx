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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Smart Tasks</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1">New Task</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-slate-500 mb-1">Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2"
            />
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="geo"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="geo" className="text-sm font-medium text-slate-600">Use current location</label>
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50">
            {loading ? "..." : "Add"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input type="checkbox" checked={task.is_completed} onChange={() => toggleComplete(task)} className="w-5 h-5" />
              <div>
                <p className={`font-bold ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title} {task.is_ai_generated && <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-1 rounded-full ml-2">AI</span>}
                </p>
                {(task.scheduled_at || task.latitude) && (
                  <p className="text-xs text-slate-500 mt-1">
                    {task.scheduled_at && `Time: ${new Date(task.scheduled_at).toLocaleString()}`}
                    {task.latitude && ` • Has Geo-context`}
                  </p>
                )}
              </div>
            </div>
            
            {task.scheduled_at && new Date(task.scheduled_at) < new Date() && !task.is_completed && (
               <button onClick={() => smartReschedule(task.id)} className="text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-lg">
                 Smart Reschedule
               </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
