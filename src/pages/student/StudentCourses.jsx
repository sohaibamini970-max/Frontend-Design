import React, { useEffect, useState } from 'react';
import { Loader2, BookOpen, User } from 'lucide-react';
import { api } from '../../lib/api';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.studentCourses().then(setCourses).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">My Courses</h1>

            {courses.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-400">
                    You're not enrolled in any courses yet
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {courses.map((c) => (
                        <div key={c.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-[#0f2a5f] bg-blue-50 px-2 py-1 rounded">
                                    {c.code}
                                </span>
                                <span className="text-xs text-gray-500">{c.credits} cr</span>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-3">{c.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <User size={14} /> {c.teacher_name}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Attendance</span>
                                    <span
                                        className={`font-semibold ${c.attendance_percentage >= 75
                                                ? 'text-green-600'
                                                : c.attendance_percentage >= 50
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            }`}
                                    >
                                        {c.attendance_percentage}% ({c.present_count}/{c.total_sessions})
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${c.attendance_percentage >= 75
                                                ? 'bg-green-500'
                                                : c.attendance_percentage >= 50
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red-500'
                                            }`}
                                        style={{ width: `${c.attendance_percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentCourses;