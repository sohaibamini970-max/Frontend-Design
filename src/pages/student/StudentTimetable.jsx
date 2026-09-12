import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const StudentTimetable = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.studentTimetable().then(setSlots).finally(() => setLoading(false));
    }, []);

    const byDay = DAYS.reduce((acc, d) => {
        acc[d] = slots.filter((s) => s.day_of_week === d);
        return acc;
    }, {});

    if (loading) return <div className="p-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">My Timetable</h1>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {DAYS.map((d) => (
                    <div key={d} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-[#0f2a5f] text-white text-center py-2 text-sm font-semibold capitalize">
                            {d}
                        </div>
                        <div className="p-3 space-y-2 min-h-[120px]">
                            {byDay[d].length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-6">No classes</p>
                            ) : (
                                byDay[d].map((s) => (
                                    <div key={s.id} className="bg-blue-50 border-l-4 border-[#2563eb] rounded p-2">
                                        <p className="text-xs font-bold text-[#0f2a5f]">{s.course_code}</p>
                                        <p className="text-xs text-gray-600">{s.start_time} – {s.end_time}</p>
                                        <p className="text-xs text-gray-400">{s.room || '—'}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{s.teacher_name}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentTimetable;