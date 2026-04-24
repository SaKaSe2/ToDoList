import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AIAssistant = () => {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDecompose = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create Goal
      const goalRes = await api.post('/goals', { title: goalTitle, description: goalDesc });
      
      // Decompose it via API
      const decompRes = await api.post(`/goals/${goalRes.data.id}/decompose`);
      setResult(decompRes.data.new_tasks);
      toast.success("Goal successfully broken down!");
    } catch (error) {
      toast.error("Failed to process with AI");
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800">AI Goal Assistant</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleDecompose} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Big Goal</label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="e.g. Build a Web Application"
              className="w-full border border-slate-200 rounded-xl px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Context / Details</label>
            <textarea
              value={goalDesc}
              onChange={(e) => setGoalDesc(e.target.value)}
              placeholder="Provide any context for the AI..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2 h-24"
            ></textarea>
          </div>
          <button type="submit" disabled={loading} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-xl disabled:opacity-50 transition-opacity">
            {loading ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-spinner animate-spin"></i> AI is thinking...
              </span>
            ) : "Break it Down"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 animate-pulse">
          <div className="h-6 bg-purple-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-200 mr-3 shrink-0"></div>
                <div className="w-full space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && result && (
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 animate-fade-in">
          <h2 className="text-lg font-black text-purple-800 mb-4">AI Generated Action Plan</h2>
          <div className="space-y-2">
            {result.map((task, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg flex items-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center mr-3">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
