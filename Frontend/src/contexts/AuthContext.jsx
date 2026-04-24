import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/user');
          setUser(response.data);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      let msg = 'Terjadi kesalahan. Silakan coba lagi.';
      
      if (status === 401 || status === 422) {
        if (data?.errors) {
          msg = Object.values(data.errors).flat()[0]; // Ambil pesan error validasi pertama dari Laravel
        } else if (data?.message) {
          msg = data.message;
        } else {
          msg = 'Email atau kata sandi salah.';
        }
      } else if (!error.response) {
        msg = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
      
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const response = await api.post('/register', { name, email, password, password_confirmation });
      localStorage.setItem('token', response.data.access_token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      let msg = 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.';
      
      if (status === 422) {
        if (data?.errors) {
          msg = Object.values(data.errors).flat()[0]; // Ambil pesan error validasi spesifik
        } else if (data?.message) {
          msg = data.message;
        } else {
          msg = 'Data tidak valid atau email sudah terdaftar.';
        }
      } else if (!error.response) {
        msg = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
      
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
        await api.post('/logout');
    } catch (error) {
        console.error("Logout failed on server:", error);
    } finally {
        localStorage.removeItem('token');
        setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};