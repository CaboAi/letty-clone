import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  FileText,
  Library,
  TrendingUp,
  Globe,
  User,
  Brain
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'AI Settings', href: '/ai-settings', icon: Brain },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: FileText },
  { name: 'Template Library', href: '/templates', icon: Library },
  { name: 'ROI Tracker', href: '/roi-tracker', icon: TrendingUp },
  { name: 'Localization', href: '/localization', icon: Globe },
  { name: 'Account Settings', href: '/account', icon: User }
];

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onNavigate }) => {
  if (mobile) {
    return (
      <nav className="flex flex-1 flex-col px-6 pb-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-blue-200 hover:text-white hover:bg-blue-700'
                  }`
                }
              >
                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <div className="bg-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-blue-200 truncate">admin@caboai.com</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-blue-900 to-blue-800 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-white p-3 flex items-center justify-center">
              <img 
                src="/ChatGPT Image Jun 5, 2025, 04_32_06 PM.png" 
                alt="CaboAi Logo" 
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CaboAi</h1>
              <p className="text-sm text-blue-200">AI Communications</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-700 text-white shadow-sm'
                            : 'text-blue-200 hover:text-white hover:bg-blue-700'
                        }`
                      }
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <div className="bg-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-blue-200">admin@caboai.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;