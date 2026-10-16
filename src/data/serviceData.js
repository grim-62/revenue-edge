const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ───────── Categories (the three main services) ─────────
   Used by: Navbar, ServicesPage / ServicesAccordion, ServiceCategoryPage, ServiceDetailPage.
   art / tag / intro      → ServicesAccordion
   heroImage/partnerImage → category page + every service in that category (a service can override them below)
   details                → longer overview shown on the category page
   Everything else feeds both the category page and the service detail pages. */
const categoryDefinitions = [
  {
    name: "Accounting & Bookkeeping",
    slug: "accounting",
    services: [
      "Migration Agent bookkeeping",
      "Not for Profit Accounting",
      "Business Start-up Accounting",
      "Property Accounting",
      "BAS Accounting",
      "Xero Accounting",
      "QuickBooks Accounting",
      "MYOB Accounting",
      "Foreign-owned Business Accounting",
      "Cryptocurrency Accounting",
    ],
    art: "chart",
    tag: "Cleaner books",
    heroImage: "/img1.jpg",
    partnerImage: "/img2.jpg",
    eyebrow: "Reliable records. Better decisions.",
    description:
      "Reliable accounting and bookkeeping systems that give you cleaner reporting, stronger controls, and confidence in every decision.",
    intro: "Clean records and reporting you can actually use to run the business.",
    details:
      "Good decisions start with good records. We set up and maintain accounting systems that keep your books accurate, reconciled and ready for reporting, whether you run Xero, QuickBooks or MYOB. From start-ups and property investors to not-for-profits and overseas-owned businesses, we shape the service around how you operate.",
    partnerLabel: "Accounting",
    stats: [
      { value: "Monthly", label: "Reporting you can rely on" },
      { value: "Reconciled", label: "Accounts kept up to date" },
      { value: "Cloud", label: "Xero, QuickBooks and MYOB" },
    ],
    benefits: [
      "Books that are accurate and up to date",
      "Reports that show how the business is really going",
      "Fewer surprises at BAS and tax time",
    ],
    whoItsFor: ["Small businesses", "Start-ups", "Not-for-profits", "Property investors", "Overseas-owned companies"],
    deliverables: [
      ["Setup and clean-up", "We set up or tidy your chart of accounts and bank feeds."],
      ["Regular bookkeeping", "Transactions are coded and reconciled on an agreed schedule."],
      ["Reporting", "You receive clear profit, loss and cash position reports."],
      ["Compliance support", "Records are ready for BAS, payroll and year-end."],
    ],
    faqs: (n) => [
      {
        question: `What does ${n} cover?`,
        answer: `We agree the scope with you first. Typically that means setting up or cleaning your records, keeping them reconciled, and providing regular reports.`,
      },
      {
        question: "Can you take over from my current bookkeeper?",
        answer: "Yes. We review the existing records, fix any gaps, and take over with minimal disruption to you.",
      },
      {
        question: "Which software do you work with?",
        answer: "We work with Xero, QuickBooks and MYOB, and can advise on which suits your business best.",
      },
    ],
  },
  {
    name: "Business Strategy & Advisory",
    slug: "business-advisory",
    services: [
      "Business Structures",
      "Business Planning",
      "Business Coaching",
      "Business Funding",
      "Succession & Exit Planning",
      "Business Continuity Planning",
      "Selling A Business",
      "Business Name Change",
      "Business Address Update",
      "Entity Closure",
      "Client Authority",
      "Client Onboarding",
    ],
    art: "coins",
    tag: "Plan the next step",
    heroImage: "/img3.jpg",
    partnerImage: "/img7.jpg",
    eyebrow: "A sharper view of what is next",
    description:
      "Senior guidance for the structures, plans, funding, and transitions that shape the future of your business.",
    intro: "Structures, plans, funding and transitions, with senior guidance.",
    details:
      "Every business reaches moments that need more than day-to-day accounting: choosing a structure, planning growth, raising funds, or preparing for a sale or exit. We bring senior guidance and your real numbers to those decisions, and coordinate with your lawyer and financial planner where needed.",
    partnerLabel: "Advisory",
    stats: [
      { value: "Senior", label: "Hands-on guidance" },
      { value: "Practical", label: "Plans you can act on" },
      { value: "Joined up", label: "With your legal and financial team" },
    ],
    benefits: [
      "A clear plan for where the business is heading",
      "Decisions backed by your real numbers",
      "Smoother changes, sales and transitions",
    ],
    whoItsFor: ["Business owners", "Growing companies", "Founders planning an exit", "Family businesses", "New clients"],
    deliverables: [
      ["Discovery", "We understand your goals, position and timeline."],
      ["Analysis", "We review the financial and structural information that matters."],
      ["Recommendations", "You get clear options with the trade-offs explained."],
      ["Action plan", "We map the steps, owners and milestones."],
    ],
    faqs: (n) => [
      {
        question: `Who is ${n} suitable for?`,
        answer: `Owners and decision-makers who want a clear, practical view of their next step. We tailor the scope to your situation.`,
      },
      {
        question: "Do you work with my lawyer and financial planner?",
        answer: "Yes. Where legal or financial advice is needed, we coordinate with your existing advisers.",
      },
      {
        question: "How do we get started?",
        answer: "Contact us for an initial conversation. We will discuss your goals, propose a scope, and agree the next steps.",
      },
    ],
  },
  {
    name: "Tax & Compliance",
    slug: "tax",
    services: [
      "Foreign Tax",
      "Business Tax",
      "Individual Tax",
      "Tax Returns",
      "Tax Management",
      "Tax Planning",
      "Tax Minimisation",
      "Tax Compliance",
      "IT Tax Management",
    ],
    art: "calc",
    tag: "Lodged on time",
    heroImage: "/img4.jpg",
    partnerImage: "/img6.jpg",
    eyebrow: "Tax strategy and compliance",
    description:
      "Practical tax advice for individuals and businesses, from accurate returns to long-range planning that keeps more of your money working for you.",
    intro: "Accurate returns, clear obligations and planning that looks ahead.",
    details:
      "Tax is easier when someone is looking ahead for you. We prepare and lodge accurate returns, keep track of what is due and when, and plan so that decisions made today don’t create surprises later, for individuals, sole traders, company directors, trusts and foreign residents.",
    partnerLabel: "Tax",
    stats: [
      { value: "On time", label: "Lodgements tracked for you" },
      { value: "1-to-1", label: "Advice from a named adviser" },
      { value: "Year-round", label: "Planning, not just tax season" },
    ],
    benefits: [
      "Clear view of what is due and when",
      "Planning that looks beyond this year's return",
      "Records and lodgements kept compliant",
    ],
    whoItsFor: ["Individuals", "Sole traders", "Company directors", "Trusts & partnerships", "Foreign residents"],
    deliverables: [
      ["Initial review", "We look at your position and confirm the scope before any work starts."],
      ["Records and schedules", "We prepare or check the supporting records and schedules."],
      ["Preparation and lodgement", "Returns and forms are prepared, reviewed and lodged on time."],
      ["Planning and follow-up", "You get clear recommendations and what to do next."],
    ],
    faqs: (n) => [
      {
        question: `What does ${n} support include?`,
        answer: `It depends on your circumstances. We start with a conversation, review your information, and confirm the work, timing and fee before we begin.`,
      },
      {
        question: "What should I bring to the first meeting?",
        answer: "Prior returns, notices from the tax office, income and expense records, and a short note on your goals. We will send a specific checklist after we speak.",
      },
      {
        question: "Can you help if I am behind on lodgements?",
        answer: "Yes. We review what is outstanding, prioritise it, and work through the catch-up with you step by step.",
      },
    ],
  },
];

