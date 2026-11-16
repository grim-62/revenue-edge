import { useMemo, useState } from "react";
import {
	AdminIcon,
	Badge,
	EmptyState,
	FilterChip,
	IconButton,
	Modal,
	PrimaryButton,
	RoleForm,
	SearchBox,
} from "./AdminShared";
import { C, fmtDate, initials, ROLE_STATUS } from "./AdminData";

const STATUS_STRIPE = {
	open: "bg-emerald-500",
	draft: "bg-slate-400",
	closed: "bg-rose-500",
};

const SORTS = {
	newest: { label: "Newest first", fn: (a, b) => new Date(b.posted) - new Date(a.posted) },
	applicants: { label: "Most applicants", fn: (a, b) => b._count - a._count },
	title: { label: "Title A–Z", fn: (a, b) => a.title.localeCompare(b.title) },
};

const rise = (i) => ({ animationDelay: `${Math.min(i, 12) * 60}ms` });

function Tile({ label, value, hint, active, onClick, dot }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className="car-rise group rounded-3xl border bg-white p-5 text-left outline-none transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_40px_-30px_rgba(0,16,34,0.35)] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
			style={{ borderColor: active ? "#001022" : C.border }}
		>
			<span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
				{dot && <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />}
				{label}
			</span>
			<span className="mt-2 block text-4xl font-black tracking-tight text-[#001022]">{value}</span>
			<span className="mt-1 block text-xs text-slate-500">{hint}</span>
		</button>
	);
}

