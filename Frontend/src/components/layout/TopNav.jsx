import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const TopNav = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    if (location.pathname.includes('/tasks')) return 'Tugas Pintar';
    if (location.pathname.includes('/ai-assistant')) return 'Asisten AI';
    return 'Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="md:hidden w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900">{user?.name}</p>
          <p className="text-xs font-medium text-gray-500">{user?.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-button bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"
          title="Logout"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </header>
  );
};

export default TopNav;