/* ───────── Per-service copy: [tagline, short description] ───────── */
const copy = {
  /* Tax & Compliance */
  "foreign-tax": ["Tax guidance for cross-border income and residency.", "Support for people and businesses with overseas income, assets or residency changes."],
  "business-tax": ["Strategic tax compliance and planning for growing businesses.", "Business tax preparation and planning designed to support accurate reporting and confidence in your obligations."],
  "individual-tax": ["Personal tax handled accurately and on time.", "Clear help with your personal tax position, deductions and obligations."],
  "tax-returns": ["Accurate returns, prepared and lodged for you.", "Preparation and lodgement of returns for individuals, companies, trusts and partnerships."],
  "tax-management": ["One place to track every tax obligation.", "Ongoing management of your tax obligations, deadlines and correspondence."],
  "tax-planning": ["Plan ahead and keep more of what you earn.", "Forward-looking planning to help you make tax-aware decisions before the year ends."],
  "tax-minimisation": ["Legitimate ways to reduce what you pay.", "A review of lawful strategies, deductions and structures that can reduce your tax."],
  "tax-compliance": ["Meet your obligations without the stress.", "Support to stay compliant with lodgements, payments and record-keeping requirements."],
  "it-tax-management": ["Tax support built for IT and technology businesses.", "Tax management covering R&D, contractors, software and international clients."],

  /* Accounting & Bookkeeping */
  "migration-agent-bookkeeping": ["Trust-compliant records for migration practices.", "Bookkeeping built for migration agents, including client funds and trust account requirements."],
  "not-for-profit-accounting": ["Accounting that supports your mission.", "Clear reporting and compliance support for charities and not-for-profit organisations."],
  "business-start-up-accounting": ["Start with the right foundations.", "Setup, systems and advice to get a new business running on solid financial footing."],
  "property-accounting": ["Clear numbers for property investors.", "Records and reporting for rental properties, developments and property portfolios."],
  "bas-accounting": ["BAS prepared and lodged without the scramble.", "Accurate GST and BAS preparation, reviewed and lodged on time."],
  "xero-accounting": ["Xero set up and kept in order.", "Setup, clean-up and ongoing support for businesses running on Xero."],
  "quickbooks-accounting": ["QuickBooks that works for your business.", "Setup, clean-up and ongoing support for businesses running on QuickBooks."],
  "myob-accounting": ["MYOB support you can rely on.", "Setup, clean-up and ongoing support for businesses running on MYOB."],
  "foreign-owned-business-accounting": ["Local compliance for overseas-owned businesses.", "Accounting and reporting for businesses owned or controlled from overseas."],
  "cryptocurrency-accounting": ["Clear records for complex digital-asset activity.", "Accounting support for digital-asset transactions, exchange records and related reporting."],

  /* Business Strategy & Advisory */
  "business-structures": ["The right structure for how you operate.", "Guidance on company, trust, partnership and sole trader structures and when to change them."],
  "business-planning": ["A plan that turns goals into numbers.", "Business plans and forecasts you can use to run the business and talk to lenders."],
  "business-coaching": ["Regular, practical coaching for owners.", "Ongoing sessions to keep you accountable on goals, cash flow and growth."],
  "business-funding": ["Be ready when you need finance.", "Help preparing your financials and plan to approach lenders and investors."],
  "succession-and-exit-planning": ["Plan your next chapter with a clear transition roadmap.", "Practical planning for owners considering a sale, succession or other change in ownership."],
  "business-continuity-planning": ["Keep the business running when things change.", "Planning for the people, systems and finances needed to withstand disruption."],
  "selling-a-business": ["Prepare well and sell with confidence.", "Financial preparation and coordination to support a smoother business sale."],
  "business-name-change": ["Change your business name correctly.", "Support with the registrations and updates a name change involves."],
  "business-address-update": ["Update your address across the right registers.", "Help updating your business address with the relevant agencies and records."],
  "entity-closure": ["Close an entity properly and tidily.", "Support with final returns, deregistration and the steps to wind up an entity."],
  "client-authority": ["Set up authority to act on your behalf.", "Help granting us the access we need to deal with agencies for you."],
  "client-onboarding": ["A simple, organised start with us.", "A guided onboarding so we have the right information and access from day one."],
};

