import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8">
            <div>
                <h2 className="text-[#0f2a5f] font-bold text-lg">Welcome back, Ahmed! 👋</h2>
                <p className="text-sm text-gray-500">Here's what's happening with your courses today.</p>
            </div>

            <div className="flex items-center gap-5">
                <button className="text-gray-500 hover:text-[#0f2a5f] transition"><Search size={20} /></button>
                <button className="text-gray-500 hover:text-[#0f2a5f] transition relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                </button>
                <button className="text-gray-500 hover:text-[#0f2a5f] transition"><Settings size={20} /></button>
                <div className="w-10 h-10 rounded-full bg-[#0f2a5f] text-white flex items-center justify-center font-semibold">
                    A
                </div>
            </div>
        </header>
    );
};

export default Header;