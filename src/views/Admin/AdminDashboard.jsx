import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
  AdminIcon,
  Modal,
  Toast,
  GhostButton,
} from "./AdminShared";
import { ROLE_STATUS, uid } from "./AdminData";

const SAMPLE_ROLES = [
  { id: "r1", title: "Tax Accountant", team: "Tax", type: "Full-time", place: "Hybrid", status: "open", description: "Prepare and review tax returns for individuals and small businesses.", posted: "2026-09-12" },
  { id: "r2", title: "Business Advisory Associate", team: "Advisory", type: "Full-time", place: "Hybrid", status: "open", description: "Support clients with forecasting, planning and reporting.", posted: "2026-09-28" },
  { id: "r3", title: "Bookkeeper", team: "Accounting", type: "Part-time", place: "Remote", status: "draft", description: "Keep client books accurate and up to date.", posted: "2026-10-10" },
  { id: "r4", title: "Graduate Accountant", team: "Accounting", type: "Full-time", place: "Office", status: "closed", description: "Entry-level role with study support.", posted: "2026-07-02" },
];

const SAMPLE_APPLICATIONS = [
  { id: "a1", name: "Sample Applicant A", email: "applicant.a@example.com", phone: "+91 00000 00001", role: "Tax Accountant", link: "https://example.com", message: "Sample message. Replace with real applications from your API.", status: "new", date: "2026-10-20", notes: "" },
  { id: "a2", name: "Sample Applicant B", email: "applicant.b@example.com", phone: "", role: "Business Advisory Associate", link: "", message: "", status: "reviewing", date: "2026-10-18", notes: "Strong background. Book a call." },
  { id: "a3", name: "Sample Applicant C", email: "applicant.c@example.com", phone: "+91 00000 00003", role: "Tax Accountant", link: "", message: "Another sample message.", status: "interview", date: "2026-10-15", notes: "" },
  { id: "a4", name: "Sample Applicant D", email: "applicant.d@example.com", phone: "", role: "Graduate Accountant", link: "", message: "", status: "rejected", date: "2026-10-02", notes: "" },
];

const SAMPLE_REVIEWS = [
  { id: "v1", name: "Client name", role: "Business owner", rating: 5, text: "Sample review. Replace with real client reviews from your API.", service: "Tax & Compliance", status: "pending", featured: false, date: "2026-10-20" },
  { id: "v2", name: "Client name", role: "Investor", rating: 5, text: "Another sample review that shows how a longer piece of feedback looks in the list.", service: "Property Tax", status: "published", featured: true, date: "2026-10-12" },
  { id: "v3", name: "Client name", role: "Finance director", rating: 4, text: "Sample review text.", service: "Corporate Advisory", status: "published", featured: false, date: "2026-09-30" },
  { id: "v4", name: "Client name", role: "Founder", rating: 2, text: "Sample critical review kept hidden for follow-up.", service: "Accounting", status: "hidden", featured: false, date: "2026-09-18" },
];

function ConfirmDialog({ confirm, onClose }) {
  return (
    <Modal open={Boolean(confirm)} onClose={onClose} title={confirm?.title ?? "Confirm action"}>
      <p className="text-[15px] leading-relaxed text-slate-600">{confirm?.body}</p>
      <div className="mt-6 flex justify-end gap-3">
        <GhostButton onClick={onClose}>Cancel</GhostButton>
        <button type="button" onClick={() => { confirm?.onConfirm(); onClose(); }} className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-colors hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
          <AdminIcon name="trash" /> Delete
        </button>
      </div>
    </Modal>
  );
}