/* Individual services that need their own picture */
const serviceOverrides = {
  "foreign-tax": { heroImage: "/img5.jpg" },
  "business-start-up-accounting": { heroImage: "/img7.jpg" },
};

const methodology = [
  { step: "01", title: "Understand", desc: "We discuss your goals, circumstances and immediate priorities." },
  { step: "02", title: "Review", desc: "We gather and assess the records and information that matter." },
  { step: "03", title: "Recommend", desc: "We explain the options and agree a practical course of action." },
  { step: "04", title: "Deliver", desc: "We complete the agreed work and outline any follow-up." },
];

/* ───────── Builders ───────── */
const toDeliverables = (list) => list.map(([title, desc]) => ({ title, desc }));

const createServices = (category) =>
  category.services.map((name) => {
    const slug = slugify(name);
    const [tagline, description] = copy[slug] ?? [
      `${name} support shaped around your goals.`,
      `Practical ${name.toLowerCase()} support with clear guidance and dependable follow-through.`,
    ];

    return {
      name,
      slug,
      href: `/service/${category.slug}/${slug}`,
      categorySlug: category.slug,
      categoryName: category.name,
      tagline,
      description,
      heroImage: serviceOverrides[slug]?.heroImage ?? category.heroImage,
      partnerImage: serviceOverrides[slug]?.partnerImage ?? category.partnerImage,
      details: `We start by understanding your circumstances and agreeing the scope for ${name.toLowerCase()}. From there we work through the requirements with clear communication about decisions, documents and next steps.`,
      stats: category.stats,
      deliverables: toDeliverables(category.deliverables),
      benefits: category.benefits,
      whoItsFor: category.whoItsFor,
      methodology,
      faqs: category.faqs(name),
    };
  });

