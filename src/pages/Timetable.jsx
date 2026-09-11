import React from 'react';

const schedule = [
    {
        time: '09:00 - 10:30',
        days: ['AI Fundamentals (Room 401)', 'Web Dev (Lab 2)', 'AI Fundamentals (Room 401)', 'Web Dev (Lab 2)', 'Self Study'],
    },
    {
        time: '11:00 - 12:30',
        days: ['Database Systems (Room 202)', 'Software Eng. (Room 105)', 'Database Systems (Room 202)', 'Software Eng. (Room 105)', 'Lab Work'],
    },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Timetable = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Weekly Timetable</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Time</th>
                            {days.map((d) => (
                                <th key={d} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{d}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {schedule.map((row, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4 font-semibold text-[#0f2a5f] whitespace-nowrap">{row.time}</td>
                                {row.days.map((cell, j) => (
                                    <td key={j} className="px-6 py-4 text-sm text-gray-700">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Timetable;