export default function AdminDashboard({
  roles: initialRoles = SAMPLE_ROLES,
  applications: initialApplications = SAMPLE_APPLICATIONS,
  reviews: initialReviews = SAMPLE_REVIEWS,
  api = {},
  adminName = "Admin",
  onLogout,
  siteHref = "/",
}) {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(initialRoles);
  const [applications, setApplications] = useState(initialApplications);
  const [reviews, setReviews] = useState(initialReviews);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const newApplications = applications.filter((application) => application.status === "new").length;
  const pendingReviews = reviews.filter((review) => review.status === "pending").length;

  const showToast = useCallback((text, error = false) => {
    clearTimeout(toastTimer.current);
    setToast({ text, error });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const act = useCallback(async (call, apply, revert, successMessage) => {
    apply();
    try {
      await call?.();
      showToast(successMessage);
      return true;
    } catch {
      revert();
      showToast("That didn’t save. Please try again.", true);
      return false;
    }
  }, [showToast]);

  const saveRole = async (roleData) => {
    const editing = Boolean(roleData.id);
    const previousRoles = roles;
    const optimisticRole = editing
      ? roleData
      : { ...roleData, id: uid(), posted: new Date().toISOString().slice(0, 10) };

    return act(
      async () => {
        const savedRole = await api.saveRole?.(optimisticRole);
        if (savedRole?.id && savedRole.id !== optimisticRole.id) {
          setRoles((current) => current.map((role) => role.id === optimisticRole.id ? savedRole : role));
        }
      },
      () => setRoles((current) => editing
        ? current.map((role) => role.id === roleData.id ? optimisticRole : role)
        : [optimisticRole, ...current]),
      () => setRoles(previousRoles),
      editing ? "Role updated" : "Role created"
    );
  };

  const setRoleStatus = (role, status) => {
    const previousRoles = roles;
    return act(
      () => api.saveRole?.({ ...role, status }),
      () => setRoles((current) => current.map((item) => item.id === role.id ? { ...item, status } : item)),
      () => setRoles(previousRoles),
      `Role marked ${ROLE_STATUS[status].label.toLowerCase()}`
    );
  };

  const deleteRole = (role) => setConfirm({
    title: "Delete this role?",
    body: `“${role.title}” will be removed. Existing applications will stay.`,
    onConfirm: () => {
      const previousRoles = roles;
      return act(
        () => api.deleteRole?.(role.id),
        () => setRoles((current) => current.filter((item) => item.id !== role.id)),
        () => setRoles(previousRoles),
        "Role deleted"
      );
    },
  });

  const updateApplication = (id, patch, message) => {
    const previousApplications = applications;
    return act(
      () => api.updateApplication?.(id, patch),
      () => setApplications((current) => current.map((application) => application.id === id ? { ...application, ...patch } : application)),
      () => setApplications(previousApplications),
      message
    );
  };

  const updateReview = (id, patch, message) => {
    const previousReviews = reviews;
    return act(
      () => api.updateReview?.(id, patch),
      () => setReviews((current) => current.map((review) => review.id === id ? { ...review, ...patch } : review)),
      () => setReviews(previousReviews),
      message
    );
  };

  const deleteReview = (review) => setConfirm({
    title: "Delete this review?",
    body: "This can’t be undone. You can hide it instead if you might need it later.",
    onConfirm: () => {
      const previousReviews = reviews;
      return act(
        () => api.deleteReview?.(review.id),
        () => setReviews((current) => current.filter((item) => item.id !== review.id)),
        () => setReviews(previousReviews),
        "Review deleted"
      );
    },
  });

  const navItems = [
    { id: "overview", href: "/admin", end: true, label: "Overview", icon: <AdminIcon name="home" /> },
    { id: "careers", href: "/admin/careers", label: "Careers", icon: <AdminIcon name="briefcase" /> },
    { id: "inquiries", href: "/admin/inquiries", label: "Applications", icon: <AdminIcon name="mail" />, badge: newApplications },
    { id: "reviews", href: "/admin/reviews", label: "Reviews", icon: <AdminIcon name="star" />, badge: pendingReviews },
  ];

  return (
    <AdminLayout navItems={navItems} adminName={adminName} onLogout={onLogout} siteHref={siteHref}>
      <div className="ad-head mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D8E9E4] bg-[#EDF5F2] px-4 py-3 text-sm text-[#365B54]">
        <span><strong>Prototype data.</strong> Changes are in memory only until the Express API is connected.</span>
        <button type="button" onClick={() => navigate("/admin/login")} className="font-semibold underline underline-offset-4">Admin sign in</button>
      </div>
      <Outlet context={{ roles, applications, reviews, onSaveRole: saveRole, onSetRoleStatus: setRoleStatus, onDeleteRole: deleteRole, onUpdateApplication: updateApplication, onPatchReview: updateReview, onDeleteReview: deleteReview }} />
      <ConfirmDialog confirm={confirm} onClose={() => setConfirm(null)} />
      <Toast toast={toast} />
    </AdminLayout>
  );
}
