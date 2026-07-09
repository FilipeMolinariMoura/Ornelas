"use client";

const CINZEL = "var(--font-cinzel), serif";

// Cartão de aula reutilizado em Home, Módulo e Favoritas.
// `basis` define a largura fixa (linhas com scroll) ou fica null (grades).
export default function LessonCard({
  lesson,
  label,
  onOpen,
  onToggleFav,
  showCaptions,
  showProgress,
  basis,
}) {
  const outer = {
    cursor: "pointer",
    ...(basis
      ? { flex: `0 0 ${basis}`, scrollSnapAlign: "start" }
      : {}),
  };

  return (
    <div className="lesson-card" onClick={onOpen} style={outer}>
      <div
        className="lc-thumb"
        style={{
          position: "relative",
          aspectRatio: "16/9",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(201,162,75,.16)",
          background: "linear-gradient(135deg,#191510,#0c0b0a)",
          transition: "border-color .25s ease,box-shadow .25s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(125deg, rgba(201,162,75,.05) 0 1px, transparent 1px 9px)",
          }}
        />
        <div
          className="lc-num"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: CINZEL,
            fontSize: 56,
            color: "#c9a24b",
            opacity: 0.1,
            transition: "opacity .25s ease",
          }}
        >
          {lesson.code}
        </div>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(8,7,6,.7)",
            border: "1px solid rgba(201,162,75,.2)",
            color: "#d8cdb6",
            fontSize: 11,
            letterSpacing: ".04em",
            padding: "3px 8px",
            borderRadius: 6,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {lesson.dur}
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(lesson.id);
          }}
          style={{
            position: "absolute",
            top: 8,
            left: 10,
            fontSize: 16,
            color: lesson.favColor,
            cursor: "pointer",
            lineHeight: 1,
            textShadow: "0 1px 3px rgba(0,0,0,.6)",
          }}
        >
          ★
        </div>
        {showCaptions && (
          <div
            style={{
              position: "absolute",
              left: 12,
              bottom: 13,
              fontFamily: "ui-monospace,'SFMono-Regular',monospace",
              fontSize: 10,
              letterSpacing: ".02em",
              color: "rgba(201,162,75,.62)",
            }}
          >
            {lesson.caption}
          </div>
        )}
        <div
          className="lc-overlay"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(180deg, rgba(8,7,6,.1), rgba(8,7,6,.55))",
            opacity: 0,
            transition: "opacity .25s ease",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(180deg,#f3dca0,#c9a24b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,.5)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "15px solid #1a160d",
                borderTop: "9px solid transparent",
                borderBottom: "9px solid transparent",
                marginLeft: 4,
              }}
            />
          </div>
        </div>
        {showProgress && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 3,
              background: "rgba(255,255,255,.08)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: lesson.progStyle,
                background: "linear-gradient(90deg,#c9a24b,#f3dca0)",
              }}
            />
          </div>
        )}
      </div>
      <div style={{ padding: "11px 2px 0" }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: ".14em",
            color: "#8c867a",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#ece7dd",
            lineHeight: 1.3,
          }}
        >
          {lesson.title}
        </div>
      </div>
    </div>
  );
}
