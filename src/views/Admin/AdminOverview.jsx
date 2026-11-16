import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminIcon, Badge, PrimaryButton, Stars } from "./AdminShared";
import { APP_STATUS, C, fmtDate, initials } from "./AdminData";

const STAGE_BAR = {
  new: "bg-[#0B3D91]",
  reviewing: "bg-amber-500",
  interview: "bg-indigo-500",
  hired: "bg-emerald-500",
  rejected: "bg-rose-500",
};

const rise = (i) => ({ animationDelay: `${Math.min(i, 14) * 70}ms` });

/* Counts up from 0 (respects reduced motion) */
function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const Svg = ({ children, className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const IcArrow = () => <Svg className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const IcPlus = () => <Svg className="h-4 w-4"><path d="M12 5v14M5 12h14" /></Svg>;

/* ───────── KPI card (clickable) ───────── */
function Kpi({ label, value, hint, to, icon, tone = "blue", decimals = 0, alert = false, index }) {
  const shown = useCountUp(value);
  const tones = {
    blue: "bg-[#E8F0FF] text-[#0B3D91]",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    ink: "bg-[#001022] text-white",
  };
  return (
    <Link
      to={to}
      className="ov-rise group relative flex flex-col overflow-hidden rounded-3xl border bg-white p-5 outline-none transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-[#0B3D91] hover:shadow-[0_24px_40px_-28px_rgba(0,16,34,0.35)] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
      style={{ ...rise(index + 2), borderColor: C.border }}
    >
      <div className="flex items-center justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110 ${tones[tone]}`}>{icon}</span>
        {alert && value > 0 && <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0B3D91] opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0B3D91]" /></span>}
      </div>
      <p className="mt-5 text-4xl font-black tracking-tight text-[#001022]">{shown.toFixed(decimals)}</p>
      <p className="mt-1 text-sm font-semibold text-[#001022]">{label}</p>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
      <span className="pointer-events-none absolute right-4 top-4 translate-x-2 text-[#0B3D91] opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}

function Card({ title, subtitle, action, children, index = 0, className = "" }) {
  return (
    <section className={`ov-rise rounded-3xl border bg-white p-6 ${className}`} style={{ ...rise(index), borderColor: C.border }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#001022]">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const ViewAll = ({ to }) => (
  <Link to={to} className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0B3D91] outline-none focus-visible:underline">
    View all <span className="transition-transform duration-300 group-hover:translate-x-1"><IcArrow /></span>
  </Link>
);

export default function AdminOverview({ roles, applications, reviews, onPatchReview }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(id);
  }, []);

  const openRoles = roles.filter((role) => role.status === "open");
  const draftRoles = roles.filter((role) => role.status === "draft").length;
  const newApplications = applications.filter((application) => application.status === "new").length;
  const inProgress = applications.filter((a) => a.status === "reviewing" || a.status === "interview").length;
  const pendingReviews = reviews.filter((review) => review.status === "pending").length;
  const publishedReviews = reviews.filter((review) => review.status === "published");
  const averageRating = publishedReviews.length
    ? publishedReviews.reduce((total, review) => total + review.rating, 0) / publishedReviews.length
    : 0;
  const pending = reviews.filter((review) => review.status === "pending").slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  const todo = [
    { id: "apps", count: newApplications, text: (n) => `${n} new application${n === 1 ? "" : "s"} to look at`, to: "/admin/inquiries" },
    { id: "reviews", count: pendingReviews, text: (n) => `${n} review${n === 1 ? "" : "s"} waiting for approval`, to: "/admin/reviews" },
    { id: "drafts", count: draftRoles, text: (n) => `${n} draft role${n === 1 ? "" : "s"} not published yet`, to: "/admin/careers" },
  ].filter((t) => t.count > 0);

  const stages = Object.keys(APP_STATUS);
  const totalApps = applications.length || 1;
  const ratingRows = [5, 4, 3, 2, 1].map((n) => ({ n, count: publishedReviews.filter((r) => r.rating === n).length }));
  const maxRating = Math.max(1, ...ratingRows.map((r) => r.count));

  return (
    <section>
      <style>{`
        @keyframes ov-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .ov-rise { animation: ov-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) { .ov-rise { animation: none; } }
      `}</style>

      {/* Hero */}
      <div
        className="ov-rise relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-10 sm:py-10"
        style={{
          backgroundColor: C.ink ?? "#001022",
          backgroundImage:
            "radial-gradient(60% 90% at 90% 0%, rgba(11,61,145,0.5), transparent 70%), repeating-radial-gradient(circle at 90% 0%, rgba(255,255,255,0.035) 0 1px, transparent 1px 26px)",
        }}
      >
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold text-[#BCD0FF]">{today}</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">{greeting}.</h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              {todo.length ? "Here’s what needs you today." : "You’re all caught up. Nothing is waiting for you right now."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/admin/careers" className="inline-flex items-center gap-2 rounded-full bg-[#BCD0FF] px-5 py-2.5 text-sm font-semibold text-[#001022] outline-none transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:ring-2 focus-visible:ring-white">
                <IcPlus /> Post a role
              </Link>
              <Link to="/admin/inquiries" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white">
                Review applicants
              </Link>
            </div>
          </div>

          <ul className="space-y-2.5">
            {todo.map((t, i) => (
              <li key={t.id} className="ov-rise" style={rise(i + 3)}>
                <Link to={t.to} className="group flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3.5 text-sm font-semibold outline-none backdrop-blur transition-[background-color,transform] duration-300 hover:translate-x-1 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#BCD0FF] text-xs font-black text-[#001022]">{t.count}</span>
                  <span className="flex-1">{t.text(t.count)}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1"><IcArrow /></span>
                </Link>
              </li>
            ))}
            {todo.length === 0 && (
              <li className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-4 text-sm font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#BCD0FF] text-[#001022]"><AdminIcon name="check" /></span>
                Inbox zero. Nice work.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi index={0} to="/admin/careers" label="Open roles" value={openRoles.length} hint={`${roles.length} total listings`} icon={<AdminIcon name="briefcase" />} />
        <Kpi index={1} to="/admin/inquiries" label="New applications" value={newApplications} hint={`${applications.length} total applicants`} icon={<AdminIcon name="mail" />} tone="amber" alert />
        <Kpi index={2} to="/admin/reviews" label="Reviews to approve" value={pendingReviews} hint={`${reviews.length} total reviews`} icon={<AdminIcon name="star" />} tone="ink" alert />
        <Kpi index={3} to="/admin/reviews" label="Average rating" value={averageRating} decimals={1} hint="Published reviews" icon={<AdminIcon name="star" />} tone="green" />
      </div>

      {/* Insights */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card index={6} title="Hiring pipeline" subtitle={`${inProgress} in progress right now`} action={<ViewAll to="/admin/inquiries" />}>
          <ul className="mt-5 space-y-3.5">
            {stages.map((stage) => {
              const n = applications.filter((a) => a.status === stage).length;
              return (
                <li key={stage} className="flex items-center gap-3 text-sm">
                  <span className="w-20 shrink-0 font-semibold text-slate-600">{APP_STATUS[stage].label}</span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E8F0FF]">
                    <span className={`block h-full rounded-full transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${STAGE_BAR[stage] ?? "bg-slate-400"}`} style={{ width: ready ? `${(n / totalApps) * 100}%` : "0%" }} />
                  </span>
                  <span className="w-6 text-right font-bold text-[#001022]">{n}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card index={7} title="Rating breakdown" subtitle={publishedReviews.length ? `${publishedReviews.length} published review${publishedReviews.length === 1 ? "" : "s"}` : "No published reviews yet"} action={<ViewAll to="/admin/reviews" />}>
          <div className="mt-5 flex items-center gap-5">
            <div className="text-center">
              <p className="text-5xl font-black tracking-tight text-[#001022]">{averageRating.toFixed(1)}</p>
              <div className="mt-1 flex justify-center"><Stars value={Math.round(averageRating)} /></div>
            </div>
            <ul className="flex-1 space-y-2">
              {ratingRows.map(({ n, count }) => (
                <li key={n} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <span className="w-3">{n}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#E8F0FF]">
                    <span className="block h-full rounded-full bg-[#F5B301] transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: ready ? `${(count / maxRating) * 100}%` : "0%" }} />
                  </span>
                  <span className="w-4 text-right text-[#001022]">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Work queues */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card index={8} title="Latest applications" subtitle="Most recently submitted" action={<ViewAll to="/admin/inquiries" />}>
          <ul className="mt-4 divide-y divide-[#E2E8F0]">
            {applications.slice(0, 4).map((application) => (
              <li key={application.id}>
                <Link to="/admin/inquiries" className="group -mx-3 flex items-center gap-3 rounded-2xl px-3 py-3 outline-none transition-[background-color,transform] duration-300 hover:bg-[#F1F6FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91] transition-transform duration-500 ease-out group-hover:scale-110">{initials(application.name)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-semibold text-[#001022]">{application.name}</span>
                      {application.status === "new" && <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#0B3D91]" aria-label="New" />}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{application.role} · {fmtDate(application.date)}</span>
                  </span>
                  <Badge map={APP_STATUS} value={application.status} />
                </Link>
              </li>
            ))}
            {applications.length === 0 && <li className="py-8 text-center text-sm text-slate-500">No applications yet.</li>}
          </ul>
        </Card>

        <Card index={9} title="Reviews waiting" subtitle="Pending approval" action={<ViewAll to="/admin/reviews" />}>
          <ul className="mt-4 space-y-3">
            {pending.map((review) => (
              <li key={review.id} className="rounded-2xl bg-[#F1F6FF] p-4 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-24px_rgba(0,16,34,0.4)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-[#001022]">{review.name} · {review.role}</span>
                  <Stars value={review.rating} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{review.text}</p>
                <div className="mt-3 flex gap-2">
                  <PrimaryButton onClick={() => onPatchReview(review.id, { status: "published" }, "Review published")}><AdminIcon name="check" /> Approve</PrimaryButton>
                  <button type="button" onClick={() => onPatchReview(review.id, { status: "hidden", featured: false }, "Review hidden")} className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#001022] outline-none transition-[background-color,transform] duration-300 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91] active:scale-[0.98]">Hide</button>
                </div>
              </li>
            ))}
            {pending.length === 0 && <li className="py-8 text-center text-sm text-slate-500">You’re all caught up.</li>}
          </ul>
        </Card>
      </div>

      {/* Open roles */}
      <Card index={10} className="mt-5" title="Open roles" subtitle="What’s live on your careers page" action={<ViewAll to="/admin/careers" />}>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {openRoles.slice(0, 6).map((role) => {
            const count = applications.filter((a) => a.role === role.title).length;
            return (
              <li key={role.id}>
                <Link to="/admin/careers" className="group flex h-full flex-col rounded-2xl border p-4 outline-none transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-0.5 hover:border-[#0B3D91] hover:shadow-[0_18px_30px_-24px_rgba(0,16,34,0.4)] focus-visible:ring-2 focus-visible:ring-[#0B3D91]" style={{ borderColor: C.border }}>
                  <span className="text-[15px] font-bold text-[#001022]">{role.title}</span>
                  <span className="mt-1 text-xs text-slate-500">{[role.team, role.type, role.place].filter(Boolean).join(" · ")}</span>
                  <span className="mt-3 inline-flex w-fit rounded-full bg-[#E8F0FF] px-3 py-1 text-xs font-semibold text-[#0B3D91]">{count} applicant{count === 1 ? "" : "s"}</span>
                </Link>
              </li>
            );
          })}
          {openRoles.length === 0 && <li className="col-span-full py-6 text-center text-sm text-slate-500">No open roles. Post one to start receiving applications.</li>}
        </ul>
      </Card>
    </section>
  );
}