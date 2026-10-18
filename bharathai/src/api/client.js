import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 25000,
});

export function getErrorMessage(error, fallback = "Unable to load data.") {
  return (
    error?.response?.data?.error?.message ||
    error?.message ||
    fallback
  );
}

export async function getJson(path, params) {
  const { data } = await api.get(path, { params });
  return data;
}

export async function postJson(path, body) {
  const { data } = await api.post(path, body);
  return data;
}

export function inr(value) {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function getSessionId() {
  const key = "bharatkisan-session";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(key, created);
  return created;
}
