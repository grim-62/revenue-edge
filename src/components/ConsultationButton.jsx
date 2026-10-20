import { Link } from "react-router-dom";

const FLUID_HOVER =
  "relative isolate overflow-hidden before:absolute before:-left-[140%] before:top-[-60%] before:z-0 before:h-[220%] before:w-[135%] before:rounded-[50%] before:bg-[#0B3D91] before:content-[''] before:transition-[left] before:duration-700 before:delay-100 before:ease-[cubic-bezier(0.55,0,0.1,1)] after:absolute after:-left-[165%] after:top-[-65%] after:z-0 after:h-[230%] after:w-[150%] after:rounded-[50%] after:bg-[#0B3D91] after:content-[''] after:transition-[left] after:duration-700 after:delay-150 after:ease-[cubic-bezier(0.55,0,0.1,1)] hover:before:-left-[12%] hover:after:-left-[25%] focus-visible:before:-left-[12%] focus-visible:after:-left-[25%] motion-reduce:before:transition-none motion-reduce:after:transition-none";

const VARIANTS = {
  light: {
    button: `bg-white text-[#001022] hover:text-white ${FLUID_HOVER}`,
    icon: "bg-[#001022] text-white group-hover:bg-white group-hover:text-[#001022] group-focus-visible:bg-white group-focus-visible:text-[#001022]",
  },
  dark: {
    button: `bg-[#001022] text-white ${FLUID_HOVER}`,
    icon: "bg-white text-[#001022]",
  },
};

const SIZES = {
  compact: {
    button: "gap-3 py-1.5 pl-5 pr-1.5 text-sm",
    icon: "h-8 w-8",
  },
  regular: {
    button: "gap-4 py-1.5 pl-7 pr-1.5 text-[15px]",
    icon: "h-10 w-10",
  },
};

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ConsultationButton({
  href = "/contact",
  label = "Book a consultation",
  variant = "dark",
  size = "regular",
  className = "",
  onClick,
}) {
  const style = VARIANTS[variant] ?? VARIANTS.dark;
  const dimensions = SIZES[size] ?? SIZES.regular;
  const classes = `group inline-flex shrink-0 items-center rounded-full font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 ${dimensions.button} ${style.button} ${className}`;
  const content = (
    <>
      <span className="relative z-10">{label}</span>
      <span className={`relative z-10 grid place-items-center rounded-full transition-colors duration-300 ${dimensions.icon} ${style.icon}`}>
        <ArrowIcon />
      </span>
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link to={href} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick} className={classes}>
      {content}
    </a>
  );
}