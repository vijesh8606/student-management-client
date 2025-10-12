import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Home, Plus, X } from "lucide-react";

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Students", href: "/students", icon: Users },
    { name: "Add Student", href: "/students/new", icon: Plus },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center justify-center px-4 mb-8 lg:justify-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900 hidden lg:block">
            Student Portal
          </span>
        </div>

        <nav className="mt-8 flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${
                    isActive
                      ? "text-primary-700"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile footer */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 lg:hidden">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Student Portal</p>
            <p className="text-xs text-gray-500">Mobile Version</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
