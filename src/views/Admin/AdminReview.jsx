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

const rise = (i) => ({ animationDelay: `${Math.min(i, 12) * 55}ms` });

const QuoteMark = ({ className = "" }) => (
	<svg viewBox="0 0 48 36" className={className} fill="currentColor" aria-hidden="true">
		<path d="M0 36V21.6C0 9.6 6.4 2.4 18 0l1.6 5.6C13.6 7.6 11 11.2 10.6 16H20v20H0zm28 0V21.6C28 9.6 34.4 2.4 46 0l1.6 5.6C41.6 7.6 39 11.2 38.6 16H48v20H28z" />
	</svg>
);

function Summary({ reviews }) {
	const published = reviews.filter((r) => r.status === "published");
	const average = published.length ? published.reduce((t, r) => t + r.rating, 0) / published.length : 0;
	const rows = [5, 4, 3, 2, 1].map((n) => ({ n, count: published.filter((r) => r.rating === n).length }));
	const max = Math.max(1, ...rows.map((r) => r.count));
	const featured = reviews.filter((r) => r.featured).length;
	const pending = reviews.filter((r) => r.status === "pending").length;

	return (
		<div className="rev-rise grid gap-4 lg:grid-cols-[1.1fr_1fr]">
			<div className="rounded-3xl border bg-white p-6" style={{ borderColor: C.border }}>
				<div className="flex items-center gap-6">
					<div className="text-center">
						<p className="text-6xl font-black tracking-tight text-[#001022]">{average.toFixed(1)}</p>
						<div className="mt-2 flex justify-center"><Stars value={Math.round(average)} /></div>
						<p className="mt-1 text-xs text-slate-500">{published.length} published</p>
					</div>
					<ul className="flex-1 space-y-2">
						{rows.map(({ n, count }) => (
							<li key={n} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
								<span className="w-3">{n}</span>
								<span className="h-2 flex-1 overflow-hidden rounded-full bg-[#E8F0FF]">
									<span className="rev-bar block h-full origin-left rounded-full bg-[#F5B301]" style={{ width: `${(count / max) * 100}%` }} />
								</span>
								<span className="w-4 text-right text-[#001022]">{count}</span>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="rounded-3xl p-6 text-white" style={{ backgroundColor: "#001022", backgroundImage: "radial-gradient(70% 90% at 100% 0%, rgba(11,61,145,0.5), transparent 70%)" }}>
					<p className="text-sm font-semibold text-[#BCD0FF]">Waiting for you</p>
					<p className="mt-3 text-5xl font-black tracking-tight">{pending}</p>
					<p className="mt-1 text-xs text-white/60">review{pending === 1 ? "" : "s"} to approve</p>
				</div>
				<div className="rounded-3xl border bg-[#F1F6FF] p-6" style={{ borderColor: C.border }}>
					<p className="text-sm font-semibold text-slate-500">On homepage</p>
					<p className="mt-3 text-5xl font-black tracking-tight text-[#001022]">{featured}</p>
					<p className="mt-1 text-xs text-slate-500">featured review{featured === 1 ? "" : "s"}</p>
				</div>
			</div>
		</div>
	);
}

function ReviewCard({ review, index, onPatchReview, onDeleteReview }) {
	return (
		<li className="rev-rise mb-4 break-inside-avoid" style={rise(index)}>
			<article className={`group relative flex flex-col rounded-3xl border bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-[#0B3D91] hover:shadow-[0_28px_44px_-30px_rgba(0,16,34,0.4)] ${review.status === "hidden" ? "opacity-75" : ""}`} style={{ borderColor: C.border }}>
				{review.featured && (
					<span className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-[#BCD0FF] px-3 py-1 text-xs font-bold text-[#001022] shadow-sm">
						<AdminIcon name="star" filled /> Featured
					</span>
				)}

				<div className="flex items-start justify-between gap-3">
					<span className="text-[#0B3D91]"><QuoteMark className="h-7 w-9 transition-transform duration-500 ease-out group-hover:-rotate-6" /></span>
					<div className="flex flex-col items-end gap-2">
						<Stars value={review.rating} />
						<Badge map={REVIEW_STATUS} value={review.status} />
					</div>
				</div>

				<p className="mt-4 text-[15px] leading-relaxed text-slate-600">{review.text}</p>

				{review.service && <span className="mt-4 inline-flex w-fit rounded-full bg-[#E8F0FF] px-3 py-1 text-xs font-semibold text-[#0B3D91]">{review.service}</span>}

				<div className="mt-5 flex items-center gap-3 border-t pt-4" style={{ borderColor: C.border }}>
					<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91]">{initials(review.name)}</span>
					<div className="min-w-0">
						<p className="truncate text-sm font-bold text-[#001022]">{review.name}</p>
						<p className="truncate text-xs text-slate-500">{review.role} · {fmtDate(review.date)}</p>
					</div>
				</div>

				<div className="mt-4 flex flex-wrap items-center gap-2">
					{review.status !== "published" && (
						<button type="button" onClick={() => onPatchReview(review.id, { status: "published" }, "Review published")} className="inline-flex items-center gap-2 rounded-full bg-[#001022] px-4 py-2 text-sm font-semibold text-white outline-none transition-[background-color,transform] duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 active:scale-[0.98]">
							<AdminIcon name="check" /> {review.status === "pending" ? "Approve" : "Publish"}
						</button>
					)}
					{review.status !== "hidden" && (
						<button type="button" onClick={() => onPatchReview(review.id, { status: "hidden", featured: false }, "Review hidden")} className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#001022] outline-none transition-[background-color,transform] duration-300 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91] active:scale-[0.98]">
							<AdminIcon name="eyeOff" /> Hide
						</button>
					)}
					<span className="ml-auto flex items-center gap-2">
						<IconButton
							label={review.featured ? "Remove from featured" : "Feature on homepage"}
							active={review.featured}
							onClick={() => onPatchReview(review.id, { featured: !review.featured, ...(review.status !== "published" && !review.featured ? { status: "published" } : {}) }, review.featured ? "Removed from featured" : "Featured on homepage")}
						>
							<AdminIcon name="star" filled={review.featured} />
						</IconButton>
						<IconButton label={`Delete review by ${review.name}`} danger onClick={() => onDeleteReview(review)}><AdminIcon name="trash" /></IconButton>
					</span>
				</div>
			</article>
		</li>
	);
}

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

	const pending = reviews.filter((review) => review.status === "pending");
	const approveAll = () => pending.forEach((review) => onPatchReview(review.id, { status: "published" }, `Approved ${pending.length} review${pending.length === 1 ? "" : "s"}`));

	const listKey = `${statusFilter}-${ratingFilter}`;

	return (
		<section>
			<style>{`
				@keyframes rev-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
				@keyframes rev-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
				.rev-rise { animation: rev-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; }
				.rev-bar { animation: rev-bar 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both; }
				@media (prefers-reduced-motion: reduce) { .rev-rise, .rev-bar { animation: none; } }
			`}</style>

			<div className="ad-head flex flex-wrap items-end justify-between gap-4">
				<div>
					<h2 className="text-3xl font-black uppercase tracking-tight text-[#001022] sm:text-4xl">Reviews</h2>
					<p className="mt-1 text-[15px] text-slate-600">Approve, feature, or hide the feedback shown on your website.</p>
				</div>
				{pending.length > 1 && (
					<button type="button" onClick={approveAll} className="inline-flex items-center gap-2 rounded-full bg-[#001022] px-5 py-2.5 text-sm font-semibold text-white outline-none transition-[background-color,transform] duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 active:scale-[0.98]">
						<AdminIcon name="check" /> Approve all pending ({pending.length})
					</button>
				)}
			</div>

			<div className="mt-6"><Summary reviews={reviews} /></div>

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
					<select id="review-rating-filter" value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)} className="h-11 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#001022] outline-none transition-[border-color,box-shadow] duration-300 focus:border-[#0B3D91] focus:ring-2 focus:ring-[#E8F0FF]">
						<option value="all">Any rating</option>
						{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
					</select>
					<SearchBox value={search} onChange={setSearch} placeholder="Search reviews" />
				</div>
			</div>

			{visibleReviews.length > 0 ? (
				<ul key={listKey} className="mt-8 columns-1 gap-4 md:columns-2 xl:columns-3">
					{visibleReviews.map((review, i) => (
						<ReviewCard key={review.id} review={review} index={i} onPatchReview={onPatchReview} onDeleteReview={onDeleteReview} />
					))}
				</ul>
			) : (
				<div className="mt-5"><EmptyState title="No reviews found" body="Try changing the filters or search terms." /></div>
			)}
		</section>
	);
}