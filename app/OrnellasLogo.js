"use client";

// Logo "Studio Ornellas Barbeiro" recriada em SVG (vetor, nítida em qualquer
// tamanho). Cores vêm dos tokens de tema (--gold*), então adapta aos 3 modos.
// `variant`: "full" (Studio + arco + fita + flancos) ou "mark" (arco + fita).
export default function OrnellasLogo({
  height = 150,
  variant = "full",
  showFlanks = true,
}) {
  const full = variant === "full";
  const viewBox = full ? "0 0 620 300" : "0 78 620 176";
  const uid = "orn";

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label="Studio Ornellas Barbeiro"
      style={{ height, width: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold-cream)" />
          <stop offset="0.5" stopColor="var(--gold)" />
          <stop offset="1" stopColor="var(--gold-deep)" />
        </linearGradient>
        {/* Arco (leve) sobre o qual "ORNELLAS" é desenhado */}
        <path id={`${uid}-arc`} d="M 82 202 Q 310 150 538 202" fill="none" />
      </defs>

      {full && (
        <text
          x="310"
          y="60"
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-script), cursive",
            fontSize: 42,
            fill: "var(--text)",
          }}
        >
          Studio
        </text>
      )}

      {/* ORNELLAS arqueado */}
      <text
        style={{
          fontFamily: "var(--font-anton), Impact, sans-serif",
          fontSize: 98,
          letterSpacing: "1px",
          fill: `url(#${uid}-gold)`,
        }}
      >
        <textPath href={`#${uid}-arc`} startOffset="50%" textAnchor="middle">
          ORNELLAS
        </textPath>
      </text>

      {/* Fita BARBEIRO */}
      <g transform="translate(310 228)">
        <path
          d="M -134 -22 L 134 -22 L 152 0 L 134 22 L -134 22 L -152 0 Z"
          fill={`url(#${uid}-gold)`}
          stroke="var(--gold-deep)"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="9"
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-anton), Impact, sans-serif",
            fontSize: 30,
            letterSpacing: "11px",
            fill: "var(--on-gold)",
          }}
        >
          BARBEIRO
        </text>
      </g>

      {/* Flancos: POR EXCELÊNCIA · EM SERVIÇO */}
      {showFlanks && full && (
        <g style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
          <text
            x="158"
            y="278"
            textAnchor="middle"
            style={{ fontSize: 12, letterSpacing: "3px", fill: "var(--gold-deep)" }}
          >
            POR EXCELÊNCIA
          </text>
          <text
            x="462"
            y="278"
            textAnchor="middle"
            style={{ fontSize: 12, letterSpacing: "3px", fill: "var(--gold-deep)" }}
          >
            EM SERVIÇO
          </text>
          <path d="M 250 274 L 288 274" stroke="var(--gold-deep)" strokeWidth="1" opacity="0.7" />
          <path d="M 332 274 L 370 274" stroke="var(--gold-deep)" strokeWidth="1" opacity="0.7" />
          <rect x="305" y="269" width="9" height="9" transform="rotate(45 310 273)" fill="var(--gold)" />
        </g>
      )}
    </svg>
  );
}
