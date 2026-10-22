import React from "react";
import { TactileGlassWord, TactileGlassWordProps } from "./TactileGlassWord";

export type TactileHeadingLevel = "h1" | "h2" | "h3" | "h4" | "div";
export type TactileHeadingSize = "sm" | "md" | "lg" | "xl" | "hero";

export interface TactileHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: TactileHeadingLevel;
  size?: TactileHeadingSize;
  align?: "left" | "center" | "right";
  /** Full heading text when not using children composition */
  title?: string;
  /** Substring/word within title to wrap with optical glass */
  highlight?: string | string[];
  /** Optional array of words to cycle through on click within the highlighted word */
  highlightCycle?: string[];
  /** Optional subtitle or description underneath */
  subtitle?: React.ReactNode;
  /** Optional top badge or category tag */
  badge?: React.ReactNode;
  /** Custom props passed to the highlighted TactileGlassWord */
  wordProps?: Partial<TactileGlassWordProps>;
  className?: string;
  children?: React.ReactNode;
}

/**
 * TactileHeading
 * High-impact display typography heading with an integrated real-time WebGL2
 * TactileGlassWord optical capsule. Supports both automatic keyword highlighting
 * and rich children composition.
 */
export const TactileHeading: React.FC<TactileHeadingProps> = ({
  level = "h1",
  size = "hero",
  align = "center",
  title,
  highlight,
  highlightCycle,
  subtitle,
  badge,
  wordProps,
  className = "",
  children,
  ...props
}) => {
  const Tag = level as React.ElementType;

  // Render title with automatic word highlighting if title and highlight are provided
  const renderHighlightedTitle = () => {
    if (!title) return null;
    if (!highlight && (!highlightCycle || highlightCycle.length === 0)) {
      return title;
    }

    const targets: string[] = [];
    if (Array.isArray(highlight)) targets.push(...highlight);
    else if (typeof highlight === "string") targets.push(highlight);
    if (highlightCycle && highlightCycle.length > 0 && !targets.includes(highlightCycle[0])) {
      targets.push(highlightCycle[0]);
    }

    if (targets.length === 0) return title;

    // Build regex to match target words (case-insensitive word boundary or exact match)
    const pattern = new RegExp(`(${targets.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    const parts = title.split(pattern);

    return parts.map((part, i) => {
      const matchTarget = targets.find((t) => t.toLowerCase() === part.toLowerCase());
      if (matchTarget) {
        return (
          <TactileGlassWord
            key={i}
            cycleWords={highlightCycle && highlightCycle.length > 0 ? highlightCycle : undefined}
            {...wordProps}
          >
            {part}
          </TactileGlassWord>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div
      className={`tactile-heading-container ${className}`.trim()}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "var(--heading-max-w)",
        alignItems: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        textAlign: align,
      }}
    >
      {badge && (
        <div
          className="tactile-heading-badge"
          style={{ marginBottom: "var(--space-16)", display: "inline-flex", alignItems: "center" }}
        >
          {badge}
        </div>
      )}

      <Tag
        className="tactile-heading-title display-heading"
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--text-primary)",
          fontSize:
            size === "sm"
              ? "var(--font-size-xl)"
              : size === "md"
              ? "var(--font-size-2xl)"
              : "var(--font-size-display)",
          fontWeight: "var(--font-weight-extrabold)",
          lineHeight: size === "md" ? "var(--line-height-2xl)" : "var(--line-height-none)",
          letterSpacing: "var(--letter-spacing-display)",
          textAlign: align,
          margin: 0,
        }}
        {...props}
      >
        {children ? children : renderHighlightedTitle()}
      </Tag>

      {subtitle && (
        <p
          className="tactile-heading-subtitle"
          style={{
            fontSize: "var(--font-size-md)",
            color: "var(--text-secondary)",
            maxWidth: "var(--subtitle-max-w)",
            marginTop:
              size === "sm"
                ? "var(--space-8)"
                : size === "md"
                ? "var(--space-12)"
                : "var(--space-16)",
            textAlign: align,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default TactileHeading;
