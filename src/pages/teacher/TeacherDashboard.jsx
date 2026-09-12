import React, { useEffect, useState } from 'react';
import { Users, BookOpen, CalendarCheck, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

const TeacherDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.teacherDashboard()
            .then(setData)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-gray-500 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>;
    if (!data) return <div className="p-8 text-gray-500">Failed to load</div>;

    const stats = [
        { label: 'Total Students', value: data.total_students, icon: Users, color: '#2563eb' },
        { label: 'My Courses', value: data.total_courses, icon: BookOpen, color: '#0f2a5f' },
        { label: 'Sessions Held', value: data.total_sessions, icon: CalendarCheck, color: '#059669' },
        { label: 'Avg Attendance', value: `${data.average_attendance}%`, icon: TrendingUp, color: '#d97706' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[#0f2a5f]">
                    Welcome, {data.teacher_name}
                </h1>
                <p className="text-gray-500 text-sm">
                    {data.designation || 'Faculty'} — Here's your teaching overview
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-500">{label}</span>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <p className="text-3xl font-bold text-[#0f2a5f]">{value}</p>
                    </div>
                ))}
            </div>

            {/* Today's Classes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#0f2a5f]">Today's Classes</h2>
                </div>
                {data.today_classes.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No classes today</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.today_classes.map((c, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-3 text-sm font-semibold text-[#0f2a5f]">
                                        {c.start_time} – {c.end_time}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-700">
                                        <span className="font-semibold">{c.course_code}</span> — {c.course_title}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-600">{c.room || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#0f2a5f]">Recent Attendance Sessions</h2>
                </div>
                {data.recent_sessions.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No sessions yet</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Present</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.recent_sessions.map((s) => (
                                <tr key={s.id}>
                                    <td className="px-6 py-3 text-sm text-gray-600">{s.session_date}</td>
                                    <td className="px-6 py-3 text-sm">
                                        <span className="font-semibold text-[#0f2a5f]">{s.course_code}</span> — {s.course_title}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-600">
                                        {s.present_count} / {s.total_marked}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;