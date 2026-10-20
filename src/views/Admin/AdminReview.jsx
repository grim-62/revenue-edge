import { useMemo, useState } from "react";
import {
	AdminIcon,
	Badge,
	EmptyState,
	FilterChip,
	IconButton,
	SearchBox,
	Stars,
} from "./AdminShared";
import { C, fmtDate, initials, REVIEW_STATUS } from "./AdminData";

export default function AdminReview({ reviews, onPatchReview, onDeleteReview }) {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [ratingFilter, setRatingFilter] = useState("all");
	const query = search.trim().toLowerCase();

	const visibleReviews = useMemo(
		() => reviews.filter((review) =>
			(statusFilter === "all" || review.status === statusFilter)
			&& (ratingFilter === "all" || review.rating === Number(ratingFilter))
			&& (!query || `${review.name} ${review.text} ${review.service ?? ""}`.toLowerCase().includes(query))
		),
		[reviews, statusFilter, ratingFilter, query]
	);

	return (
		<section>
			<div className="ad-head">
				<h2 className="text-3xl font-black uppercase tracking-tight text-[#001022] sm:text-4xl">Reviews</h2>
				<p className="mt-1 text-[15px] text-slate-600">Approve, feature, or hide the feedback shown on your website.</p>
			</div>

			<div className="ad-head mt-6 flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-2">
					{["all", ...Object.keys(REVIEW_STATUS)].map((status) => (
						<FilterChip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)} count={status === "all" ? reviews.length : reviews.filter((review) => review.status === status).length}>
							{status === "all" ? "All reviews" : REVIEW_STATUS[status].label}
						</FilterChip>
					))}
				</div>
				<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
					<label className="sr-only" htmlFor="review-rating-filter">Filter by rating</label>
					<select id="review-rating-filter" value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)} className="h-11 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#001022] outline-none focus:border-[#0B3D91] focus:ring-2 focus:ring-[#E8F0FF]">
						<option value="all">Any rating</option>
						{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
					</select>
					<SearchBox value={search} onChange={setSearch} placeholder="Search reviews" />
				</div>
			</div>

			<ul className="mt-5 space-y-3">
				{visibleReviews.map((review) => (
					  <li key={review.id} className="ad-item rounded-3xl border bg-white p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-30px_rgba(0,16,34,0.35)] sm:px-6 sm:py-6" style={{ borderColor: C.border }}>
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div className="flex items-center gap-3">
								<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91]">{initials(review.name)}</span>
								<div><p className="text-[15px] font-bold text-[#001022]">{review.name}</p><p className="text-xs text-slate-500">{review.role}{review.service ? ` · ${review.service}` : ""} · {fmtDate(review.date)}</p></div>
							</div>
							<div className="flex items-center gap-3"><Stars value={review.rating} /><Badge map={REVIEW_STATUS} value={review.status} /></div>
						</div>

						<p className="mt-4 text-[15px] leading-relaxed text-slate-600">{review.text}</p>

						<div className="mt-5 flex flex-wrap items-center gap-2">
							{review.status !== "published" && <button type="button" onClick={() => onPatchReview(review.id, { status: "published" }, "Review published")} className="inline-flex items-center gap-2 rounded-full bg-[#001022] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B3D91]"><AdminIcon name="check" /> Publish</button>}
							{review.status !== "hidden" && <button type="button" onClick={() => onPatchReview(review.id, { status: "hidden", featured: false }, "Review hidden")} className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#001022] transition-colors hover:bg-[#E8F0FF]"><AdminIcon name="eyeOff" /> Hide</button>}
							<span className="ml-auto flex items-center gap-2">
								<IconButton label={review.featured ? "Remove from featured" : "Feature on homepage"} active={review.featured} onClick={() => onPatchReview(review.id, { featured: !review.featured, ...(review.status !== "published" && !review.featured ? { status: "published" } : {}) }, review.featured ? "Removed from featured" : "Featured on homepage")}>
									<AdminIcon name="star" filled={review.featured} />
								</IconButton>
								<IconButton label={`Delete review by ${review.name}`} danger onClick={() => onDeleteReview(review)}><AdminIcon name="trash" /></IconButton>
							</span>
						</div>
					</li>
				))}
				{visibleReviews.length === 0 && <li><EmptyState title="No reviews found" body="Try changing the filters or search terms." /></li>}
			</ul>
		</section>
	);
}
