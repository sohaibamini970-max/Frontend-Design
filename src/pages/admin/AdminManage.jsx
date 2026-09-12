import React, { useEffect, useState } from 'react';
import { Loader2, Pencil, Trash2, X, Check, AlertCircle, Users } from 'lucide-react';
import { api } from '../../lib/api';

const AdminManage = () => {
    const [tab, setTab] = useState('students'); // 'students' | 'teachers'
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Edit modal state
    const [editing, setEditing] = useState(null); // { user, type }
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [s, t] = await Promise.all([
                api.adminListStudents(),
                api.adminListTeachers(),
            ]);
            setStudents(s);
            setTeachers(t);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    const startEdit = (user, type) => {
        setEditing({ user, type });
        setForm({
            full_name: user.full_name,
            phone: user.phone || '',
            password: '',
            ...(type === 'student' && {
                roll_number: user.student?.roll_number || '',
                department_id: user.student?.department_id || '',
                batch_year: user.student?.batch_year || '',
                current_semester: user.student?.current_semester || '',
                cgpa: user.student?.cgpa || '',
            }),
            ...(type === 'teacher' && {
                employee_code: user.teacher?.employee_code || '',
                department_id: user.teacher?.department_id || '',
                designation: user.teacher?.designation || '',
            }),
        });
    };

    const cancelEdit = () => {
        setEditing(null);
        setForm({});
    };

    const saveEdit = async () => {
        if (!editing) return;
        setSaving(true);
        setError('');
        try {
            const { user, type } = editing;
            const payload = { ...form };
            // Strip empty password so we don't overwrite with blank
            if (!payload.password) delete payload.password;
            // Convert numeric fields
            if (type === 'student') {
                if (payload.department_id === '') delete payload.department_id;
                else if (payload.department_id) payload.department_id = Number(payload.department_id);
                if (payload.batch_year) payload.batch_year = Number(payload.batch_year);
                if (payload.current_semester) payload.current_semester = Number(payload.current_semester);
                if (payload.cgpa) payload.cgpa = Number(payload.cgpa);
                await api.adminUpdateStudent(user.id, payload);
            } else {
                if (payload.department_id === '') delete payload.department_id;
                else if (payload.department_id) payload.department_id = Number(payload.department_id);
                await api.adminUpdateTeacher(user.id, payload);
            }
            cancelEdit();
            await loadAll();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user) => {
        const ok = window.confirm(
            `Delete ${user.full_name} (${user.email})?\n\nThis cannot be undone.`
        );
        if (!ok) return;
        try {
            await api.adminDeleteUser(user.id);
            await loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    const list = tab === 'students' ? students : teachers;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Manage Users</h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setTab('students')}
                    className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition ${tab === 'students'
                            ? 'bg-[#0f2a5f] text-white'
                            : 'text-gray-500 hover:text-[#0f2a5f]'
                        }`}
                >
                    Students ({students.length})
                </button>
                <button
                    onClick={() => setTab('teachers')}
                    className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition ${tab === 'teachers'
                            ? 'bg-[#0f2a5f] text-white'
                            : 'text-gray-500 hover:text-[#0f2a5f]'
                        }`}
                >
                    Teachers ({teachers.length})
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 flex items-center justify-center text-gray-500">
                        <Loader2 size={20} className="animate-spin mr-2" /> Loading...
                    </div>
                ) : list.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                        <Users size={32} className="mx-auto mb-2 opacity-50" />
                        No {tab} yet
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                                {tab === 'students' && (
                                    <>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Batch</th>
                                    </>
                                )}
                                {tab === 'teachers' && (
                                    <>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Employee Code</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Designation</th>
                                    </>
                                )}
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {list.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-medium text-gray-800">{u.full_name}</td>
                                    <td className="px-6 py-3 text-gray-600">{u.email}</td>
                                    {tab === 'students' && (
                                        <>
                                            <td className="px-6 py-3 text-gray-600">{u.student?.roll_number || '—'}</td>
                                            <td className="px-6 py-3 text-gray-600">{u.student?.batch_year || '—'}</td>
                                        </>
                                    )}
                                    {tab === 'teachers' && (
                                        <>
                                            <td className="px-6 py-3 text-gray-600">{u.teacher?.employee_code || '—'}</td>
                                            <td className="px-6 py-3 text-gray-600">{u.teacher?.designation || '—'}</td>
                                        </>
                                    )}
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => startEdit(u, tab === 'students' ? 'student' : 'teacher')}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition mr-2"
                                        >
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u)}
                                            className="inline-flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            {editing && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={cancelEdit}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-[#0f2a5f]">
                                Edit {editing.type === 'student' ? 'Student' : 'Teacher'}
                            </h3>
                            <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
                            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                            <Field
                                label="New Password (leave blank to keep)"
                                type="password"
                                value={form.password}
                                onChange={(v) => setForm({ ...form, password: v })}
                            />

                            {editing.type === 'student' && (
                                <>
                                    <Field label="Roll Number" value={form.roll_number} onChange={(v) => setForm({ ...form, roll_number: v })} />
                                    <Field label="Batch Year" type="number" value={form.batch_year} onChange={(v) => setForm({ ...form, batch_year: v })} />
                                    <Field label="Current Semester" type="number" value={form.current_semester} onChange={(v) => setForm({ ...form, current_semester: v })} />
                                    <Field label="CGPA" type="number" step="0.01" value={form.cgpa} onChange={(v) => setForm({ ...form, cgpa: v })} />
                                </>
                            )}

                            {editing.type === 'teacher' && (
                                <>
                                    <Field label="Employee Code" value={form.employee_code} onChange={(v) => setForm({ ...form, employee_code: v })} />
                                    <Field label="Designation" value={form.designation} onChange={(v) => setForm({ ...form, designation: v })} />
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                            <button
                                onClick={cancelEdit}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0f2a5f] hover:bg-[#2563eb] text-white text-sm font-semibold transition disabled:opacity-60"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Field = ({ label, value, onChange, type = 'text', step }) => (
    <div>
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <input
            type={type}
            step={step}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb]/30 outline-none"
        />
    </div>
);

export default AdminManage;