import { NavLink } from "react-router-dom";
import logoSvg from "../../assets/logo.svg";

const Sidebar = () => {
  const menuItems = [
    { title: "Dashboard", icon: "fa-chart-pie", path: "/dashboard" },
    { title: "Tugas Pintar", icon: "fa-list-check", path: "/tasks" },
    { title: "Asisten AI", icon: "fa-robot", path: "/ai-assistant" },
  ];

  return (
    <aside className="w-64 bg-gray-900 flex-shrink-0 flex flex-col h-full transition-all duration-300 z-20 text-gray-300 shadow-xl">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img src={logoSvg} alt="NewGen To-Do" className="w-9 h-9" />
          <span className="font-bold text-lg text-white tracking-wide">
            NewGen To-Do
          </span>
        </div>
      </div>

      {/* Menu */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
  );
};

export default Sidebar;