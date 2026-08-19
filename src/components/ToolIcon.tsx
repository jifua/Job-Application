import type { ToolSummary } from "../types/tools";

interface ToolIconProps {
  icon: ToolSummary["icon"];
  className?: string;
}

/**
 * Hand-picked schematic-style SVG icons for each tool.
 * Kept inline (no icon library) to avoid adding bundle weight
 * for five small glyphs.
 */
export function ToolIcon({ icon, className = "h-6 w-6" }: ToolIconProps) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (icon) {
    case "match":
      return (
        <svg {...common}>
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "analyze":
      return (
        <svg {...common}>
          <path d="M4 19h16M7 19V9m5 10V5m5 14v-7" />
        </svg>
      );
    case "letter":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M3 6.5l9 6 9-6" />
        </svg>
      );
    case "practice":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case "tracker":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
        </svg>
      );
    default:
      return null;
  }
}
