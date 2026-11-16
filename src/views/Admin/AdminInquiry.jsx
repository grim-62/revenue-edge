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

/* Hiring pipeline order. "rejected" sits outside the forward flow. */
const FLOW = ["new", "reviewing", "interview", "hired"];
const nextStage = (status) => FLOW[FLOW.indexOf(status) + 1] ?? null;

const STAGE_DOT = {
	new: "bg-[#0B3D91]",
	reviewing: "bg-amber-500",
	interview: "bg-indigo-500",
	hired: "bg-emerald-500",
	rejected: "bg-rose-500",
};

function timeAgo(value) {
	const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
	if (Number.isNaN(days)) return "";
	if (days <= 0) return "Today";
	if (days === 1) return "Yesterday";
	if (days < 30) return `${days} days ago`;
	const months = Math.floor(days / 30);
	return `${months} month${months > 1 ? "s" : ""} ago`;
}

/* Small local icons so this file only relies on the shared "mail" icon */
const Svg = ({ children, className = "h-4 w-4" }) => (
	<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const IcList = () => <Svg><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></Svg>;
const IcBoard = () => <Svg><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" /></Svg>;
const IcPhone = () => <Svg><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Svg>;
const IcLink = () => <Svg><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></Svg>;
const IcArrow = () => <Svg><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const IcCheck = () => <Svg className="h-3.5 w-3.5"><path d="M5 13l4 4 10-10" /></Svg>;
const IcX = () => <Svg><path d="M6 6l12 12M18 6L6 18" /></Svg>;

const rise = (i) => ({ animationDelay: `${Math.min(i, 12) * 45}ms` });

function Stat({ label, value, hint, onClick, active }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className="inq-rise group rounded-3xl border bg-white p-5 text-left outline-none transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_40px_-30px_rgba(0,16,34,0.35)] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
			style={{ borderColor: active ? "#001022" : C.border }}
		>
			<span className="text-sm font-semibold text-slate-500">{label}</span>
			<span className="mt-2 block text-4xl font-black tracking-tight text-[#001022]">{value}</span>
			<span className="mt-1 block text-xs text-slate-500">{hint}</span>
		</button>
	);
}

/* Segmented bar showing how applicants are spread across stages */
function Funnel({ applications }) {
	const total = applications.length || 1;
	const stages = Object.keys(APP_STATUS);
	return (
		<div className="inq-rise rounded-3xl border bg-white p-5 sm:p-6" style={{ borderColor: C.border }}>
			<div className="flex h-3 overflow-hidden rounded-full bg-[#E8F0FF]" role="img" aria-label="Applicants by stage">
				{stages.map((stage) => {
					const n = applications.filter((a) => a.status === stage).length;
					return <span key={stage} className={`${STAGE_DOT[stage] ?? "bg-slate-400"} h-full transition-[width] duration-700 ease-out`} style={{ width: `${(n / total) * 100}%` }} />;
				})}
			</div>
			<ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
				{stages.map((stage) => (
					<li key={stage} className="flex items-center gap-2 text-slate-600">
						<span className={`h-2.5 w-2.5 rounded-full ${STAGE_DOT[stage] ?? "bg-slate-400"}`} />
						{APP_STATUS[stage].label}
						<strong className="text-[#001022]">{applications.filter((a) => a.status === stage).length}</strong>
					</li>
				))}
			</ul>
		</div>
	);
}

/* ───────── List row ───────── */
function Row({ application, index, onOpen, onAdvance }) {
	const next = nextStage(application.status);
	return (
		<li className="inq-rise" style={rise(index)}>
			<div className="group flex flex-col gap-4 rounded-3xl border bg-white p-5 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-0.5 hover:border-[#0B3D91] hover:shadow-[0_24px_40px_-30px_rgba(0,16,34,0.35)] sm:flex-row sm:items-center sm:px-6" style={{ borderColor: C.border }}>
				<button type="button" onClick={() => onOpen(application)} className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]">
					<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91] transition-transform duration-500 ease-out group-hover:scale-105">{initials(application.name)}</span>
					<span className="min-w-0 flex-1">
						<span className="flex items-center gap-2">
							<span className="truncate text-base font-bold text-[#001022]">{application.name}</span>
							{application.status === "new" && <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#0B3D91]" aria-label="New application" />}
						</span>
						<span className="mt-1 block truncate text-sm text-slate-500">{application.role} · {application.email}</span>
					</span>
				</button>

				<div className="flex items-center justify-between gap-3 sm:justify-end">
					<span className="text-xs text-slate-500" title={fmtDate(application.date)}>{timeAgo(application.date)}</span>
					<Badge map={APP_STATUS} value={application.status} />
					{next ? (
						<button
							type="button"
							onClick={() => onAdvance(application, next)}
							className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold text-[#001022] outline-none transition-[background-color,transform] duration-300 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91] active:scale-95"
							style={{ borderColor: C.border }}
							aria-label={`Move ${application.name} to ${APP_STATUS[next].label}`}
						>
							{APP_STATUS[next].label} <IcArrow />
						</button>
					) : (
						<span className="hidden w-[7.5rem] sm:block" />
					)}
				</div>
			</div>
		</li>
	);
}

/* ───────── Board card (draggable) ───────── */
function BoardCard({ application, index, onOpen, onAdvance, onDragStart, onDragEnd, dragging }) {
	const next = nextStage(application.status);
	return (
		<li
			draggable
			onDragStart={(e) => { e.dataTransfer.setData("text/plain", application.id); e.dataTransfer.effectAllowed = "move"; onDragStart(application.id); }}
			onDragEnd={onDragEnd}
			className={`inq-rise cursor-grab rounded-2xl border bg-white p-4 shadow-sm transition-[transform,box-shadow,opacity] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-22px_rgba(0,16,34,0.4)] active:cursor-grabbing ${dragging ? "scale-95 opacity-40" : ""}`}
			style={{ ...rise(index), borderColor: C.border }}
		>
			<button type="button" onClick={() => onOpen(application)} className="flex w-full items-center gap-3 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]">
				<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E8F0FF] text-xs font-bold text-[#0B3D91]">{initials(application.name)}</span>
				<span className="min-w-0">
					<span className="block truncate text-[15px] font-bold text-[#001022]">{application.name}</span>
					<span className="block truncate text-xs text-slate-500">{application.role}</span>
				</span>
			</button>
			<div className="mt-3 flex items-center justify-between gap-2">
				<span className="text-xs text-slate-500">{timeAgo(application.date)}</span>
				{next && (
					<button type="button" onClick={() => onAdvance(application, next)} aria-label={`Move ${application.name} to ${APP_STATUS[next].label}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F6FF] px-3 py-1.5 text-xs font-semibold text-[#0B3D91] outline-none transition-[background-color,transform] duration-300 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91] active:scale-95">
						{APP_STATUS[next].label} <IcArrow />
					</button>
				)}
			</div>
		</li>
	);
}

/* ───────── Stage stepper inside the drawer ───────── */
function Stepper({ status, onChange }) {
	const rejected = status === "rejected";
	const idx = FLOW.indexOf(status);
	return (
		<div>
			<ol className="flex items-center">
				{FLOW.map((stage, i) => {
					const done = !rejected && i < idx;
					const active = !rejected && i === idx;
					return (
						<li key={stage} className="flex flex-1 items-center last:flex-none">
							<button
								type="button"
								onClick={() => status !== stage && onChange(stage)}
								aria-label={`Move to ${APP_STATUS[stage].label}`}
								aria-current={active ? "step" : undefined}
								className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-xs font-bold outline-none transition-[background-color,border-color,color,transform] duration-500 ease-out hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${done ? "border-[#0B3D91] bg-[#0B3D91] text-white" : active ? "border-[#001022] bg-[#001022] text-white" : "border-slate-200 bg-white text-slate-400"}`}
							>
								{done ? <IcCheck /> : i + 1}
							</button>
							{i < FLOW.length - 1 && (
								<span className="mx-1 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200">
									<span className="block h-full origin-left bg-[#0B3D91] transition-transform duration-700 ease-out" style={{ transform: `scaleX(${done ? 1 : 0})` }} />
								</span>
							)}
						</li>
					);
				})}
			</ol>
			<ol className="mt-2 flex justify-between text-[11px] font-semibold text-slate-500">
				{FLOW.map((stage) => <li key={stage} className={`w-14 text-center first:text-left last:text-right ${status === stage ? "text-[#001022]" : ""}`}>{APP_STATUS[stage].label}</li>)}
			</ol>
		</div>
	);
}

export default function AdminInquiry({ applications, onUpdateApplication }) {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [roleFilter, setRoleFilter] = useState("all");
	const [mode, setMode] = useState("list"); // list | board
	const [selectedId, setSelectedId] = useState(null);
	const [notes, setNotes] = useState("");
	const [draggingId, setDraggingId] = useState(null);
	const [overStage, setOverStage] = useState(null);

	const currentApplication = applications.find((application) => application.id === selectedId) ?? null;
	const roleTitles = [...new Set(applications.map((application) => application.role))];
	const query = search.trim().toLowerCase();
	const stages = Object.keys(APP_STATUS);

	const visibleApplications = useMemo(
		() => applications.filter((application) =>
			(mode === "board" || statusFilter === "all" || application.status === statusFilter)
			&& (roleFilter === "all" || application.role === roleFilter)
			&& (!query || `${application.name} ${application.email}`.toLowerCase().includes(query))
		),
		[applications, statusFilter, roleFilter, query, mode]
	);

	const counts = {
		total: applications.length,
		fresh: applications.filter((a) => a.status === "new").length,
		active: applications.filter((a) => a.status === "reviewing" || a.status === "interview").length,
		hired: applications.filter((a) => a.status === "hired").length,
	};

	const openApplication = (application) => {
		setSelectedId(application.id);
		setNotes(application.notes || "");
		if (application.status === "new") {
			onUpdateApplication(application.id, { status: "reviewing" }, "Moved to Reviewing");
		}
	};

	const move = (application, status) =>
		application.status !== status && onUpdateApplication(application.id, { status }, `${application.name} moved to ${APP_STATUS[status].label}`);

	const dropOn = (stage) => (event) => {
		event.preventDefault();
		const id = event.dataTransfer.getData("text/plain") || draggingId;
		const application = applications.find((a) => a.id === id);
		if (application) move(application, stage);
		setDraggingId(null);
		setOverStage(null);
	};

	const listKey = `${mode}-${statusFilter}-${roleFilter}`;

	return (
		<section>
			{/* local keyframes for the soft rise-in used throughout this page */}
			<style>{`
				@keyframes inq-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
				.inq-rise { animation: inq-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
				@media (prefers-reduced-motion: reduce) { .inq-rise { animation: none; } }
			`}</style>

			<div className="ad-head flex flex-wrap items-end justify-between gap-4">
				<div>
					<h2 className="text-3xl font-black uppercase tracking-tight text-[#001022] sm:text-4xl">Applications</h2>
					<p className="mt-1 text-[15px] text-slate-600">Review applicants and move each one through your hiring process.</p>
				</div>

				<div className="inline-flex rounded-full border bg-white p-1" style={{ borderColor: C.border }} role="tablist" aria-label="View">
					{[["list", "List", <IcList key="l" />], ["board", "Board", <IcBoard key="b" />]].map(([id, label, icon]) => (
						<button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => setMode(id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold outline-none transition-[background-color,color] duration-300 focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${mode === id ? "bg-[#001022] text-white" : "text-[#001022] hover:bg-[#F1F6FF]"}`}>
							{icon} {label}
						</button>
					))}
				</div>
			</div>

			{/* Summary */}
			<div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Stat label="All applications" value={counts.total} hint="In your pipeline" active={statusFilter === "all"} onClick={() => { setMode("list"); setStatusFilter("all"); }} />
				<Stat label="New" value={counts.fresh} hint="Waiting for a first look" active={statusFilter === "new"} onClick={() => { setMode("list"); setStatusFilter("new"); }} />
				<Stat label="In progress" value={counts.active} hint="Reviewing or interviewing" active={false} onClick={() => { setMode("board"); }} />
				<Stat label="Hired" value={counts.hired} hint="Welcome aboard" active={statusFilter === "hired"} onClick={() => { setMode("list"); setStatusFilter("hired"); }} />
			</div>
			<div className="mt-3"><Funnel applications={applications} /></div>

			{/* Filters */}
			<div className="ad-head mt-6 flex flex-wrap items-center justify-between gap-3">
				{mode === "list" ? (
					<div className="flex flex-wrap gap-2">
						{["all", ...stages].map((status) => (
							<FilterChip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)} count={status === "all" ? applications.length : applications.filter((application) => application.status === status).length}>
								{status === "all" ? "All" : APP_STATUS[status].label}
							</FilterChip>
						))}
					</div>
				) : (
					<p className="text-sm text-slate-500">Drag a card to another column, or use the arrow button to move it forward.</p>
				)}
				<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
					<label className="sr-only" htmlFor="application-role-filter">Filter by role</label>
					<select id="application-role-filter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-11 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#001022] outline-none transition-[border-color,box-shadow] duration-300 focus:border-[#0B3D91] focus:ring-2 focus:ring-[#E8F0FF]">
						<option value="all">All roles</option>
						{roleTitles.map((title) => <option key={title} value={title}>{title}</option>)}
					</select>
					<SearchBox value={search} onChange={setSearch} placeholder="Search applicants" />
				</div>
			</div>

			{/* List view */}
			{mode === "list" && (
				<ul key={listKey} className="mt-5 space-y-3">
					{visibleApplications.map((application, i) => (
						<Row key={application.id} application={application} index={i} onOpen={openApplication} onAdvance={move} />
					))}
					{visibleApplications.length === 0 && <li><EmptyState title="No applications found" body="New applications will appear here." /></li>}
				</ul>
			)}

			{/* Board view */}
			{mode === "board" && (
				<div key={listKey} className="-mx-1 mt-5 flex snap-x gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:thin]">
					{stages.map((stage) => {
						const items = visibleApplications.filter((a) => a.status === stage);
						const over = overStage === stage;
						return (
							<div
								key={stage}
								onDragOver={(e) => { e.preventDefault(); setOverStage(stage); }}
								onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
								onDrop={dropOn(stage)}
								className={`inq-rise flex w-72 shrink-0 snap-start flex-col rounded-3xl border p-3 transition-[background-color,border-color,box-shadow] duration-300 ${over ? "border-[#0B3D91] bg-[#E8F0FF] shadow-[0_0_0_4px_rgba(188,208,255,0.55)]" : "bg-[#F1F6FF]"}`}
								style={{ borderColor: over ? undefined : C.border }}
								aria-label={`${APP_STATUS[stage].label} column`}
							>
								<div className="flex items-center justify-between px-2 pb-3 pt-1">
									<span className="flex items-center gap-2 text-sm font-bold text-[#001022]">
										<span className={`h-2.5 w-2.5 rounded-full ${STAGE_DOT[stage] ?? "bg-slate-400"}`} />
										{APP_STATUS[stage].label}
									</span>
									<span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-slate-600">{items.length}</span>
								</div>
								<ul className="min-h-[6rem] flex-1 space-y-3">
									{items.map((application, i) => (
										<BoardCard key={application.id} application={application} index={i} onOpen={openApplication} onAdvance={move} onDragStart={setDraggingId} onDragEnd={() => { setDraggingId(null); setOverStage(null); }} dragging={draggingId === application.id} />
									))}
									{items.length === 0 && <li className="grid h-24 place-items-center rounded-2xl border border-dashed border-slate-300 text-xs text-slate-400">Nothing here</li>}
								</ul>
							</div>
						);
					})}
				</div>
			)}

			{/* Detail drawer */}
			<Drawer open={Boolean(currentApplication)} onClose={() => setSelectedId(null)} title="Application">
				{currentApplication && (
					<div>
						<div className="flex items-center gap-4">
							<span className="grid h-16 w-16 place-items-center rounded-full bg-[#E8F0FF] text-xl font-bold text-[#0B3D91]">{initials(currentApplication.name)}</span>
							<div className="min-w-0">
								<p className="truncate text-xl font-bold text-[#001022]">{currentApplication.name}</p>
								<p className="text-sm text-slate-500">{currentApplication.role} · {fmtDate(currentApplication.date)}</p>
								<div className="mt-2"><Badge map={APP_STATUS} value={currentApplication.status} /></div>
							</div>
						</div>

						{/* quick contact */}
						<div className="mt-6 grid grid-cols-3 gap-2">
							<a href={`mailto:${currentApplication.email}?subject=${encodeURIComponent(`Your application for ${currentApplication.role}`)}`} className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#F1F6FF] px-3 py-3 text-xs font-semibold text-[#001022] outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"><AdminIcon name="mail" /> Email</a>
							{currentApplication.phone ? (
								<a href={`tel:${currentApplication.phone.replace(/\s/g, "")}`} className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#F1F6FF] px-3 py-3 text-xs font-semibold text-[#001022] outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"><IcPhone /> Call</a>
							) : (
								<span className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-300"><IcPhone /> No phone</span>
							)}
							{currentApplication.link ? (
								<a href={currentApplication.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#F1F6FF] px-3 py-3 text-xs font-semibold text-[#001022] outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"><IcLink /> Profile</a>
							) : (
								<span className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-300"><IcLink /> No link</span>
							)}
						</div>

						<dl className="mt-4 space-y-2 rounded-2xl border p-4 text-sm" style={{ borderColor: C.border }}>
							<div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="truncate font-semibold text-[#001022]">{currentApplication.email}</dd></div>
							{currentApplication.phone && <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd className="font-semibold text-[#001022]">{currentApplication.phone}</dd></div>}
							<div className="flex justify-between gap-4"><dt className="text-slate-500">Applied</dt><dd className="font-semibold text-[#001022]">{timeAgo(currentApplication.date)}</dd></div>
						</dl>

						{currentApplication.message && (
							<div className="mt-6">
								<p className="text-sm font-semibold text-[#001022]">Message</p>
								<p className="mt-2 rounded-2xl bg-[#F1F6FF] p-4 text-[15px] leading-relaxed text-slate-600">{currentApplication.message}</p>
							</div>
						)}

						{/* stage */}
						<div className="mt-7">
							<p className="mb-4 text-sm font-semibold text-[#001022]">Hiring stage</p>
							{currentApplication.status === "rejected" ? (
								<div className="flex items-center justify-between gap-3 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
									<span className="font-semibold">This application was rejected.</span>
									<button type="button" onClick={() => move(currentApplication, "reviewing")} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-rose-700 outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-rose-400">Reopen</button>
								</div>
							) : (
								<Stepper status={currentApplication.status} onChange={(stage) => move(currentApplication, stage)} />
							)}

							{currentApplication.status !== "rejected" && (
								<div className="mt-5 flex flex-wrap gap-3">
									{nextStage(currentApplication.status) && (
										<PrimaryButton onClick={() => move(currentApplication, nextStage(currentApplication.status))}>
											Move to {APP_STATUS[nextStage(currentApplication.status)].label}
										</PrimaryButton>
									)}
									<button type="button" onClick={() => move(currentApplication, "rejected")} className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 outline-none transition-[background-color,transform] duration-300 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-400 active:scale-[0.98]">
										<IcX /> Reject
									</button>
								</div>
							)}
						</div>

						{/* notes */}
						<label className="mt-7 block text-sm font-semibold text-[#001022]">
							<span className="flex items-center justify-between">
								Private notes
								<span className={`text-xs font-medium transition-opacity duration-300 ${notes !== (currentApplication.notes || "") ? "text-amber-600 opacity-100" : "opacity-0"}`}>Unsaved changes</span>
							</span>
							<textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 focus:border-[#0B3D91] focus:shadow-[0_0_0_4px_rgba(188,208,255,0.55)]" placeholder="Only visible to your team" />
						</label>
						<div className="mt-4">
							<PrimaryButton disabled={notes === (currentApplication.notes || "")} onClick={() => onUpdateApplication(currentApplication.id, { notes }, "Notes saved")}>Save notes</PrimaryButton>
						</div>
					</div>
				)}
			</Drawer>
		</section>
	);
}