import { useMemo, useState } from "react";
import {
	AdminIcon,
	Badge,
	Drawer,
	EmptyState,
	FilterChip,
	PrimaryButton,
	SearchBox,
} from "./AdminShared";
import { APP_STATUS, C, fmtDate, initials } from "./AdminData";

export default function AdminInquiry({ applications, onUpdateApplication }) {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [roleFilter, setRoleFilter] = useState("all");
	const [selectedId, setSelectedId] = useState(null);
	const [notes, setNotes] = useState("");
	const currentApplication = applications.find((application) => application.id === selectedId) ?? null;
	const roleTitles = [...new Set(applications.map((application) => application.role))];
	const query = search.trim().toLowerCase();

	const visibleApplications = useMemo(
		() => applications.filter((application) =>
			(statusFilter === "all" || application.status === statusFilter)
			&& (roleFilter === "all" || application.role === roleFilter)
			&& (!query || `${application.name} ${application.email}`.toLowerCase().includes(query))
		),
		[applications, statusFilter, roleFilter, query]
	);

	const openApplication = (application) => {
		setSelectedId(application.id);
		setNotes(application.notes || "");
		if (application.status === "new") {
			onUpdateApplication(application.id, { status: "reviewing" }, "Moved to Reviewing");
		}
	};

	return (
		<section>
			<div className="ad-head">
				<h2 className="text-3xl font-black uppercase tracking-tight text-[#001022] sm:text-4xl">Applications</h2>
				<p className="mt-1 text-[15px] text-slate-600">Review applicants and track each application through your hiring process.</p>
			</div>

			<div className="ad-head mt-6 flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-2">
					{["all", ...Object.keys(APP_STATUS)].map((status) => (
						<FilterChip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)} count={status === "all" ? applications.length : applications.filter((application) => application.status === status).length}>
							{status === "all" ? "All" : APP_STATUS[status].label}
						</FilterChip>
					))}
				</div>
				<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
					<label className="sr-only" htmlFor="application-role-filter">Filter by role</label>
					<select id="application-role-filter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-11 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#001022] outline-none focus:border-[#0B3D91] focus:ring-2 focus:ring-[#E8F0FF]">
						<option value="all">All roles</option>
						{roleTitles.map((title) => <option key={title} value={title}>{title}</option>)}
					</select>
					<SearchBox value={search} onChange={setSearch} placeholder="Search applicants" />
				</div>
			</div>

			<ul className="mt-5 space-y-3">
				{visibleApplications.map((application) => (
					<li key={application.id} className="ad-item">
						<button type="button" onClick={() => openApplication(application)} className="group flex w-full items-center gap-4 rounded-3xl border bg-white p-5 text-left outline-none transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#0B3D91] hover:shadow-[0_24px_40px_-30px_rgba(0,16,34,0.35)] focus-visible:ring-2 focus-visible:ring-[#0B3D91] sm:px-6" style={{ borderColor: C.border }}>
							<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91]">{initials(application.name)}</span>
							<span className="min-w-0 flex-1">
								<span className="flex items-center gap-2">
									<span className="truncate text-base font-bold text-[#001022]">{application.name}</span>
									{application.status === "new" && <span className="h-2 w-2 shrink-0 rounded-full bg-[#0B3D91]" aria-label="New application" />}
								</span>
								<span className="mt-1 block truncate text-sm text-slate-500">{application.role} · {application.email} · {fmtDate(application.date)}</span>
							</span>
							<Badge map={APP_STATUS} value={application.status} />
						</button>
					</li>
				))}
				{visibleApplications.length === 0 && <li><EmptyState title="No applications found" body="New applications will appear here." /></li>}
			</ul>

			<Drawer open={Boolean(currentApplication)} onClose={() => setSelectedId(null)} title="Application">
				{currentApplication && (
					<div>
						<div className="flex items-center gap-4">
							<span className="grid h-14 w-14 place-items-center rounded-full bg-[#E8F0FF] text-lg font-bold text-[#0B3D91]">{initials(currentApplication.name)}</span>
							<div><p className="text-xl font-bold text-[#001022]">{currentApplication.name}</p><p className="text-sm text-slate-500">Applied for {currentApplication.role} · {fmtDate(currentApplication.date)}</p></div>
						</div>

						<dl className="mt-6 space-y-3 rounded-2xl bg-[#F1F6FF] p-5 text-sm">
							<div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd><a className="font-semibold text-[#0B3D91] underline-offset-4 hover:underline" href={`mailto:${currentApplication.email}`}>{currentApplication.email}</a></dd></div>
							{currentApplication.phone && <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd className="font-semibold text-[#001022]">{currentApplication.phone}</dd></div>}
							{currentApplication.link && <div className="flex justify-between gap-4"><dt className="text-slate-500">Profile</dt><dd><a className="font-semibold text-[#0B3D91] underline-offset-4 hover:underline" href={currentApplication.link} target="_blank" rel="noopener noreferrer">Open link</a></dd></div>}
						</dl>

						{currentApplication.message && <div className="mt-6"><p className="text-sm font-semibold text-[#001022]">Message</p><p className="mt-2 text-[15px] leading-relaxed text-slate-600">{currentApplication.message}</p></div>}

						<div className="mt-6"><p className="text-sm font-semibold text-[#001022]">Hiring stage</p><div className="mt-3 flex flex-wrap gap-2">{Object.entries(APP_STATUS).map(([status, item]) => <FilterChip key={status} active={currentApplication.status === status} onClick={() => currentApplication.status !== status && onUpdateApplication(currentApplication.id, { status }, `Moved to ${item.label}`)}>{item.label}</FilterChip>)}</div></div>

						<label className="mt-6 block text-sm font-semibold text-[#001022]">Private notes<textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[15px] outline-none focus:border-[#0B3D91] focus:ring-2 focus:ring-[#E8F0FF]" placeholder="Only visible to your team" /></label>

						<div className="mt-5 flex flex-wrap gap-3">
							<PrimaryButton disabled={notes === (currentApplication.notes || "")} onClick={() => onUpdateApplication(currentApplication.id, { notes }, "Notes saved")}>Save notes</PrimaryButton>
							<a href={`mailto:${currentApplication.email}?subject=${encodeURIComponent(`Your application for ${currentApplication.role}`)}`} className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#001022] hover:bg-[#E8F0FF]"><AdminIcon name="mail" /> Email applicant</a>
						</div>
					</div>
				)}
			</Drawer>
		</section>
	);
}
