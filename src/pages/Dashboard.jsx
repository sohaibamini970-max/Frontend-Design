import React from 'react';
import { CalendarCheck, BookOpen, Clock, ArrowRight } from 'lucide-react';

const stats = [
    { title: 'Overall Attendance', value: '92%', icon: CalendarCheck },
    { title: 'Enrolled Courses', value: '5', icon: BookOpen },
    { title: 'Pending Tasks', value: '3', icon: Clock },
];

const quickLinks = ['AI Course Assistant', 'Library Resources', 'Exam Schedule', 'Fee Payment'];

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Student Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(({ title, value, icon: Icon }) => (
                    <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-gray-500">{title}</span>
                            <Icon size={20} className="text-[#0f2a5f]" />
                        </div>
                        <p className="text-3xl font-bold text-[#0f2a5f]">{value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div>
                <h3 className="text-lg font-bold text-[#0f2a5f] mb-4">Quick Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickLinks.map((item) => (
                        <div
                            key={item}
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition"
                        >
                            <span className="font-semibold text-gray-700">{item}</span>
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;