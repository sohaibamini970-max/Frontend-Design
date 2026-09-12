import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, User, CalendarCheck, BookOpen, Clock,
    Megaphone, LogOut, GraduationCap, UserPlus, BookPlus, Users, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminNavItems = [
    { path: '/admin/manage', label: 'Manage Users', icon: Users },
    { path: '/admin/students', label: 'Add Student', icon: UserPlus },
    { path: '/admin/teachers', label: 'Add Teacher', icon: UserPlus },
    { path: '/admin/courses', label: 'Add Course', icon: BookPlus },
];

const teacherNavItems = [
    { path: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/teacher/profile', label: 'Profile', icon: User },
    { path: '/teacher/attendance', label: 'Attendance', icon: CalendarCheck },
    { path: '/teacher/courses', label: 'My Courses', icon: BookOpen },
    { path: '/teacher/timetable', label: 'Timetable', icon: Clock },
    { path: '/teacher/announcements', label: 'Announcements', icon: Megaphone },
];

const studentNavItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { path: '/timetable', label: 'Timetable', icon: Clock },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/announcements', label: 'Announcements', icon: Megaphone },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems =
        user?.role === 'admin' ? adminNavItems :
            user?.role === 'teacher' ? teacherNavItems :
                studentNavItems;

    // Close drawer on route change (mobile UX)
    useEffect(() => {
        if (onClose) onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Lock body scroll when drawer is open on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen && onClose) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleLogout = () => {
        if (onClose) onClose();
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <>
            {/* Backdrop (mobile only, when open) */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200
          flex flex-col px-4 py-6 z-40
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo + close (mobile) */}
                <div className="flex items-center justify-between px-2 mb-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0f2a5f] flex items-center justify-center">
                            <GraduationCap className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-[#0f2a5f] font-extrabold text-lg leading-tight">UniAgent</h1>
                            <p className="text-xs text-gray-500">AI Student Portal</p>
                        </div>
                    </div>

                    {/* Close button (mobile only) */}
                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-500 hover:text-gray-800 transition p-1 rounded-lg hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 overflow-y-auto flex-shrink-0">
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

                {/* Spacer — keeps logout near nav on short screens, pushes down on tall screens */}
                <div className="flex-1 min-h-4" />

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all border-t border-gray-100 pt-5 flex-shrink-0"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;