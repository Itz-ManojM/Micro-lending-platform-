export const STAFF_SESSION_KEY = "mlpStaffSession";
export const STAFF_SESSION_EVENT = "mlp-staff-session-changed";

export function getStoredStaffSession() {
  try {
    const rawValue = window.localStorage.getItem(STAFF_SESSION_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function setStoredStaffSession(session) {
  window.localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(STAFF_SESSION_EVENT));
}

export function clearStoredStaffSession() {
  window.localStorage.removeItem(STAFF_SESSION_KEY);
  window.dispatchEvent(new CustomEvent(STAFF_SESSION_EVENT));
}
