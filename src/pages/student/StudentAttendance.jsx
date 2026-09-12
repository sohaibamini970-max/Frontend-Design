import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

const statusStyles = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    excused: 'bg-blue-100 text-blue-700',
};

const StudentAttendance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.studentAttendance().then(setData).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;
    if (!data) return <div className="p-8 text-gray-500">Failed to load attendance</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">My Attendance</h1>

            {/* Summary by course */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.summary.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#0f2a5f]">{s.course_code}</span>
                            <span
                                className={`text-sm font-bold ${s.percentage >= 75 ? 'text-green-600' :
                                        s.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                                    }`}
                            >
                                {s.percentage}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{s.course_title}</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${s.percentage >= 75 ? 'bg-green-500' :
                                        s.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${s.percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{s.present} / {s.total} sessions</p>
                    </div>
                ))}
            </div>

            {/* Session-by-session records */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#0f2a5f]">Attendance Records</h2>
                </div>
                {data.records.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No records yet</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Topic</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.records.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 text-sm text-gray-600">{r.session_date}</td>
                                    <td className="px-6 py-3 text-sm">
                                        <span className="font-semibold text-[#0f2a5f]">{r.course_code}</span> — {r.course_title}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-600">{r.topic || '—'}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${statusStyles[r.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {r.status}
                                        </span>
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

export default StudentAttendance;