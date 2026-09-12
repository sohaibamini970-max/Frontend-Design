// Strip trailing slash so we never build "//api/..." URLs
// Strip trailing slash so we never build "//api/..." URLs
export const API_URL = "https://backend-design.vercel.app".replace(/\/+$/, "");

// Build auth headers from stored token
const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Shared error handler — parses FastAPI {detail: ...} responses
const handleError = async (res, fallback) => {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || fallback);
};

export const api = {
    // =========================================================
    // AUTH
    // =========================================================
    async login(email, password) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) await handleError(res, "Login failed");
        return res.json();
    },

    async me(token) {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Session expired");
        return res.json();
    },

    getToken() {
        return localStorage.getItem("token");
    },
    setToken(t) {
        localStorage.setItem("token", t);
    },
    clearToken() {
        localStorage.removeItem("token");
    },

    // =========================================================
    // ADMIN — Users
    // =========================================================
    async adminListUsers() {
        const res = await fetch(`${API_URL}/api/admin/users`, {
            headers: authHeaders(),
        });
        if (!res.ok) await handleError(res, "Failed to load users");
        return res.json();
    },

    async adminListStudents() {
        const users = await api.adminListUsers();
        return users.filter((u) => u.role === "student");
    },

    async adminListTeachers() {
        const users = await api.adminListUsers();
        return users.filter((u) => u.role === "teacher");
    },

    // =========================================================
    // ADMIN — Create Student
    // =========================================================
    async adminCreateStudent(data) {
        const res = await fetch(`${API_URL}/api/admin/students`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) await handleError(res, "Failed to create student");
        return res.json();
    },

    // =========================================================
    // ADMIN — Create Teacher
    // =========================================================
    async adminCreateTeacher(data) {
        const res = await fetch(`${API_URL}/api/admin/teachers`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) await handleError(res, "Failed to create teacher");
        return res.json();
    },

    // =========================================================
    // ADMIN — Courses
    // =========================================================
    async adminListCourses() {
        const res = await fetch(`${API_URL}/api/admin/courses`, {
            headers: authHeaders(),
        });
        if (!res.ok) await handleError(res, "Failed to load courses");
        return res.json();
    },

    async adminCreateCourse(data) {
        const res = await fetch(`${API_URL}/api/admin/courses`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) await handleError(res, "Failed to create course");
        return res.json();
    },

    // =========================================================
    // ADMIN — Departments
    // =========================================================
    async adminListDepartments() {
        const res = await fetch(`${API_URL}/api/admin/departments`, {
            headers: authHeaders(),
        });
        if (!res.ok) await handleError(res, "Failed to load departments");
        return res.json();
    },

    // =========================================================
    // ADMIN — Assign Teacher to Course
    // =========================================================
    async adminAssignTeacher(teacher_id, course_id) {
        const res = await fetch(`${API_URL}/api/admin/assign-teacher`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ teacher_id, course_id }),
        });
        if (!res.ok) await handleError(res, "Failed to assign teacher");
        return res.json();
    },

    // =========================================================
    // ADMIN — Update / Delete
    // =========================================================
    async adminUpdateStudent(user_id, data) {
        const res = await fetch(`${API_URL}/api/admin/students/${user_id}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) await handleError(res, "Failed to update student");
        return res.json();
    },

    async adminUpdateTeacher(user_id, data) {
        const res = await fetch(`${API_URL}/api/admin/teachers/${user_id}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) await handleError(res, "Failed to update teacher");
        return res.json();
    },

    async adminDeleteUser(user_id) {
        const res = await fetch(`${API_URL}/api/admin/users/${user_id}`, {
            method: "DELETE",
            headers: authHeaders(),
        });
        if (!res.ok) await handleError(res, "Failed to delete user");
        return res.json();
    },

    // =========================================================
    // TEACHER
    // =========================================================
    async teacherDashboard() {
        const res = await fetch(`${API_URL}/api/teacher/dashboard`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load dashboard");
        return res.json();
    },

    async teacherCourses() {
        const res = await fetch(`${API_URL}/api/teacher/courses`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load courses");
        return res.json();
    },

    async teacherCourseStudents(courseId) {
        const res = await fetch(`${API_URL}/api/teacher/courses/${courseId}/students`, {
            headers: authHeaders(),
        });
        if (!res.ok) await handleError(res, "Failed to load students");
        return res.json();
    },

    async teacherTimetable() {
        const res = await fetch(`${API_URL}/api/teacher/timetable`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load timetable");
        return res.json();
    },

    async teacherAttendanceSessions() {
        const res = await fetch(`${API_URL}/api/teacher/attendance/sessions`, {
            headers: authHeaders(),
        });
        if (!res.ok) await handleError(res, "Failed to load sessions");
        return res.json();
    },

    async teacherCreateSession(data) {
        const res = await fetch(`${API_URL}/api/teacher/attendance/sessions`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) await handleError(res, "Failed to create session");
        return res.json();
    },

    async teacherMarkAttendance(sessionId, records) {
        const res = await fetch(`${API_URL}/api/teacher/attendance/sessions/${sessionId}/mark`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ records }),
        });
        if (!res.ok) await handleError(res, "Failed to save attendance");
        return res.json();
    },

    async teacherAnnouncements() {
        const res = await fetch(`${API_URL}/api/teacher/announcements`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load announcements");
        return res.json();
    },

    // =========================================================
    // STUDENT
    // =========================================================
    async studentDashboard() {
        const res = await fetch(`${API_URL}/api/student/dashboard`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load dashboard");
        return res.json();
    },

    async studentCourses() {
        const res = await fetch(`${API_URL}/api/student/courses`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load courses");
        return res.json();
    },

    async studentAttendance() {
        const res = await fetch(`${API_URL}/api/student/attendance`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load attendance");
        return res.json();
    },

    async studentTimetable() {
        const res = await fetch(`${API_URL}/api/student/timetable`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load timetable");
        return res.json();
    },

    async studentAnnouncements() {
        const res = await fetch(`${API_URL}/api/student/announcements`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load announcements");
        return res.json();
    },

    async studentProfile() {
        const res = await fetch(`${API_URL}/api/student/profile`, { headers: authHeaders() });
        if (!res.ok) await handleError(res, "Failed to load profile");
        return res.json();
    },
    // =========================================================
    // CHAT (role-aware AI agent)
    // =========================================================
    async chat(message) {
        const res = await fetch(`${API_URL}/api/chat/`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ message }),
        });
        if (!res.ok) await handleError(res, "Chat failed");
        return res.json();
    },

    async chatHistory() {
        const res = await fetch(`${API_URL}/api/chat/history`, {
            headers: authHeaders(),
        });
        if (!res.ok) await handleError(res, "Failed to load chat history");
        return res.json();
    },
};
