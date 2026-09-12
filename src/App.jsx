import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import TeacherRoute from './components/TeacherRoute';
import StudentRoute from './components/StudentRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';

// ---- Admin pages ----
import AdminStudents from './pages/admin/AdminStudents';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminManage from './pages/admin/AdminManage';

// ---- Teacher pages ----
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherCourses from './pages/teacher/TeacherCourses';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherTimetable from './pages/teacher/TeacherTimetable';
import TeacherAnnouncements from './pages/teacher/TeacherAnnouncements';

// ---- Student pages ----
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentCourses from './pages/student/StudentCourses';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentAnnouncements from './pages/student/StudentAnnouncements';

const RootRedirect = () => {
    const { user, loading } = useAuth();
    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/manage" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    return <Navigate to="/" replace />;
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
                        {/* ============ STUDENT ROUTES (default for '/') ============ */}
                        <Route
                            index
                            element={
                                <StudentRoute>
                                    <StudentDashboard />
                                </StudentRoute>
                            }
                        />
                        <Route
                            path="profile"
                            element={
                                <StudentRoute>
                                    <StudentProfile />
                                </StudentRoute>
                            }
                        />
                        <Route
                            path="courses"
                            element={
                                <StudentRoute>
                                    <StudentCourses />
                                </StudentRoute>
                            }
                        />
                        <Route
                            path="attendance"
                            element={
                                <StudentRoute>
                                    <StudentAttendance />
                                </StudentRoute>
                            }
                        />
                        <Route
                            path="timetable"
                            element={
                                <StudentRoute>
                                    <StudentTimetable />
                                </StudentRoute>
                            }
                        />
                        <Route
                            path="announcements"
                            element={
                                <StudentRoute>
                                    <StudentAnnouncements />
                                </StudentRoute>
                            }
                        />

                        {/* ============ TEACHER ROUTES ============ */}
                        <Route
                            path="teacher"
                            element={
                                <TeacherRoute>
                                    <TeacherDashboard />
                                </TeacherRoute>
                            }
                        />
                        <Route
                            path="teacher/profile"
                            element={
                                <TeacherRoute>
                                    <TeacherProfile />
                                </TeacherRoute>
                            }
                        />
                        <Route
                            path="teacher/courses"
                            element={
                                <TeacherRoute>
                                    <TeacherCourses />
                                </TeacherRoute>
                            }
                        />
                        <Route
                            path="teacher/attendance"
                            element={
                                <TeacherRoute>
                                    <TeacherAttendance />
                                </TeacherRoute>
                            }
                        />
                        <Route
                            path="teacher/timetable"
                            element={
                                <TeacherRoute>
                                    <TeacherTimetable />
                                </TeacherRoute>
                            }
                        />
                        <Route
                            path="teacher/announcements"
                            element={
                                <TeacherRoute>
                                    <TeacherAnnouncements />
                                </TeacherRoute>
                            }
                        />

                        {/* ============ ADMIN ROUTES ============ */}
                        <Route
                            path="admin/manage"
                            element={
                                <AdminRoute>
                                    <AdminManage />
                                </AdminRoute>
                            }
                        />
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
                    </Route>

                    <Route path="*" element={<RootRedirect />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;