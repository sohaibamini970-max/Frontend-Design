import React from 'react';
import { Bell, Search, Settings, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const roleSubtitle = {
    admin: "You have full control over the portal.",
    teacher: "Manage your courses, students, and attendance.",
    student: "Here's what's happening with your courses today.",
};

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();
    const firstName = user?.full_name?.split(' ')[0] || 'User';
    const subtitle = roleSubtitle[user?.role] || 'Welcome to UniAgent.';

    return (
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Hamburger — mobile only */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition flex-shrink-0"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div className="min-w-0">
                    <h2 className="text-[#0f2a5f] font-bold text-sm sm:text-base lg:text-lg truncate">
                        Welcome back, {firstName}! 👋
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 truncate hidden xs:block sm:block">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 flex-shrink-0">
                <button className="hidden sm:block text-gray-500 hover:text-[#0f2a5f] transition p-1">
                    <Search size={18} />
                </button>
                <button className="text-gray-500 hover:text-[#0f2a5f] transition relative p-1">
                    <Bell size={18} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="hidden sm:block text-gray-500 hover:text-[#0f2a5f] transition p-1">
                    <Settings size={18} />
                </button>

                <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-[#0f2a5f] truncate max-w-[140px]">
                            {user?.full_name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0f2a5f] text-white flex items-center justify-center font-semibold text-sm">
                        {firstName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;