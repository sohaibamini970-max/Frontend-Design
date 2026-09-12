import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    CalendarCheck,
    BookOpen,
    Clock,
    Megaphone,
    LogOut,
    GraduationCap,
    UserPlus,
    BookPlus,
    Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const baseNavItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { path: '/timetable', label: 'Timetable', icon: Clock },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/announcements', label: 'Announcements', icon: Megaphone },
];

const adminNavItems = [
    { path: '/admin/manage', label: 'Manage Users', icon: Users },
    { path: '/admin/students', label: 'Add Student', icon: UserPlus },
    { path: '/admin/teachers', label: 'Add Teacher', icon: UserPlus },
    { path: '/admin/courses', label: 'Add Course', icon: BookPlus },
];

const Sidebar = () => {
    // ✅ Hooks INSIDE the component
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // ✅ Pick items based on role
    const navItems = user?.role === 'admin' ? adminNavItems : baseNavItems;

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col px-4 py-6 z-20">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-10 h-10 rounded-lg bg-[#0f2a5f] flex items-center justify-center">
                    <GraduationCap className="text-white" size={22} />
                </div>
                <div>
                    <h1 className="text-[#0f2a5f] font-extrabold text-lg leading-tight">UniAgent</h1>
                    <p className="text-xs text-gray-500">AI Student Portal</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-[#0f2a5f] text-white shadow-md'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-[#0f2a5f]'
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-4 border-t border-gray-100 pt-5"
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;