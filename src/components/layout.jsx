import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatBot from './ChatBot'; // 👈 add this

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />
            <div className="ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
            <ChatBot /> {/* 👈 add this at the end */}
        </div>
    );
};

export default Layout;