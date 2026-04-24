import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const TypewriterTask = ({ task, index }) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const fullTextLength = task.title.length + task.description.length;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleChars(c => {
        if (c >= fullTextLength) {
          clearInterval(timer);
          return c;
        }
        return c + 2;
      });
    }, 10);
    return () => clearInterval(timer);
  }, [fullTextLength]);

  const titleChars = Math.min(visibleChars, task.title.length);
  const descChars = Math.max(0, visibleChars - task.title.length);

  return (
    <div className="bg-white p-4 rounded-xl flex items-start shadow-sm animate-fade-in border border-slate-100 hover:border-purple-200 transition-colors">
      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-black flex items-center justify-center mr-4 shrink-0 mt-0.5">
        {index + 1}
      </div>
      <div className="flex-1">
        <p className="font-bold text-slate-800 text-lg">
          {task.title.substring(0, titleChars)}
          {titleChars < task.title.length && <span className="inline-block w-1.5 h-4 bg-purple-400 ml-1 animate-pulse"></span>}
        </p>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          {task.description.substring(0, descChars)}
          {titleChars >= task.title.length && descChars < task.description.length && <span className="inline-block w-1.5 h-3 bg-slate-400 ml-1 animate-pulse"></span>}
        </p>
      </div>
    </div>
  );
};

const AIAssistant = () => {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDecompose = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const goalRes = await api.post('/goals', { title: goalTitle, description: goalDesc });
      const decompRes = await api.post(`/goals/${goalRes.data.id}/decompose`);
      
      setTimeout(() => {
        setResult(decompRes.data.new_tasks);
        toast.success("Tujuan berhasil dipecah menjadi tugas kecil!");
      }, 500);
      
    } catch (error) {
      toast.error("Gagal memproses dengan AI");
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <h1 className="text-2xl font-black text-slate-800">Asisten AI</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleDecompose} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tujuan Besar Anda</label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Contoh: Membuat Aplikasi Skripsi"
              className="w-full border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none rounded-xl px-4 py-2 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Konteks / Detail (Opsional)</label>
            <textarea
              value={goalDesc}
              onChange={(e) => setGoalDesc(e.target.value)}
              placeholder="Berikan konteks agar AI lebih memahami tujuan Anda..."
              className="w-full border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none rounded-xl px-4 py-2 h-24 transition-all"
            ></textarea>
          </div>
          <button type="submit" disabled={loading} className="bg-purple-600 text-white font-black py-3 px-8 rounded-xl disabled:opacity-50 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5">
            {loading ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-spinner animate-spin"></i> Sedang Memproses...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-wand-magic-sparkles"></i> Pecah Menjadi Tugas Kecil
              </span>
            )}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 animate-pulse">
          <div className="flex flex-col items-center justify-center py-6 mb-6 border-b border-purple-100/50">
            <i className="fa-solid fa-microchip text-3xl text-purple-300 mb-4 animate-bounce"></i>
            <h3 className="font-bold text-purple-800 text-lg">AI Sedang Berpikir...</h3>
            <p className="text-purple-600/70 text-sm mt-1 text-center max-w-md">
              Harap tunggu, kami sedang menyinkronkan dengan server LLaMA-3. Proses ini mungkin memakan waktu hingga 1 menit jika server sedang tertidur.
            </p>
          </div>
          
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-purple-50">
                <div className="w-8 h-8 rounded-full bg-purple-200 mr-3 shrink-0"></div>
                <div className="w-full space-y-2">
                  <div className="h-4 bg-purple-100 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-50 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && result && (
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 animate-fade-in shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <i className="fa-solid fa-robot"></i>
            </div>
            <h2 className="text-xl font-black text-purple-900">Rencana Aksi AI Siap</h2>
          </div>
          <div className="space-y-3">
            {result.map((task, idx) => (
              <TypewriterTask key={idx} task={task} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
