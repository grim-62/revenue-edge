import { useEffect, useState } from "react";
import { C, inputCls, ROLE_STATUS } from "./AdminData";

const ICON_PATHS = {
  home: <path d="M4 11l8-7 8 7M6 10v10h12V10" />,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  star: <path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.2l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4" />,
  check: <path d="M5 13l4 4 10-10" />,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a16 16 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.2 0 2.3-.2 3.3-.6" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  external: <><path d="M14 3h7v7M10 14 21 3" /><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 8 9 6 9-6" /></>,
  logout: <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 8l4 4-4 4M20 12H9" />,
};

export function AdminIcon({ name, className = "h-5 w-5", filled = false }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

export function Badge({ map, value }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${map[value]?.cls ?? ""}`}>{map[value]?.label ?? value}</span>;
}

export function Stars({ value }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => <AdminIcon key={star} name="star" filled={star <= value} className={`h-4 w-4 ${star <= value ? "text-[#F5B301]" : "text-slate-200"}`} />)}
    </span>
  );
}

export function PrimaryButton({ children, onClick, type = "button", disabled }) {
  return <button type={type} onClick={onClick} disabled={disabled} className="inline-flex items-center gap-2 rounded-full bg-[#001022] px-5 py-2.5 text-sm font-semibold text-white outline-none transition-all duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60">{children}</button>;
}

export function GhostButton({ children, onClick, type = "button" }) {
  return <button type={type} onClick={onClick} className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#001022] outline-none transition-colors duration-300 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91]">{children}</button>;
}

export function IconButton({ label, onClick, children, danger = false, active = false }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] bg-white outline-none transition-[background-color,transform] duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${danger ? "hover:bg-rose-50" : "hover:bg-[#E8F0FF]"}`} style={{ color: danger ? "#E11D48" : active ? "#F5B301" : C.ink }}>
      {children}
    </button>
  );
}

export function FilterChip({ active, onClick, children, count }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="rounded-full border px-4 py-2 text-sm font-semibold outline-none transition-[background-color,color,border-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#0B3D91]" style={{ backgroundColor: active ? C.ink : "#fff", color: active ? "#fff" : C.ink, borderColor: active ? C.ink : C.border }}>
      {children}{count != null && <span className="ml-2 opacity-60">{count}</span>}
    </button>
  );
}

export function SearchBox({ value, onChange, placeholder }) {
  return (
    <label className="relative block w-full sm:w-72">
      <AdminIcon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      <span className="sr-only">{placeholder}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputCls} pl-11`} style={{ borderColor: C.border }} />
    </label>
  );
}

export function EmptyState({ title, body }) {
  return <div className="rounded-3xl border border-dashed border-slate-400 px-6 py-14 text-center"><p className="text-lg font-bold text-[#001022]">{title}</p><p className="mt-1 text-sm text-slate-500">{body}</p></div>;
}

export function StatCard({ label, value, hint, decimals = 0 }) {
  return (
    <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-tight text-[#001022]">{Number(value).toFixed(decimals)}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-[#001022]/50 backdrop-blur-sm" />
      <div className={`relative max-h-[90vh] w-full overflow-y-auto rounded-[1.75rem] bg-white p-7 shadow-2xl sm:p-9 ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <div className="flex items-start justify-between gap-4"><h2 className="text-xl font-bold tracking-tight text-[#001022]">{title}</h2><IconButton label="Close" onClick={onClose}><AdminIcon name="close" /></IconButton></div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-[#001022]/40 backdrop-blur-sm" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5"><h2 className="text-lg font-bold text-[#001022]">{title}</h2><IconButton label="Close" onClick={onClose}><AdminIcon name="close" /></IconButton></div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </aside>
    </div>
  );
}

export function RoleForm({ role, onSave, onCancel }) {
  const [form, setForm] = useState(role ?? { title: "", team: "", type: "Full-time", place: "Hybrid", status: "draft", description: "" });
  const [error, setError] = useState("");
  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter a job title.");
      return;
    }
    onSave({ ...form, title: form.title.trim() });
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-semibold text-[#001022] sm:col-span-2">Job title<input autoFocus value={form.title} onChange={set("title")} className={`${inputCls} mt-2`} style={{ borderColor: error ? "#DC2626" : C.border }} placeholder="e.g. Tax Accountant" /><span role={error ? "alert" : undefined} className="block text-[13px] text-red-600">{error}</span></label>
      <label className="block text-sm font-semibold text-[#001022]">Team<input value={form.team} onChange={set("team")} className={`${inputCls} mt-2`} style={{ borderColor: C.border }} placeholder="e.g. Tax" /></label>
      <label className="block text-sm font-semibold text-[#001022]">Status<select value={form.status} onChange={set("status")} className={`${inputCls} mt-2`} style={{ borderColor: C.border }}>{Object.entries(ROLE_STATUS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></label>
      <label className="block text-sm font-semibold text-[#001022]">Type<select value={form.type} onChange={set("type")} className={`${inputCls} mt-2`} style={{ borderColor: C.border }}>{["Full-time", "Part-time", "Contract", "Internship"].map((type) => <option key={type}>{type}</option>)}</select></label>
      <label className="block text-sm font-semibold text-[#001022]">Location<select value={form.place} onChange={set("place")} className={`${inputCls} mt-2`} style={{ borderColor: C.border }}>{["Office", "Hybrid", "Remote"].map((place) => <option key={place}>{place}</option>)}</select></label>
      <label className="block text-sm font-semibold text-[#001022] sm:col-span-2">Description<textarea rows={4} value={form.description} onChange={set("description")} className={`${inputCls} mt-2 resize-none`} style={{ borderColor: C.border }} placeholder="A few lines about the role" /></label>
      <div className="flex justify-end gap-3 sm:col-span-2"><GhostButton onClick={onCancel}>Cancel</GhostButton><PrimaryButton type="submit">{role ? "Save changes" : "Create role"}</PrimaryButton></div>
    </form>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  return <div className="pointer-events-none fixed bottom-6 left-1/2 z-60 -translate-x-1/2" role="status" aria-live="polite"><div className={`rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl ${toast.error ? "bg-rose-700" : "bg-[#001022]"}`}>{toast.text}</div></div>;
}