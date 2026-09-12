import React, { useEffect, useState } from 'react';
import { CalendarPlus, Check, X, Loader2, Save, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

const TeacherAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // New session form
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        course_id: '',
        session_date: new Date().toISOString().split('T')[0],
        topic: '',
    });
    const [creating, setCreating] = useState(false);

    // Marking mode
    const [marking, setMarking] = useState(null); // { session, students }
    const [marks, setMarks] = useState({});       // { student_id: status }
    const [saving, setSaving] = useState(false);

    const refresh = async () => {
        setLoading(true);
        try {
            const [c, s] = await Promise.all([api.teacherCourses(), api.teacherAttendanceSessions()]);
            setCourses(c);
            setSessions(s);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { refresh(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        setCreating(true);
        try {
            const created = await api.teacherCreateSession({
                course_id: Number(form.course_id),
                session_date: form.session_date,
                topic: form.topic || null,
            });
            setShowForm(false);
            setForm({ course_id: '', session_date: new Date().toISOString().split('T')[0], topic: '' });
            await refresh();
            // Open marking view immediately
            await openMarking(created.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setCreating(false);
        }
    };

    const openMarking = async (sessionId) => {
        const session = sessions.find((s) => s.id === sessionId)
            || (await api.teacherAttendanceSessions()).find((s) => s.id === sessionId);
        // Fetch the course students
        const courseId = session?.course_id || form.course_id;
        if (!courseId) return;
        // Need course_id — fetch from session if we have it
        // Our session summary API doesn't return course_id, so find it from courses list
        const sessFull = { ...session };
        // Find course via code match
        const course = courses.find((c) => c.code === session?.course_code);
        if (!course) return;

        const students = await api.teacherCourseStudents(course.id);
        const initial = {};
        students.forEach((s) => { initial[s.student_id] = 'absent'; });
        setMarks(initial);
        setMarking({ session: sessFull, students, courseId: course.id });
    };

    const toggle = (student_id) => {
        setMarks((prev) => ({
            ...prev,
            [student_id]: prev[student_id] === 'present' ? 'absent' : 'present',
        }));
    };

    const saveAttendance = async () => {
        if (!marking) return;
        setSaving(true);
        setError('');
        try {
            const records = Object.entries(marks).map(([sid, status]) => ({
                student_id: Number(sid),
                status,
            }));
            await api.teacherMarkAttendance(marking.session.id, records);
            setMarking(null);
            setMarks({});
            await refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#0f2a5f]">Attendance</h1>
                <button
                    onClick={() => setShowForm((v) => !v)}
                    className="flex items-center gap-2 bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold px-5 py-2.5 rounded-lg transition"
                >
                    <CalendarPlus size={16} /> New Session
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* New session form */}
            {showForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Course</label>
                            <select
                                required
                                value={form.course_id}
                                onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb]/30 outline-none"
                            >
                                <option value="">-- Select --</option>
                                {courses.map((c) => (
                                    <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Date</label>
                            <input
                                type="date"
                                required
                                value={form.session_date}
                                onChange={(e) => setForm({ ...form, session_date: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb]/30 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Topic (optional)</label>
                            <input
                                value={form.topic}
                                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                placeholder="e.g. Introduction to AI"
                                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb]/30 outline-none"
                            />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={creating}
                                className="flex items-center gap-2 bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-60"
                            >
                                {creating ? <Loader2 size={16} className="animate-spin" /> : <CalendarPlus size={16} />}
                                {creating ? 'Creating...' : 'Create & Mark'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Marking UI */}
            {marking && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-[#0f2a5f]">
                                Marking: {marking.session.course_code} — {marking.session.session_date}
                            </h2>
                            <p className="text-xs text-gray-500">{marking.students.length} students</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setMarking(null)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAttendance}
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#0f2a5f] hover:bg-[#2563eb] text-white text-sm font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {marking.students.map((s) => (
                                <tr key={s.student_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 text-gray-800 font-medium">{s.full_name}</td>
                                    <td className="px-6 py-3 text-gray-600">{s.roll_number}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => toggle(s.student_id)}
                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${marks[s.student_id] === 'present'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                        >
                                            {marks[s.student_id] === 'present' ? <Check size={12} /> : <X size={12} />}
                                            {marks[s.student_id] === 'present' ? 'Present' : 'Absent'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Existing sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#0f2a5f]">Past Sessions</h2>
                </div>
                {sessions.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No sessions yet</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Topic</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Present</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sessions.map((s) => (
                                <tr key={s.id}>
                                    <td className="px-6 py-3 text-gray-600 text-sm">{s.session_date}</td>
                                    <td className="px-6 py-3 text-sm">
                                        <span className="font-semibold text-[#0f2a5f]">{s.course_code}</span> — {s.course_title}
                                    </td>
                                    <td className="px-6 py-3 text-gray-600 text-sm">{s.topic || '—'}</td>
                                    <td className="px-6 py-3 text-gray-600 text-sm">{s.present} / {s.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TeacherAttendance;