import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Loader2, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';

const TeacherCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        api.teacherCourses()
            .then(setCourses)
            .finally(() => setLoading(false));
    }, []);

    const openCourse = async (course) => {
        setSelected(course);
        setLoadingStudents(true);
        try {
            const list = await api.teacherCourseStudents(course.id);
            setStudents(list);
        } finally {
            setLoadingStudents(false);
        }
    };

    if (loading) return <div className="p-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">My Courses</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => openCourse(c)}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-[#2563eb]/30 transition"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#0f2a5f] bg-blue-50 px-2 py-1 rounded">
                                {c.code}
                            </span>
                            <ChevronRight size={18} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-3">{c.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Users size={14} /> {c.enrolled_students}</span>
                            <span className="flex items-center gap-1"><BookOpen size={14} /> {c.credits} cr</span>
                        </div>
                    </div>
                ))}
                {courses.length === 0 && (
                    <div className="col-span-full bg-white rounded-xl p-10 text-center text-gray-400">
                        You have no assigned courses yet
                    </div>
                )}
            </div>

            {selected && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="font-semibold text-[#0f2a5f]">
                                {selected.code} — {selected.title}
                            </h2>
                            <p className="text-xs text-gray-500">Enrolled students</p>
                        </div>
                        <button onClick={() => setSelected(null)} className="text-sm text-gray-500 hover:text-gray-700">
                            Close
                        </button>
                    </div>
                    {loadingStudents ? (
                        <div className="p-6 text-gray-500 text-sm"><Loader2 className="animate-spin inline mr-2" /> Loading students...</div>
                    ) : students.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No students enrolled</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Attendance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.map((s) => (
                                    <tr key={s.student_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-gray-800 font-medium">{s.full_name}</td>
                                        <td className="px-6 py-3 text-gray-600">{s.roll_number}</td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded ${s.attendance_percentage >= 75
                                                        ? 'bg-green-100 text-green-700'
                                                        : s.attendance_percentage >= 50
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {s.attendance_percentage}%
                                            </span>
                                            <span className="ml-2 text-xs text-gray-400">
                                                ({s.present_count}/{s.total_sessions})
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeacherCourses;