import { Link } from "react-router-dom";
import { AdminIcon, Badge, PrimaryButton, StatCard, Stars } from "./AdminShared";
import { APP_STATUS, C, fmtDate, initials } from "./AdminData";

export default function AdminOverview({ roles, applications, reviews, onPatchReview }) {
  const openRoles = roles.filter((role) => role.status === "open").length;
  const newApplications = applications.filter((application) => application.status === "new").length;
  const pendingReviews = reviews.filter((review) => review.status === "pending").length;
  const publishedReviews = reviews.filter((review) => review.status === "published");
  const averageRating = publishedReviews.length
    ? publishedReviews.reduce((total, review) => total + review.rating, 0) / publishedReviews.length
    : 0;
  const pending = reviews.filter((review) => review.status === "pending").slice(0, 3);

  return (
    <section>
      <div className="ad-head">
        <h2 className="text-3xl font-black uppercase tracking-tight text-[#001022] sm:text-4xl">Overview</h2>
        <p className="mt-1 text-[15px] text-slate-600">A quick look at the activity that needs your attention.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Open roles" value={openRoles} hint={`${roles.length} total listings`} />
        <StatCard label="New applications" value={newApplications} hint={`${applications.length} total applicants`} />
        <StatCard label="Reviews to approve" value={pendingReviews} hint={`${reviews.length} total reviews`} />
        <StatCard label="Average rating" value={averageRating} decimals={1} hint="Published reviews" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="ad-item rounded-3xl border bg-white p-6" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between gap-3">
            <div><h3 className="text-lg font-bold text-[#001022]">Latest applications</h3><p className="mt-1 text-sm text-slate-500">Most recently submitted</p></div>
            <Link to="/admin/inquiries" className="text-sm font-semibold text-[#0B3D91] underline-offset-4 hover:underline">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-[#E2E8F0]">
            {applications.slice(0, 4).map((application) => (
              <li key={application.id}>
                <Link to="/admin/inquiries" className="flex items-center gap-3 py-3 transition-colors hover:bg-[#F1F6FF]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91]">{initials(application.name)}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[15px] font-semibold text-[#001022]">{application.name}</span><span className="block truncate text-xs text-slate-500">{application.role} · {fmtDate(application.date)}</span></span>
                  <Badge map={APP_STATUS} value={application.status} />
                </Link>
              </li>
            ))}
            {applications.length === 0 && <li className="py-6 text-center text-sm text-slate-500">No applications yet.</li>}
          </ul>
        </section>

        <section className="ad-item rounded-3xl border bg-white p-6" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between gap-3">
            <div><h3 className="text-lg font-bold text-[#001022]">Reviews waiting</h3><p className="mt-1 text-sm text-slate-500">Pending approval</p></div>
            <Link to="/admin/reviews" className="text-sm font-semibold text-[#0B3D91] underline-offset-4 hover:underline">View all</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {pending.map((review) => (
              <li key={review.id} className="rounded-2xl bg-[#F1F6FF] p-4">
                <div className="flex items-start justify-between gap-3"><span className="text-sm font-semibold text-[#001022]">{review.name} · {review.role}</span><Stars value={review.rating} /></div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{review.text}</p>
                <div className="mt-3 flex gap-2">
                  <PrimaryButton onClick={() => onPatchReview(review.id, { status: "published" }, "Review published")}><AdminIcon name="check" /> Approve</PrimaryButton>
                  <button type="button" onClick={() => onPatchReview(review.id, { status: "hidden", featured: false }, "Review hidden")} className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#001022] hover:bg-[#E8F0FF]">Hide</button>
                </div>
              </li>
            ))}
            {pending.length === 0 && <li className="py-6 text-center text-sm text-slate-500">You’re all caught up.</li>}
          </ul>
        </section>
      </div>
    </section>
  );
}