// src/utils/restoreSession.js
import { jwtDecode } from "jwt-decode";
import { userLoggedIn, userLoggedOut } from "../Api/Auth/AuthSlice";

const API_BASE = "http://localhost:8000/api/v1";

export async function restoreSession(store) {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  try {
    const decoded = jwtDecode(token);
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      store.dispatch(userLoggedOut());
      return;
    }
    const resp = await fetch(`${API_BASE}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (resp.ok) {
      const data = await resp.json();
      const user = data?.data ?? data;
      store.dispatch(userLoggedIn({ user, token }));
    } else {
      store.dispatch(userLoggedOut());
      localStorage.removeItem("accessToken");
    }
  } catch (err) {
    console.error("restoreSession error:", err);
    store.dispatch(userLoggedOut());
    localStorage.removeItem("accessToken");
  }
}
