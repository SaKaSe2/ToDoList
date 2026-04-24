import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logoSvg from "../../assets/logo.svg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi frontend
    if (!formData.email.includes("@")) {
      setErrorMsg("Format email tidak valid.");
      return;
    }
    if (formData.password.length < 8) {
      setErrorMsg("Kata sandi minimal 8 karakter.");
      return;
    }

    setLoading(true);

    const res = await login(formData.email, formData.password);

    if (res.success) {
      toast.success("Login berhasil! Selamat datang kembali.");
      navigate("/dashboard");
    } else {
      setErrorMsg(res.error);
      toast.error(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <img src={logoSvg} alt="NewGen To-Do" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-blue-600 mb-2">NewGen To-Do</h1>
          <p className="text-slate-500 font-medium">Masuk ke akun Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
            <p className="text-sm font-medium text-red-700">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contoh@email.com"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Minimal 8 karakter"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner animate-spin"></i> Sedang Masuk...
              </span>
            ) : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-slate-500">
          Belum punya akun? <Link to="/register" className="text-blue-600 hover:text-blue-700">Daftar di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;