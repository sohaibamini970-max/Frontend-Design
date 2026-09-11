import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const roleSubtitle = {
    admin: "You have full control over the portal.",
    teacher: "Manage your courses, students, and attendance.",
    student: "Here's what's happening with your courses today.",
};

const Header = () => {
    const { user } = useAuth();
    const firstName = user?.full_name?.split(' ')[0] || 'User';
    const subtitle = roleSubtitle[user?.role] || "Welcome to UniAgent.";

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8">
            <div>
                <h2 className="text-[#0f2a5f] font-bold text-lg">
                    Welcome back, {firstName}! 👋
                </h2>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>

            <div className="flex items-center gap-5">
                <button className="text-gray-500 hover:text-[#0f2a5f] transition"><Search size={20} /></button>
                <button className="text-gray-500 hover:text-[#0f2a5f] transition relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                </button>
                <button className="text-gray-500 hover:text-[#0f2a5f] transition"><Settings size={20} /></button>

                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-[#0f2a5f]">{user?.full_name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0f2a5f] text-white flex items-center justify-center font-semibold">
                        {firstName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;