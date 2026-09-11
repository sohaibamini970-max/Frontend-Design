import React from 'react';

const attendanceData = [
    { date: '2024-05-20', code: 'CS301', name: 'Artificial Intelligence', status: 'Present' },
    { date: '2024-05-19', code: 'CS302', name: 'Web Development', status: 'Present' },
    { date: '2024-05-18', code: 'CS305', name: 'Database Systems', status: 'Absent' },
    { date: '2024-05-17', code: 'CS301', name: 'Artificial Intelligence', status: 'Present' },
    { date: '2024-05-16', code: 'CS308', name: 'Software Engineering', status: 'Present' },
];

const statusStyles = {
    Present: 'bg-green-100 text-green-700',
    Absent: 'bg-red-100 text-red-700',
};

const Attendance = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Attendance Record</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Course Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {attendanceData.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-gray-700">{row.date}</td>
                                <td className="px-6 py-4 font-semibold text-[#0f2a5f]">{row.code}</td>
                                <td className="px-6 py-4 text-gray-700">{row.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[row.status]}`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;