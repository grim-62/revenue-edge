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
import { C, fmtDate, ROLE_STATUS } from "./AdminData";

export default function AdminCareer({ roles, applications, onSaveRole, onSetRoleStatus, onDeleteRole }) {
	const [filter, setFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [roleModal, setRoleModal] = useState({ open: false, role: null });
	const query = search.trim().toLowerCase();

	const visibleRoles = useMemo(
		() => roles.filter((role) =>
			(filter === "all" || role.status === filter)
			&& (!query || `${role.title} ${role.team}`.toLowerCase().includes(query))
		),
		[roles, filter, query]
	);

	const submitRole = async (role) => {
		const saved = await onSaveRole(role);
		if (saved) setRoleModal({ open: false, role: null });
	};

	return (
		<section>
			<div className="ad-head flex flex-wrap items-end justify-between gap-4">
				<div>
					<h2 className="text-3xl font-black uppercase tracking-tight text-[#001022] sm:text-4xl">Careers</h2>
					<p className="mt-1 text-[15px] text-slate-600">Manage job openings and their publication status.</p>
				</div>
				<PrimaryButton onClick={() => setRoleModal({ open: true, role: null })}><AdminIcon name="plus" /> New role</PrimaryButton>
			</div>

			<div className="ad-head mt-6 flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-2">
					{["all", ...Object.keys(ROLE_STATUS)].map((status) => (
						<FilterChip key={status} active={filter === status} onClick={() => setFilter(status)} count={status === "all" ? roles.length : roles.filter((role) => role.status === status).length}>
							{status === "all" ? "All roles" : ROLE_STATUS[status].label}
						</FilterChip>
					))}
				</div>
				<SearchBox value={search} onChange={setSearch} placeholder="Search roles" />
			</div>

			<ul className="mt-5 space-y-3">
				{visibleRoles.map((role) => (
					  <li key={role.id} className="ad-item flex flex-col gap-4 rounded-3xl border bg-white p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-30px_rgba(0,16,34,0.35)] sm:flex-row sm:items-center sm:justify-between sm:px-6" style={{ borderColor: C.border }}>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-3">
								<h3 className="text-lg font-bold text-[#001022]">{role.title}</h3>
								<Badge map={ROLE_STATUS} value={role.status} />
							</div>
							<p className="mt-1 text-sm text-slate-600">{[role.team, role.type, role.place].filter(Boolean).join(" · ")} · Posted {fmtDate(role.posted)} · {applications.filter((application) => application.role === role.title).length} applicants</p>
							{role.description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{role.description}</p>}
						</div>
						<div className="flex shrink-0 items-center gap-2">
							{role.status !== "open" ? <PrimaryButton onClick={() => onSetRoleStatus(role, "open")}>Publish</PrimaryButton> : <button type="button" onClick={() => onSetRoleStatus(role, "closed")} className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#001022] hover:bg-[#E8F0FF]">Close</button>}
							<IconButton label={`Edit ${role.title}`} onClick={() => setRoleModal({ open: true, role })}><AdminIcon name="edit" /></IconButton>
							<IconButton label={`Delete ${role.title}`} danger onClick={() => onDeleteRole(role)}><AdminIcon name="trash" /></IconButton>
						</div>
					</li>
				))}
				{visibleRoles.length === 0 && <li><EmptyState title="No roles found" body="Try another filter or create a new role." /></li>}
			</ul>

			<Modal open={roleModal.open} onClose={() => setRoleModal({ open: false, role: null })} title={roleModal.role ? "Edit role" : "New role"} wide>
				{roleModal.open && <RoleForm key={roleModal.role?.id ?? "new"} role={roleModal.role} onSave={submitRole} onCancel={() => setRoleModal({ open: false, role: null })} />}
			</Modal>
		</section>
	);
}
