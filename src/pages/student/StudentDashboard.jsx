import React, { useEffect, useState } from 'react';
import { BookOpen, CalendarCheck, TrendingUp, Award, Loader2, Megaphone } from 'lucide-react';
import { api } from '../../lib/api';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.studentDashboard()
            .then(setData)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="p-6 sm:p-8 text-gray-500 flex items-center gap-2 text-sm">
                <Loader2 className="animate-spin" size={18} /> Loading...
            </div>
        );

    if (!data)
        return <div className="p-6 sm:p-8 text-gray-500 text-sm">Failed to load dashboard</div>;

    const stats = [
        { label: 'Enrolled Courses', value: data.total_courses, icon: BookOpen, color: '#0f2a5f' },
        { label: 'Attendance', value: `${data.attendance_percentage}%`, icon: TrendingUp, color: '#059669' },
        { label: 'Sessions Attended', value: `${data.present_count}/${data.total_sessions}`, icon: CalendarCheck, color: '#2563eb' },
        { label: 'CGPA', value: data.cgpa.toFixed(2), icon: Award, color: '#d97706' },
    ];

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0f2a5f] break-words">
                    Welcome back, {data.student_name}!
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">
                    Roll No: {data.roll_number}
                    <span className="hidden sm:inline"> · </span>
                    <span className="sm:hidden"><br /></span>
                    Batch {data.batch_year}
                    <span className="hidden sm:inline"> · </span>
                    <span className="sm:hidden"><br /></span>
                    Semester {data.current_semester}
                </p>
            </div>

            {/* Stats Grid — 1 col on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-xs sm:text-sm font-semibold text-gray-500">{label}</span>
                            <Icon size={18} style={{ color }} className="sm:w-5 sm:h-5" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-[#0f2a5f]">{value}</p>
                    </div>
                ))}
            </div>

            {/* Today's Classes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#0f2a5f] text-sm sm:text-base">Today's Classes</h2>
                </div>

                {data.today_classes.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No classes today</div>
                ) : (
                    <>
                        {/* Desktop table (md+) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Teacher</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.today_classes.map((c, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-3 text-sm font-semibold text-[#0f2a5f] whitespace-nowrap">
                                                {c.start_time} – {c.end_time}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-700">
                                                <span className="font-semibold">{c.course_code}</span> — {c.course_title}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-600">{c.teacher}</td>
                                            <td className="px-6 py-3 text-sm text-gray-600">{c.room || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card view (< md) */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {data.today_classes.map((c, i) => (
                                <div key={i} className="px-4 py-3 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="font-semibold text-[#0f2a5f] text-sm">{c.course_code}</span>
                                        <span className="text-xs font-semibold text-[#0f2a5f] whitespace-nowrap">
                                            {c.start_time} – {c.end_time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{c.course_title}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>{c.teacher}</span>
                                        {c.room && (
                                            <>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span>{c.room}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Recent Announcements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2">
                    <Megaphone size={16} className="text-[#0f2a5f] sm:w-[18px] sm:h-[18px]" />
                    <h2 className="font-semibold text-[#0f2a5f] text-sm sm:text-base">Recent Announcements</h2>
                </div>

                {data.recent_announcements.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No announcements</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {data.recent_announcements.map((a) => (
                            <div key={a.id} className="px-4 sm:px-6 py-3 sm:py-4">
                                <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{a.title}</h3>
                                <span className="text-xs text-gray-400 block mb-2">
                                    {a.published_at ? new Date(a.published_at).toLocaleDateString() : ''}
                                </span>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                                    {a.body}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;