import React, { useEffect, useState } from 'react';
import { Megaphone, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

const StudentAnnouncements = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.studentAnnouncements().then(setItems).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#0f2a5f]">Announcements</h1>
            {items.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-400">
                    <Megaphone size={32} className="mx-auto mb-2 opacity-50" />
                    No announcements yet
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((a) => (
                        <div
                            key={a.id}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-[#2563eb]"
                        >
                            <h3 className="text-[#0f2a5f] font-bold mb-1">{a.title}</h3>
                            <span className="text-xs text-gray-500 block mb-3">
                                {a.published_at ? new Date(a.published_at).toLocaleDateString() : ''}
                            </span>
                            <p className="text-gray-600 leading-relaxed">{a.body}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentAnnouncements;