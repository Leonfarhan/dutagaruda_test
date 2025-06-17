import { House, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const SidebarLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `p-3 rounded-lg flex items-center space-x-2 w-full justify-center text-sm ` +
      (isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100')
    }
    title={text}
  >
    {icon}
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="w-20 bg-white shadow-md flex flex-col items-center py-4">
      <nav className="flex flex-col items-center flex-1 space-y-4 w-full px-2">
        <SidebarLink icon={<House size={24} />} text="Dashboard" to="/" />
        <SidebarLink icon={<FileText size={24} />} text="Ruang Meeting" to="/ruang-meeting" />
      </nav>
    </aside>
  );
};

export default Sidebar;
