const API_URL = "https://backend-design.vercel.app/";

export const api = {
    async login(email, password) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Login failed");
        }
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
};