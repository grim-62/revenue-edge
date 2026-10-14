import { getServiceCategory, getServiceItem } from "../../data/serviceData";

const ArrowIcon = ({ className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className={`h-4 w-4 ${className}`}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function NotFound({ categorySlug }) {
  const category = getServiceCategory(categorySlug);
  return (
    <div className="grid min-h-[70vh] place-items-center bg-white px-5 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3D91]">Service not found</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-[#001022]">
          Let’s find the right support
        </h1>
        <p className="mt-4 text-[#475569]">
          {category
            ? `We couldn’t find that service in ${category.name}. Browse the available services below.`
            : "We couldn’t find that service. Browse all of our services below."}
        </p>
        <a
          href={category?.href ?? "/services"}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#001022] px-6 py-3 font-semibold text-white transition hover:bg-[#0B3D91]"
        >
          Browse services <ArrowIcon />
        </a>
      </div>
    </div>
  );
}

export default function ServiceDetailPage({ categorySlug, serviceSlug }) {
  const service = getServiceItem(categorySlug, serviceSlug);
  if (!service) return <NotFound categorySlug={categorySlug} />;
  const category = getServiceCategory(categorySlug);
  const relatedServices = category.items.filter(({ slug }) => slug !== service.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748B]">
          <a href="/" className="transition hover:text-[#001022]">Home</a>
          <span className="mx-2">/</span>
          <a href="/services" className="transition hover:text-[#001022]">Services</a>
          <span className="mx-2">/</span>
          <a href={category.href} className="transition hover:text-[#001022]">{category.name}</a>
          <span className="mx-2">/</span>
          <span aria-current="page" className="text-[#001022]">{service.name}</span>
        </nav>

        <section className="mt-12 overflow-hidden rounded-4xl bg-[#E8F0FF] px-6 py-12 sm:mt-16 sm:px-12 sm:py-16 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0B3D91]">
              {service.categoryName}
            </p>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.98] tracking-[-0.045em] text-[#001022] sm:text-7xl">
              {service.name}
            </h1>
            <p className="mt-5 text-xl font-semibold text-[#0B3D91] sm:text-2xl">
              {service.tagline}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#475569] sm:text-lg">
              {service.description}
            </p>
            <a
              href="/contact"
              className="mt-8 inline-flex items-center gap-4 rounded-full bg-[#001022] py-1.5 pl-6 pr-2 text-sm font-semibold text-white transition hover:bg-[#0B3D91]"
            >
              Talk to our team
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#001022]">
                <ArrowIcon />
              </span>
            </a>
          </div>
        </section>

        <section aria-label="Service highlights" className="grid gap-4 border-b border-[#E2E8F0] py-7 sm:grid-cols-3 sm:py-9">
          {service.stats.map(({ value, label }) => (
            <div key={label} className="sm:border-l sm:border-[#E2E8F0] sm:pl-6 first:sm:border-0 first:sm:pl-0">
              <p className="text-xl font-bold text-[#001022]">{value}</p>
              <p className="mt-1 text-sm text-[#64748B]">{label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3D91]">The service</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#001022] sm:text-4xl">
              Clear advice, carefully delivered
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#475569]">{service.details}</p>
          </div>
          <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-7 sm:p-9">
            <h2 className="text-xl font-bold text-[#001022]">What you can expect</h2>
            <ul className="mt-5 space-y-4">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-relaxed text-[#475569]">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0B3D91] text-white">
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m3 8 3 3 7-7" />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[#E2E8F0] py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3D91]">Our approach</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#001022] sm:text-4xl">A clear path forward</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.methodology.map(({ step, title, desc }) => (
              <article key={step} className="rounded-3xl border border-[#E2E8F0] p-6">
                <span className="text-sm font-bold text-[#0B3D91]">{step}</span>
                <h3 className="mt-4 text-lg font-bold text-[#001022]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-t border-[#E2E8F0] py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3D91]">Your engagement</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#001022]">What we can help with</h2>
            <ul className="mt-6 divide-y divide-[#E2E8F0]">
              {service.deliverables.map(({ title, desc }, index) => (
                <li key={title} className="flex gap-4 py-4">
                  <span className="pt-0.5 text-xs font-bold text-[#0B3D91]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold text-[#001022]">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748B]">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-[#001022] p-7 text-white sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A9C4FA]">A good fit for</p>
            <h2 className="mt-3 text-2xl font-bold">Who we work with</h2>
            <ul className="mt-6 space-y-4">
              {service.whoItsFor.map((audience) => (
                <li key={audience} className="border-t border-white/15 pt-4 text-sm leading-relaxed text-white/75">
                  {audience}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[#E2E8F0] py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3D91]">Questions</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#001022] sm:text-4xl">Frequently asked</h2>
          <div className="mt-8 divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
            {service.faqs.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold text-[#001022] marker:hidden">
                  {question}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#CBD5E1] text-lg transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-relaxed text-[#64748B]">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {relatedServices.length > 0 && (
          <section className="border-t border-[#E2E8F0] pt-14 sm:pt-20">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3D91]">Keep exploring</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#001022]">Related services</h2>
              </div>
              <a href={category.href} className="inline-flex items-center gap-2 text-sm font-semibold text-[#001022] hover:text-[#0B3D91]">
                All {category.name} services <ArrowIcon />
              </a>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {relatedServices.map((item) => (
                <a key={item.href} href={item.href} className="group rounded-3xl border border-[#E2E8F0] p-6 transition hover:border-[#001022]">
                  <h3 className="font-bold text-[#001022]">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{item.tagline}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#001022]">
                    View service <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