function RoleCard({ role, index, applicants, onEdit, onDelete, onSetStatus }) {
	const people = applicants.slice(0, 3);
	const extra = applicants.length - people.length;
	return (
		<li className="car-rise h-full" style={rise(index + 1)}>
			<article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-[#0B3D91] hover:shadow-[0_28px_44px_-30px_rgba(0,16,34,0.4)]" style={{ borderColor: C.border }}>
				{/* status stripe */}
				<span aria-hidden="true" className={`absolute left-0 top-0 h-1 w-full origin-left transition-transform duration-700 ease-out group-hover:scale-x-100 ${STATUS_STRIPE[role.status] ?? "bg-slate-300"} ${role.status === "open" ? "scale-x-100" : "scale-x-[0.35]"}`} />

				<div className="flex items-start justify-between gap-3">
					<Badge map={ROLE_STATUS} value={role.status} />
					<div className="flex items-center gap-1.5 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
						<IconButton label={`Edit ${role.title}`} onClick={() => onEdit(role)}><AdminIcon name="edit" /></IconButton>
						<IconButton label={`Delete ${role.title}`} danger onClick={() => onDelete(role)}><AdminIcon name="trash" /></IconButton>
					</div>
				</div>

				<h3 className="mt-4 text-xl font-bold leading-snug text-[#001022]">{role.title}</h3>

				<ul className="mt-3 flex flex-wrap gap-2">
					{[role.team, role.type, role.place].filter(Boolean).map((tag) => (
						<li key={tag} className="rounded-full bg-[#F1F6FF] px-3 py-1 text-xs font-semibold text-[#0B3D91]">{tag}</li>
					))}
				</ul>

				{role.description && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">{role.description}</p>}

				<div className="mt-auto pt-6">
					<div className="flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: C.border }}>
						<div className="flex items-center gap-3">
							<span className="flex -space-x-2">
								{people.map((p) => (
									<span key={p.id} title={p.name} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#E8F0FF] text-[11px] font-bold text-[#0B3D91] transition-transform duration-300 group-hover:translate-x-0.5">{initials(p.name)}</span>
								))}
								{extra > 0 && <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#001022] text-[11px] font-bold text-white">+{extra}</span>}
							</span>
							<span className="text-sm font-semibold text-[#001022]">
								{applicants.length} applicant{applicants.length === 1 ? "" : "s"}
							</span>
						</div>
						<span className="text-xs text-slate-500">Posted {fmtDate(role.posted)}</span>
					</div>

					<div className="mt-4">
						{role.status !== "open" ? (
							<PrimaryButton onClick={() => onSetStatus(role, "open")}>{role.status === "draft" ? "Publish role" : "Reopen role"}</PrimaryButton>
						) : (
							<button type="button" onClick={() => onSetStatus(role, "closed")} className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#001022] outline-none transition-[background-color,transform] duration-300 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91] active:scale-[0.98]">Close role</button>
						)}
					</div>
				</div>
			</article>
		</li>
	);
}

export default function AdminCareer({ roles, applications, onSaveRole, onSetRoleStatus, onDeleteRole }) {
	const [filter, setFilter] = useState("all");
	const [sort, setSort] = useState("newest");
	const [search, setSearch] = useState("");
	const [roleModal, setRoleModal] = useState({ open: false, role: null });
	const query = search.trim().toLowerCase();

	const withCounts = useMemo(
		() => roles.map((role) => ({ ...role, _count: applications.filter((a) => a.role === role.title).length })),
		[roles, applications]
	);

	const visibleRoles = useMemo(
		() => withCounts
			.filter((role) => (filter === "all" || role.status === filter) && (!query || `${role.title} ${role.team}`.toLowerCase().includes(query)))
			.sort(SORTS[sort].fn),
		[withCounts, filter, query, sort]
	);

	const countOf = (status) => roles.filter((role) => role.status === status).length;

	const submitRole = async (role) => {
		const saved = await onSaveRole(role);
		if (saved) setRoleModal({ open: false, role: null });
	};

	const listKey = `${filter}-${sort}`;

	return (
		<section>
			<style>{`
				@keyframes car-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
				.car-rise { animation: car-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; }
				@media (prefers-reduced-motion: reduce) { .car-rise { animation: none; } }
			`}</style>

			<div className="ad-head flex flex-wrap items-end justify-between gap-4">
				<div>
					<h2 className="text-3xl font-black uppercase tracking-tight text-[#001022] sm:text-4xl">Careers</h2>
					<p className="mt-1 text-[15px] text-slate-600">Create job openings and control what appears on your careers page.</p>
				</div>
				<PrimaryButton onClick={() => setRoleModal({ open: true, role: null })}><AdminIcon name="plus" /> New role</PrimaryButton>
			</div>

			{/* Status tiles double as filters */}
			<div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Tile label="All roles" value={roles.length} hint="Across every status" active={filter === "all"} onClick={() => setFilter("all")} />
				<Tile label="Open" value={countOf("open")} hint="Live on your website" dot="bg-emerald-500" active={filter === "open"} onClick={() => setFilter("open")} />
				<Tile label="Draft" value={countOf("draft")} hint="Not published yet" dot="bg-slate-400" active={filter === "draft"} onClick={() => setFilter("draft")} />
				<Tile label="Closed" value={countOf("closed")} hint="No longer hiring" dot="bg-rose-500" active={filter === "closed"} onClick={() => setFilter("closed")} />
			</div>

			<div className="ad-head mt-6 flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-2">
					{["all", ...Object.keys(ROLE_STATUS)].map((status) => (
						<FilterChip key={status} active={filter === status} onClick={() => setFilter(status)} count={status === "all" ? roles.length : countOf(status)}>
							{status === "all" ? "All roles" : ROLE_STATUS[status].label}
						</FilterChip>
					))}
				</div>
				<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
					<label className="sr-only" htmlFor="role-sort">Sort roles</label>
					<select id="role-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#001022] outline-none transition-[border-color,box-shadow] duration-300 focus:border-[#0B3D91] focus:ring-2 focus:ring-[#E8F0FF]">
						{Object.entries(SORTS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
					</select>
					<SearchBox value={search} onChange={setSearch} placeholder="Search roles" />
				</div>
			</div>

			<ul key={listKey} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{/* quick-create card */}
				<li className="car-rise">
					<button
						type="button"
						onClick={() => setRoleModal({ open: true, role: null })}
						className="group grid h-full min-h-[16rem] w-full place-items-center rounded-3xl border-2 border-dashed border-[#BCD0FF] bg-[#F1F6FF] p-6 text-center outline-none transition-[background-color,border-color,transform] duration-500 ease-out hover:-translate-y-1 hover:border-[#0B3D91] hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
					>
						<span>
							<span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#0B3D91] shadow-sm transition-transform duration-500 ease-out group-hover:rotate-90 group-hover:scale-110"><AdminIcon name="plus" /></span>
							<span className="mt-4 block text-base font-bold text-[#001022]">Create a new role</span>
							<span className="mt-1 block text-sm text-slate-500">Save it as a draft or publish straight away.</span>
						</span>
					</button>
				</li>

				{visibleRoles.map((role, i) => (
					<RoleCard
						key={role.id}
						role={role}
						index={i}
						applicants={applications.filter((a) => a.role === role.title)}
						onEdit={(r) => setRoleModal({ open: true, role: r })}
						onDelete={onDeleteRole}
						onSetStatus={onSetRoleStatus}
					/>
				))}

				{visibleRoles.length === 0 && <li className="md:col-span-1 xl:col-span-2"><EmptyState title="No roles found" body="Try another filter or search, or create a new role." /></li>}
			</ul>

			<Modal open={roleModal.open} onClose={() => setRoleModal({ open: false, role: null })} title={roleModal.role ? "Edit role" : "New role"} wide>
				{roleModal.open && <RoleForm key={roleModal.role?.id ?? "new"} role={roleModal.role} onSave={submitRole} onCancel={() => setRoleModal({ open: false, role: null })} />}
			</Modal>
		</section>
	);
}