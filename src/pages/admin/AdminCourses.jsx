import React, { useEffect, useState } from 'react';
import { BookPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

const emptyForm = {
    code: '',
    title: '',
    description: '',
    credits: 3,
    semester: 1,
    department_id: '',
};

const AdminCourses = () => {
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);

    const refresh = () => {
        api.adminListCourses().then(setCourses).catch(() => { });
        api.adminListDepartments().then(setDepartments).catch(() => { });
    };

    useEffect(refresh, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);
        try {
            await api.adminCreateCourse({
                ...form,
                credits: Number(form.credits),
                semester: Number(form.semester),
                department_id: form.department_id ? Number(form.department_id) : null,
            });
            setSuccess(`Course ${form.code} created!`);
            setForm(emptyForm);
            refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Add Course</h1>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Course Code" name="code" value={form.code} onChange={handleChange} placeholder="CS301" required />
                    <Input label="Title" name="title" value={form.title} onChange={handleChange} placeholder="Artificial Intelligence" required />
                    <Input label="Credits" name="credits" type="number" min="1" max="6" value={form.credits} onChange={handleChange} required />
                    <Input label="Semester" name="semester" type="number" value={form.semester} onChange={handleChange} />

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Department</label>
                        <select
                            name="department_id"
                            value={form.department_id}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb]/30 outline-none"
                        >
                            <option value="">-- None --</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb]/30 outline-none resize-none"
                        />
                    </div>

                    {error && (
                        <div className="md:col-span-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    {success && (
                        <div className="md:col-span-2 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">
                            <CheckCircle2 size={16} /> {success}
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <BookPlus size={16} />}
                            {submitting ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#0f2a5f]">Existing Courses ({courses.length})</h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Credits</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Semester</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-semibold text-[#0f2a5f]">{c.code}</td>
                                <td className="px-6 py-3 text-gray-700">{c.title}</td>
                                <td className="px-6 py-3 text-gray-600">{c.credits}</td>
                                <td className="px-6 py-3 text-gray-600">{c.semester || '—'}</td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-sm">No courses yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div>
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <input
            {...props}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb]/30 outline-none"
        />
    </div>
);

export default AdminCourses;