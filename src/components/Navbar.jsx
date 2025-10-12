import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { User, LogOut, Menu, Bell, Search } from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section - Menu button and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center">
            <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
              Student Management
            </h1>
          </div>
        </div>

        {/* Right section - User info and actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* User info */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-gray-600">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                <User size={16} className="text-primary-600" />
              </div>
              <div className="hidden lg:block">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="block text-xs text-gray-500">
                  {user?.email}
                </span>
              </div>
              <span className="hidden sm:inline px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                {user?.role}
              </span>
            </div>

            {/* Mobile user avatar */}
            <div className="sm:hidden flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                <User size={16} className="text-primary-600" />
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
