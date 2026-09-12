// Strip trailing slash so we never build "//api/..." URLs
const API_URL = "https://backend-design.vercel.app".replace(/\/+$/, "");

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
};