/* ───────── Exports ───────── */
/* Note: `tag` is deliberately NOT on these objects, so the Navbar keeps showing "N services" in its pills.
   The tag lives in accordionCategories below. */
export const serviceCategories = categoryDefinitions.map((d) => ({
  name: d.name,
  slug: d.slug,
  href: `/service/${d.slug}`,
  eyebrow: d.eyebrow,
  description: d.description,
  intro: d.intro,
  details: d.details,
  partnerLabel: d.partnerLabel,
  art: d.art,
  heroImage: d.heroImage,
  image: d.heroImage,
  partnerImage: d.partnerImage,
  stats: d.stats,
  benefits: d.benefits,
  whoItsFor: d.whoItsFor,
  deliverables: toDeliverables(d.deliverables),
  methodology,
  faqs: d.faqs(d.name),
  items: createServices(d),
}));

/* Pass this straight to <ServicesAccordion categories={accordionCategories} /> */
export const accordionCategories = serviceCategories.map((c, i) => ({
  id: c.slug,
  title: c.name,
  href: c.href,
  art: categoryDefinitions[i].art,
  image: categoryDefinitions[i].heroImage,
  tag: categoryDefinitions[i].tag,
  intro: categoryDefinitions[i].intro,
  items: c.items.map(({ name, tagline, href }) => ({ name, description: tagline, href })),
}));

export const allServices = serviceCategories.flatMap((c) => c.items);

export const getServiceCategory = (slug) => {
  if (!slug) return undefined;
  const clean = slugify(String(slug).trim());
  return serviceCategories.find((c) => c.slug === clean || slugify(c.name) === clean);
};

export const getServiceItem = (categorySlug, serviceSlug) => {
  if (!serviceSlug && categorySlug) {
    return allServices.find((i) => i.slug === categorySlug);
  }
  const category = getServiceCategory(categorySlug);
  if (category) {
    const item = category.items.find((i) => i.slug === serviceSlug);
    if (item) return item;
  }
  return allServices.find((i) => i.slug === serviceSlug);
};

/* For the "Explore other services" navigation at the bottom of a category page.
   others starts with the next main service and ends with the previous one. */
export const getAdjacentCategories = (slug) => {
  const index = serviceCategories.findIndex((c) => c.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined, others: [] };
  const total = serviceCategories.length;
  const others = Array.from({ length: total - 1 }, (_, i) => serviceCategories[(index + 1 + i) % total]);
  return {
    previous: serviceCategories[(index - 1 + total) % total],
    next: serviceCategories[(index + 1) % total],
    others,
  };
};