import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/protectedRoute';
import Layout from './components/layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Courses from './pages/Courses';
import Announcements from './pages/Announcements';

import AdminRoute from './components/AdminRoute';
import AdminStudents from './pages/admin/AdminStudents';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminManage from './pages/admin/AdminManage';

const RootRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return <Navigate to={user ? '/' : '/login'} replace />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Common routes */}
                        <Route index element={<Dashboard />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="attendance" element={<Attendance />} />
                        <Route path="timetable" element={<Timetable />} />
                        <Route path="courses" element={<Courses />} />
                        <Route path="announcements" element={<Announcements />} />

                        {/* 🔒 Admin-only routes */}
                        <Route
                            path="admin/students"
                            element={
                                <AdminRoute>
                                    <AdminStudents />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="admin/teachers"
                            element={
                                <AdminRoute>
                                    <AdminTeachers />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="admin/courses"
                            element={
                                <AdminRoute>
                                    <AdminCourses />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="admin/manage"
                            element={
                                <AdminRoute>
                                    <AdminManage />
                                </AdminRoute>
                            }
                        />
                    </Route>

                    <Route path="*" element={<RootRedirect />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;