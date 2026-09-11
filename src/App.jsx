import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Courses from './pages/Courses';
import Announcements from './pages/Announcements';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="timetable" element={<Timetable />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="announcements" element={<Announcements />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;