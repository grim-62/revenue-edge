const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const categoryDefinitions = [
  {
    name: "Tax & Compliance",
    slug: "tax",
    eyebrow: "Tax strategy and compliance",
    description:
      "Practical tax advice for individuals and businesses, from accurate returns to long-range planning that keeps more of your money working for you.",
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
  },
  {
    name: "Accounting & Bookkeeping",
    slug: "accounting",
    eyebrow: "Reliable records. Better decisions.",
    description:
      "Reliable accounting and bookkeeping systems that give you cleaner reporting, stronger controls, and confidence in every decision.",
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
  },
  {
    name: "Business Strategy & Advisory",
    slug: "business-advisory",
    eyebrow: "A sharper view of what is next",
    description:
      "Senior guidance for the structures, plans, funding, and transitions that shape the future of your business.",
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
  },
];

const serviceCopy = {
  "business-tax": {
    tagline: "Strategic tax compliance and planning for growing businesses.",
    description:
      "Business tax preparation and planning designed to support accurate reporting, informed decisions, and confidence in your obligations.",
    details:
      "We review your business activity, financial records, and tax position to prepare the right filings and identify planning opportunities. You get a clear view of what is due, what needs attention, and what to consider next.",
    deliverables: [
      "Company and trust tax return preparation",
      "Reconciliation of financial records and tax schedules",
      "Review of deductions, assets, and business structures",
      "Guidance on lodgement dates and next steps",
    ],
  },
  "cryptocurrency-accounting": {
    tagline: "Clear records for complex digital-asset activity.",
    description:
      "Accounting support for digital-asset transactions, exchange records, and the reporting considerations that come with cryptocurrency activity.",
    details:
      "We help organize available transaction data, reconcile records across platforms, and prepare a consistent accounting view. The scope is tailored to your activity and the information available.",
    deliverables: [
      "Transaction data collection and organization",
      "Exchange and wallet record reconciliation",
      "Income and capital transaction summaries",
      "Supporting records for tax reporting",
    ],
  },
  "succession-exit-planning": {
    tagline: "Plan your next chapter with a clear business transition roadmap.",
    description:
      "Practical planning for owners considering a sale, succession, management transition, or other change in business ownership.",
    details:
      "We help you understand the financial and operational preparation involved in a transition, clarify key decisions, and coordinate the planning steps that can make the process more orderly.",
    deliverables: [
      "Business transition goals and readiness review",
      "Financial information and reporting review",
      "Succession or sale planning milestones",
      "Coordination points for legal and financial advice",
    ],
  },
};

const createService = (category) =>
  category.services.map((name) => {
    const slug = slugify(name);
    const specific = serviceCopy[slug] ?? {};
    const categoryDetail = category.name.toLowerCase();

    return {
      name,
      slug,
      href: `/service/${category.slug}/${slug}`,
      categorySlug: category.slug,
      categoryName: category.name,
      tagline:
        specific.tagline ??
        `${name} support shaped around your goals, records, and obligations.`,
      description:
        specific.description ??
        `Practical ${name.toLowerCase()} support for individuals and organizations looking for clear guidance and dependable follow-through.`,
      details:
        specific.details ??
        `We start by understanding your circumstances, reviewing the information available, and agreeing on the right scope. Our team then works through the ${categoryDetail} requirements with clear communication about decisions, documents, and next steps.`,
      benefits: [
        "A clear view of your requirements and next steps",
        "Support tailored to your circumstances and goals",
        "Organized records and practical guidance",
      ],
      deliverables: (specific.deliverables ?? [
        `Initial review of your ${name.toLowerCase()} needs`,
        "A tailored action plan and document checklist",
        "Preparation or review of relevant records",
        "Clear recommendations and follow-up guidance",
      ]).map((title) => ({ title, desc: `Scope and timing are agreed with you before work begins.` })),
      methodology: [
        { step: "01", title: "Understand", desc: "Discuss your goals, circumstances, and immediate priorities." },
        { step: "02", title: "Review", desc: "Gather and assess the relevant records and information." },
        { step: "03", title: "Recommend", desc: "Explain the available options and agree on a practical course of action." },
        { step: "04", title: "Deliver", desc: "Complete the agreed work and outline any follow-up steps." },
      ],
      whoItsFor: [
        `Individuals or organizations looking for help with ${name.toLowerCase()}.`,
        "Owners and decision-makers who want a clearer view of their next steps.",
        "Clients seeking practical advice tailored to their situation.",
      ],
      faqs: [
        {
          question: `What does ${name} support include?`,
          answer: `The scope depends on your circumstances. We begin with a conversation about your ${name.toLowerCase()} needs, review the relevant information, and confirm the work and timing before proceeding.`,
        },
        {
          question: "What should I prepare before getting started?",
          answer: "Bring any relevant records, prior filings, correspondence, and a short summary of your goals. We will confirm a more specific document list after understanding your situation.",
        },
        {
          question: "How do I get started?",
          answer: "Contact our team to arrange an initial conversation. We will discuss your needs, explain the proposed scope, and agree on the next steps.",
        },
      ],
      stats: [
        { value: "Clear", label: "Agreed scope" },
        { value: "Tailored", label: "To your circumstances" },
        { value: "Practical", label: "Next steps" },
      ],
    };
  });

export const serviceCategories = categoryDefinitions.map((definition) => {
  return {
    name: definition.name,
    slug: definition.slug,
    eyebrow: definition.eyebrow,
    description: definition.description,
    href: `/service/${definition.slug}`,
    items: createService(definition),
  };
});

export const allServices = serviceCategories.flatMap((category) => category.items);

export const getServiceCategory = (slug) =>
  serviceCategories.find((category) => category.slug === slug);

export const getServiceItem = (categorySlug, serviceSlug) =>
  getServiceCategory(categorySlug)?.items.find((item) => item.slug === serviceSlug);
