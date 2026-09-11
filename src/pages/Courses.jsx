import React from 'react';

const courses = [
    { code: 'CS301', title: 'Artificial Intelligence', inst: 'Dr. Smith', credits: 4, progress: 75 },
    { code: 'CS302', title: 'Web Development', inst: 'Prof. Johnson', credits: 3, progress: 60 },
    { code: 'CS305', title: 'Database Systems', inst: 'Dr. Lee', credits: 4, progress: 85 },
    { code: 'CS308', title: 'Software Engineering', inst: 'Prof. Davis', credits: 3, progress: 40 },
];

const Courses = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">My Courses</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Course Title</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Instructor</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Credits</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.map((c) => (
                            <tr key={c.code} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-semibold text-[#0f2a5f]">{c.code}</td>
                                <td className="px-6 py-4 text-gray-700">{c.title}</td>
                                <td className="px-6 py-4 text-gray-700">{c.inst}</td>
                                <td className="px-6 py-4 text-gray-700">{c.credits}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#2563eb] rounded-full"
                                                style={{ width: `${c.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">{c.progress}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Courses;