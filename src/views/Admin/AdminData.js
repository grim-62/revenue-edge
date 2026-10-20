export const C = {
  ink: "#001022",
  blue: "#BCD0FF",
  light: "#E8F0FF",
  tint: "#F1F6FF",
  hover: "#0B3D91",
  muted: "#475569",
  border: "#E2E8F0",
};

export const ROLE_STATUS = {
  open: { label: "Open", cls: "bg-emerald-50 text-emerald-700" },
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-600" },
  closed: { label: "Closed", cls: "bg-rose-50 text-rose-700" },
};

export const APP_STATUS = {
  new: { label: "New", cls: "bg-[#E8F0FF] text-[#0B3D91]" },
  reviewing: { label: "Reviewing", cls: "bg-amber-50 text-amber-700" },
  interview: { label: "Interview", cls: "bg-indigo-50 text-indigo-700" },
  hired: { label: "Hired", cls: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", cls: "bg-rose-50 text-rose-700" },
};

export const REVIEW_STATUS = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700" },
  published: { label: "Published", cls: "bg-emerald-50 text-emerald-700" },
  hidden: { label: "Hidden", cls: "bg-slate-100 text-slate-600" },
};

export const inputCls =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-slate-400 focus:border-[#0B3D91] focus:shadow-[0_0_0_4px_rgba(188,208,255,0.55)]";

export const fmtDate = (date) => (date
  ? new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
  : "");
export const uid = () => `id${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const initials = (name = "") => name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();