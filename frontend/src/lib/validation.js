// ─── Email ────────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value) {
  if (!value || !value.trim()) return "Email is required.";
  if (!EMAIL_RE.test(value.trim())) return "Please enter a valid email address.";
  if (value.length > 254) return "Email cannot exceed 254 characters.";
  return null;
}

// ─── Password ─────────────────────────────────────────────────────────────────
export function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (value.length > 128) return "Password cannot exceed 128 characters.";
  return null;
}

// ─── Name ─────────────────────────────────────────────────────────────────────
export function validateName(value, label = "Name") {
  if (!value || !value.trim()) return `${label} is required.`;
  if (value.trim().length < 2) return `${label} must be at least 2 characters.`;
  if (value.trim().length > 50) return `${label} cannot exceed 50 characters.`;
  return null;
}

// ─── Phone ────────────────────────────────────────────────────────────────────
// Accepts optional country code, spaces, dashes, dots, and parentheses.
// Examples: +91 98765 43210 | (555) 123-4567 | +1-800-555-0199
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

export function validatePhone(value) {
  if (!value || !value.trim()) return null; // phone is optional
  const cleaned = value.trim();
  if (!PHONE_RE.test(cleaned)) return "Please enter a valid phone number (digits, spaces, +, -, parentheses).";
  if (cleaned.replace(/\D/g, "").length < 7) return "Phone number must have at least 7 digits.";
  return null;
}

// ─── Generic short text field ─────────────────────────────────────────────────
export function validateMaxLength(value, max, label) {
  if (!value || !value.trim()) return null; // optional fields
  if (value.trim().length > max) return `${label} cannot exceed ${max} characters.`;
  return null;
}
