import React from 'react';
import { useAuth } from '../../context/AuthContext';

const TeacherProfile = () => {
    const { user } = useAuth();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">My Profile</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#0f2a5f] text-white flex items-center justify-center text-3xl font-bold">
                        {user?.full_name?.charAt(0) || 'T'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{user?.full_name}</h2>
                        <p className="text-gray-500 capitalize">{user?.role}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Info label="Email" value={user?.email} />
                    <Info label="Phone" value={user?.phone || '—'} />
                    <Info label="Role" value={user?.role} />
                    <Info label="Status" value={user?.is_active ? 'Active' : 'Inactive'} />
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

export default TeacherProfile;