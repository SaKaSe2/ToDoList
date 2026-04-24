import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    if (location.pathname.includes('/tasks')) return 'Smart Tasks';
    if (location.pathname.includes('/ai-assistant')) return 'AI Assistant';
    return 'Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center gap-6">
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