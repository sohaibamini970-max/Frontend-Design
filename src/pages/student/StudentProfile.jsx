import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

const StudentProfile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.studentProfile().then(setData).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;
    if (!data) return <div className="p-8 text-gray-500">Failed to load profile</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">My Profile</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#0f2a5f] text-white flex items-center justify-center text-3xl font-bold">
                        {data.full_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{data.full_name}</h2>
                        <p className="text-gray-500">Roll No: {data.roll_number}</p>
                        <p className="text-gray-400 text-sm">{data.email}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Info label="Email" value={data.email} />
                    <Info label="Phone" value={data.phone || '—'} />
                    <Info label="Department" value={data.department?.name || '—'} />
                    <Info label="Batch Year" value={data.batch_year} />
                    <Info label="Current Semester" value={data.current_semester} />
                    <Info label="CGPA" value={data.cgpa.toFixed(2)} />
                </div>
            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div>
        <p className="text-xs uppercase text-gray-400 font-semibold">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
    </div>
);

export default StudentProfile;