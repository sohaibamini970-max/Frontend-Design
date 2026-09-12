import React, { useEffect, useState } from 'react';
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

const emptyForm = {
    email: '',
    password: '',
    full_name: '',
    phone: '',
    employee_code: '',
    designation: 'Lecturer',
    department_id: '',
};

const AdminTeachers = () => {
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        api.adminListTeachers().then(setTeachers).catch(() => { });
        api.adminListDepartments().then(setDepartments).catch(() => { });
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);
        try {
            await api.adminCreateTeacher({
                ...form,
                department_id: form.department_id ? Number(form.department_id) : null,
            });
            setSuccess(`Teacher ${form.full_name} created!`);
            setForm(emptyForm);
            const updated = await api.adminListTeachers();
            setTeachers(updated);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Add Teacher</h1>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required />
                    <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                    <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
                    <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />

                    <Input label="Employee Code" name="employee_code" value={form.employee_code} onChange={handleChange} required />

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Designation</label>
                        <select
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563eb]/30 outline-none"
                        >
                            <option>Lecturer</option>
                            <option>Assistant Professor</option>
                            <option>Associate Professor</option>
                            <option>Professor</option>
                        </select>
                    </div>

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
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                            {submitting ? 'Creating...' : 'Create Teacher'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#0f2a5f]">Existing Teachers ({teachers.length})</h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Employee Code</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Designation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {teachers.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{t.full_name}</td>
                                <td className="px-6 py-3 text-gray-600">{t.email}</td>
                                <td className="px-6 py-3 text-gray-600">{t.teacher?.employee_code || '—'}</td>
                                <td className="px-6 py-3 text-gray-600">{t.teacher?.designation || '—'}</td>
                            </tr>
                        ))}
                        {teachers.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-sm">No teachers yet</td></tr>
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

export default AdminTeachers;