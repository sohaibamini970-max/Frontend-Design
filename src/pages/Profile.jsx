import React from 'react';

const Profile = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Student Profile</h1>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#0f2a5f] text-white flex items-center justify-center text-3xl font-bold">
                        AH
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Ahmed Hassan</h2>
                        <p className="text-gray-500">Computer Science Major — Year 3</p>
                        <p className="text-gray-500 text-sm">ID: UNI-2024-8842</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs uppercase text-gray-400 font-semibold">Email</label>
                        <p className="text-gray-800 font-medium">ahmed.h@university.edu</p>
                    </div>
                    <div>
                        <label className="text-xs uppercase text-gray-400 font-semibold">Phone</label>
                        <p className="text-gray-800 font-medium">+1 (555) 123-4567</p>
                    </div>
                    <div>
                        <label className="text-xs uppercase text-gray-400 font-semibold">Department</label>
                        <p className="text-gray-800 font-medium">Computer Science</p>
                    </div>
                    <div>
                        <label className="text-xs uppercase text-gray-400 font-semibold">Enrollment Year</label>
                        <p className="text-gray-800 font-medium">2022</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;