import { NavLink } from "react-router-dom";
import logoSvg from "../../assets/logo.svg";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { title: "Dashboard", icon: "fa-chart-pie", path: "/dashboard" },
    { title: "Tugas Pintar", icon: "fa-list-check", path: "/tasks" },
    { title: "Asisten AI", icon: "fa-robot", path: "/ai-assistant" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full w-64 bg-gray-900 flex-shrink-0 flex flex-col transition-transform duration-300 z-40 text-gray-300 shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <img src={logoSvg} alt="NewGen To-Do" className="w-9 h-9" />
            <span className="font-bold text-lg text-white tracking-wide">
              NewGen To-Do
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Menu */}
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-button transition-colors duration-200 font-medium text-sm ${
                    isActive
                      ? "bg-primary/20 text-sky-400"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;