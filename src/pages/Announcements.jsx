import React from 'react';

const announcements = [
    {
        title: 'Midterm Exam Schedule Released',
        date: 'May 20, 2024',
        desc: 'The midterm exams for the Spring semester will begin on June 1st. Please check the exam portal for your specific schedule.',
    },
    {
        title: 'Guest Lecture: AI in Healthcare',
        date: 'May 18, 2024',
        desc: 'Join us this Friday in the main auditorium for a special guest lecture by Dr. Sarah Connor on the applications of AI in modern healthcare.',
    },
    {
        title: 'Library Extended Hours',
        date: 'May 15, 2024',
        desc: 'The university library will remain open until 2:00 AM during the examination period.',
    },
];

const Announcements = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Announcements</h1>

            <div className="space-y-4">
                {announcements.map((a, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-[#2563eb]"
                    >
                        <h3 className="text-[#0f2a5f] font-bold mb-1">{a.title}</h3>
                        <span className="text-xs text-gray-500 block mb-3">{a.date}</span>
                        <p className="text-gray-600 leading-relaxed">{a.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;