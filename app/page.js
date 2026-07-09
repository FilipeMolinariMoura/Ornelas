"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MODULES, MENTORIAS, STUDIO, USER, INITIAL_FAVS } from "./data";
import LessonCard from "./LessonCard";

const CINZEL = "var(--font-title), serif";
const MANROPE = "var(--font-manrope), sans-serif";

// Configurações de exibição (props do protótipo original).
const CARD_WIDTH = 300;
const SHOW_CAPTIONS = true;
const SHOW_PROGRESS = true;

export default function Page() {
  const [screen, setScreen] = useState("home");
  const [nav, setNav] = useState("home");
  const [moduleId, setModuleId] = useState("m1");
  const [lessonId, setLessonId] = useState("l11");
  const [progress, setProgress] = useState({});
  const [fav, setFav] = useState(() => new Set(INITIAL_FAVS));
  const [theme, setTheme] = useState("classic"); // "classic" | "visagista"

  // Persiste a escolha de tema entre visitas.
  useEffect(() => {
    const saved = window.localStorage.getItem("ornellas-theme");
    if (saved === "classic" || saved === "visagista") setTheme(saved);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("ornellas-theme", theme);
  }, [theme]);
  const toggleTheme = () =>
    setTheme((t) => (t === "classic" ? "visagista" : "classic"));

  const mainRef = useRef(null);

  const toTop = () => {
    setTimeout(() => {
      const m = mainRef.current;
      if (m) m.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  const goHome = () => {
    setScreen("home");
    setNav("home");
    toTop();
  };
  const openFav = () => {
    setScreen("favoritas");
    setNav("fav");
    toTop();
  };
  const openConfig = () => {
    setScreen("config");
    setNav("cfg");
    toTop();
  };
  const openMentorias = () => {
    setScreen("mentorias");
    setNav("mentorias");
    toTop();
  };
  const openExt = (url) => {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
  };
  const waLink = (mentoria) =>
    `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(
      `Olá! Tenho interesse na ${mentoria}. Pode me passar as informações e as próximas turmas?`
    )}`;
  const openModule = (id) => {
    setScreen("module");
    setModuleId(id);
    toTop();
  };
  const openActiveModule = () => {
    setScreen("module");
    setModuleId(moduleId);
    toTop();
  };
  const openLesson = (mid, lid) => {
    setScreen("player");
    setModuleId(mid);
    setLessonId(lid);
    toTop();
  };
  const scrollRow = (id, dir) => {
    const el = document.getElementById("row-" + id);
    if (el) el.scrollBy({ left: dir === "next" ? 660 : -660, behavior: "smooth" });
  };
  const toggleFav = (lid) => {
    setFav((prev) => {
      const s = new Set(prev);
      if (s.has(lid)) s.delete(lid);
      else s.add(lid);
      return s;
    });
  };
  const markComplete = () => {
    setProgress((prev) => ({ ...prev, [lessonId]: 100 }));
  };

  const prog = (l) => (progress[l.id] != null ? progress[l.id] : l.progress);

  const buildLesson = (m, l, i) => {
    const p = prog(l);
    const isFav = fav.has(l.id);
    return {
      ...l,
      mid: m.id,
      mnum: m.num,
      mtitle: m.title,
      code: m.num + "." + (i + 1),
      fav: isFav,
      favColor: isFav ? "var(--gold-bright)" : "rgba(255,255,255,.55)",
      favLabel: isFav ? "Favoritada" : "Favoritar",
      prog: p,
      progStyle: p + "%",
      complete: p >= 100,
      completeLabel: p >= 100 ? "Aula concluída ✓" : "Marcar como concluída",
      progLabel: p >= 100 ? "concluída" : p > 0 ? p + "% assistido" : "não iniciada",
      desc: l.desc || m.desc,
    };
  };

  const vals = useMemo(() => {
    const view = MODULES.map((m) => {
      const lessons = m.lessons.map((l, i) => buildLesson(m, l, i));
      const done = lessons.filter((x) => x.complete).length;
      const pct = Math.round((done / lessons.length) * 100);
      return {
        ...m,
        lessons,
        count: lessons.length,
        countLabel: lessons.length + " aulas",
        pct,
        pctStyle: pct + "%",
        firstId: lessons[0].id,
      };
    });

    const all = [].concat(...view.map((m) => m.lessons));
    const continueList = all.filter((l) => l.prog > 0 && l.prog < 100);
    const favList = all.filter((l) => l.fav);

    const am = view.find((m) => m.id === moduleId) || view[0];
    const al = am.lessons.find((l) => l.id === lessonId) || am.lessons[0];

    const playerList = am.lessons.map((l) => {
      const cur = l.id === al.id;
      return {
        ...l,
        isCurrent: cur,
        rowBg: cur ? "rgba(var(--gold-rgb),.1)" : "transparent",
        rowBorder: cur ? "rgba(var(--gold-rgb),.35)" : "rgba(255,255,255,.06)",
        titleColor: cur ? "var(--gold-light)" : "var(--text)",
        statusLabel: cur
          ? "Assistindo agora · " + l.dur
          : l.complete
          ? "Concluída · " + l.dur
          : l.dur,
      };
    });

    return { view, continueList, favList, am, al, playerList };
  }, [moduleId, lessonId, progress, fav]);

  const { view, continueList, favList, am, al, playerList } = vals;

  const navItems = [
    { key: "home", label: "Página inicial", onClick: goHome },
    { key: "mentorias", label: "Mentorias presenciais", onClick: openMentorias },
    { key: "fav", label: "Aulas favoritas", onClick: openFav },
    { key: "yt", label: "Canal no YouTube", onClick: () => openExt(STUDIO.youtube) },
    { key: "ig", label: "Instagram", onClick: () => openExt(STUDIO.instagramVisagista) },
    { key: "cfg", label: "Configurações", onClick: openConfig },
  ];

  const cardBasis = CARD_WIDTH + "px";

  return (
    <div
      data-theme={theme}
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 264,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg,var(--surf),var(--bg))",
          borderRight: "1px solid rgba(var(--gold-rgb),.16)",
          zIndex: 20,
        }}
      >
        <div
          onClick={goHome}
          style={{
            cursor: "pointer",
            padding: "26px 24px 22px",
            borderBottom: "1px solid rgba(var(--gold-rgb),.12)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: CINZEL,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: ".08em",
              background: "linear-gradient(180deg,var(--gold-cream),var(--gold) 50%,var(--gold-deep))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            ORNELLAS
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 9.5,
              letterSpacing: ".46em",
              color: "var(--text-faint)",
              paddingLeft: ".46em",
            }}
          >
            BARBEIRO
          </div>
        </div>

        <nav
          style={{
            padding: "18px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: ".2em",
              color: "var(--text-dim)",
              textTransform: "uppercase",
              padding: "4px 12px 10px",
            }}
          >
            Menu
          </div>
          {navItems.map((item) => {
            const a = nav === item.key;
            return (
              <div
                key={item.key}
                className="nav-item"
                onClick={item.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 13px",
                  borderRadius: 9,
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: a ? 700 : 500,
                  color: a ? "var(--gold-bright)" : "var(--text-mut)",
                  background: a ? "rgba(var(--gold-rgb),.1)" : "transparent",
                  boxShadow: `inset 3px 0 0 ${a ? "var(--gold)" : "transparent"}`,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    transform: "rotate(45deg)",
                    background: a ? "var(--gold-bright)" : "rgba(var(--gold-rgb),.35)",
                    flexShrink: 0,
                  }}
                />
                {item.label}
              </div>
            );
          })}
        </nav>

        <div
          onClick={openMentorias}
          style={{
            margin: "6px 18px 18px",
            padding: 14,
            border: "1px solid rgba(var(--gold-rgb),.2)",
            borderRadius: 12,
            cursor: "pointer",
            background:
              "radial-gradient(120% 120% at 0% 0%, rgba(var(--gold-rgb),.1), transparent 60%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 9.5,
              letterSpacing: ".18em",
              color: "var(--gold)",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--gold-bright)",
                boxShadow: "0 0 0 3px rgba(var(--gold-rgb),.18)",
              }}
            />
            Matrículas abertas
          </div>
          <div style={{ marginTop: 9, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
            Mentorias presenciais
          </div>
          <div style={{ marginTop: 3, fontSize: 11.5, color: "var(--text-dim)" }}>
            4 segundas · 9h–16h · Barra da Tijuca
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            padding: 16,
            borderTop: "1px solid rgba(var(--gold-rgb),.12)",
            display: "flex",
            alignItems: "center",
            gap: 11,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: CINZEL,
              fontSize: 14,
              color: "var(--on-gold)",
              background: "linear-gradient(180deg,var(--gold-light),var(--gold))",
            }}
          >
            {USER.init}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {USER.name}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{USER.meta}</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main
        ref={mainRef}
        style={{
          marginLeft: 264,
          flex: 1,
          minWidth: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "14px 48px",
            background: "rgba(var(--bg-rgb),.82)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(var(--gold-rgb),.1)",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text-mut)" }}>
            Bem-vindo de volta,{" "}
            <span style={{ color: "var(--text)", fontWeight: 600 }}>{USER.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: ".04em", color: "var(--text-dim)" }}>
              28 aulas · 5 módulos
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 12px",
                border: "1px solid rgba(var(--gold-rgb),.3)",
                borderRadius: 20,
                fontSize: 11,
                letterSpacing: ".06em",
                color: "var(--gold-bright)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--gold-bright)",
                }}
              />
              Acesso vitalício
            </div>

            {/* Toggle de identidade visual */}
            <div
              onClick={toggleTheme}
              title="Alternar identidade visual"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 4,
                border: "1px solid rgba(var(--gold-rgb),.3)",
                borderRadius: 20,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <span style={segStyle(theme === "classic")}>Clássico</span>
              <span style={segStyle(theme === "visagista")}>Visagista</span>
            </div>
          </div>
        </div>

        {/* HOME */}
        {screen === "home" && (
          <div className="scr">
            <section
              style={{
                position: "relative",
                padding: "60px 48px 56px",
                textAlign: "center",
                overflow: "hidden",
                background:
                  "radial-gradient(120% 130% at 50% -10%, rgba(var(--gold-rgb),.14), transparent 55%), linear-gradient(180deg,var(--surf),var(--bg))",
                borderBottom: "1px solid rgba(var(--gold-rgb),.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,.012) 0 2px, transparent 2px 7px)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    color: "var(--gold)",
                    fontSize: 10.5,
                    letterSpacing: ".32em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      width: 42,
                      height: 1,
                      background: "linear-gradient(90deg,transparent,var(--gold))",
                    }}
                  />
                  Barbearia &amp; Estética Masculina
                  <span
                    style={{
                      width: 42,
                      height: 1,
                      background: "linear-gradient(90deg,var(--gold),transparent)",
                    }}
                  />
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontFamily: CINZEL,
                    fontWeight: 700,
                    fontSize: 62,
                    lineHeight: 0.95,
                    letterSpacing: ".06em",
                    background: "linear-gradient(180deg,var(--gold-cream),var(--gold) 45%,var(--gold-deep))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  ORNELLAS
                </h1>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginTop: 14,
                    padding: "7px 24px",
                    border: "1px solid rgba(var(--gold-rgb),.45)",
                    borderRadius: 4,
                    color: "var(--gold-bright)",
                    fontFamily: CINZEL,
                    letterSpacing: ".42em",
                    fontSize: 14,
                    paddingLeft: "calc(24px + .42em)",
                  }}
                >
                  BARBEIRO
                </div>
                <p
                  style={{
                    margin: "22px auto 0",
                    maxWidth: 560,
                    color: "var(--text-mut)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  Sua área de membros. Métodos exclusivos de visagismo, prótese capilar e
                  gestão de barbearia premium — direto da metodologia de Gustavo Ornellas.
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 24,
                    marginTop: 24,
                    color: "var(--text-faint)",
                    fontSize: 10,
                    letterSpacing: ".3em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>Por Excelência</span>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      transform: "rotate(45deg)",
                      background: "var(--gold)",
                    }}
                  />
                  <span>em Serviço</span>
                </div>
                <button
                  className="gbtn"
                  onClick={openMentorias}
                  style={{
                    marginTop: 28,
                    border: "none",
                    cursor: "pointer",
                    padding: "13px 28px",
                    borderRadius: 10,
                    fontFamily: MANROPE,
                    fontSize: 13.5,
                    fontWeight: 700,
                    letterSpacing: ".02em",
                    color: "var(--on-gold)",
                    background: "linear-gradient(180deg,var(--gold-light),var(--gold))",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Matrículas abertas · Mentorias presenciais
                  <span style={{ fontSize: 15 }}>›</span>
                </button>
              </div>
            </section>

            <div style={{ padding: "8px 48px 56px" }}>
              {continueList.length > 0 && (
                <>
                  <div style={{ marginTop: 34, marginBottom: 16 }}>
                    <div
                      style={{
                        fontFamily: CINZEL,
                        color: "var(--gold)",
                        fontSize: 13,
                        letterSpacing: ".12em",
                        marginBottom: 6,
                      }}
                    >
                      CONTINUE DE ONDE PAROU
                    </div>
                    <div
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg,rgba(var(--gold-rgb),.3),transparent)",
                      }}
                    />
                  </div>
                  <div
                    className="row-scroller"
                    style={{
                      display: "flex",
                      gap: 18,
                      overflowX: "auto",
                      padding: "6px 2px 14px",
                      scrollSnapType: "x mandatory",
                    }}
                  >
                    {continueList.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        label={`Módulo ${lesson.mnum} · ${lesson.progLabel}`}
                        onOpen={() => openLesson(lesson.mid, lesson.id)}
                        onToggleFav={toggleFav}
                        showCaptions={SHOW_CAPTIONS}
                        showProgress={SHOW_PROGRESS}
                        basis={cardBasis}
                      />
                    ))}
                  </div>
                </>
              )}

              {view.map((module) => (
                <div key={module.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      gap: 20,
                      margin: "40px 0 16px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 7,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: CINZEL,
                            color: "var(--gold)",
                            fontSize: 13,
                            letterSpacing: ".12em",
                          }}
                        >
                          MÓDULO {module.num}
                        </span>
                        <span
                          style={{
                            fontSize: 9.5,
                            color: "var(--gold-deep)",
                            letterSpacing: ".14em",
                            textTransform: "uppercase",
                            border: "1px solid rgba(var(--gold-rgb),.25)",
                            padding: "2px 9px",
                            borderRadius: 20,
                          }}
                        >
                          {module.tag}
                        </span>
                      </div>
                      <h2
                        onClick={() => openModule(module.id)}
                        className="lnk"
                        style={{
                          margin: 0,
                          cursor: "pointer",
                          fontSize: 22,
                          fontWeight: 700,
                          color: "var(--text)",
                          letterSpacing: "-.01em",
                        }}
                      >
                        {module.title}
                      </h2>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        onClick={() => openModule(module.id)}
                        className="lnk"
                        style={{
                          cursor: "pointer",
                          color: "var(--gold)",
                          fontSize: 12.5,
                          letterSpacing: ".03em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Ver módulo ›
                      </span>
                      <button
                        className="arrow-btn"
                        onClick={() => scrollRow(module.id, "prev")}
                        style={arrowBtn}
                      >
                        ‹
                      </button>
                      <button
                        className="arrow-btn"
                        onClick={() => scrollRow(module.id, "next")}
                        style={arrowBtn}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                  <div
                    id={"row-" + module.id}
                    className="row-scroller"
                    style={{
                      display: "flex",
                      gap: 18,
                      overflowX: "auto",
                      padding: "6px 2px 14px",
                      scrollSnapType: "x mandatory",
                    }}
                  >
                    {module.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        label={`Aula ${lesson.code}`}
                        onOpen={() => openLesson(lesson.mid, lesson.id)}
                        onToggleFav={toggleFav}
                        showCaptions={SHOW_CAPTIONS}
                        showProgress={SHOW_PROGRESS}
                        basis={cardBasis}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MÓDULO */}
        {screen === "module" && (
          <div className="scr" style={{ padding: "26px 48px 60px" }}>
            <div
              onClick={goHome}
              className="lnk"
              style={{
                cursor: "pointer",
                color: "var(--text-dim)",
                fontSize: 12.5,
                letterSpacing: ".03em",
                marginBottom: 20,
                display: "inline-block",
              }}
            >
              ‹ Página inicial
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr",
                gap: 32,
                alignItems: "stretch",
                marginBottom: 36,
              }}
            >
              <div style={{ padding: "8px 4px" }}>
                <div
                  style={{
                    fontFamily: CINZEL,
                    color: "var(--gold)",
                    fontSize: 13,
                    letterSpacing: ".14em",
                    marginBottom: 10,
                  }}
                >
                  MÓDULO {am.num}
                </div>
                <h1
                  style={{
                    margin: "0 0 16px",
                    fontSize: 34,
                    fontWeight: 800,
                    lineHeight: 1.12,
                    letterSpacing: "-.01em",
                    color: "var(--text)",
                  }}
                >
                  {am.title}
                </h1>
                <p
                  style={{
                    margin: "0 0 22px",
                    color: "var(--text-mut)",
                    fontSize: 14.5,
                    lineHeight: 1.75,
                    maxWidth: 560,
                  }}
                >
                  {am.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 9,
                    marginBottom: 24,
                  }}
                >
                  <span style={pill}>{am.countLabel}</span>
                  <span style={pill}>Mentor · Gustavo Ornellas</span>
                  <span style={pill}>{am.tag}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    maxWidth: 520,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 6,
                      background: "rgba(255,255,255,.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: am.pctStyle,
                        background: "linear-gradient(90deg,var(--gold),var(--gold-light))",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--gold)",
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {am.pct}% concluído
                  </div>
                </div>
                <button
                  className="gbtn"
                  onClick={() => openLesson(am.id, am.firstId)}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    padding: "13px 26px",
                    borderRadius: 10,
                    fontFamily: MANROPE,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--on-gold)",
                    background: "linear-gradient(180deg,var(--gold-light),var(--gold))",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <span style={{ fontSize: 11 }}>▶</span> Assistir agora
                </button>
              </div>
              <div
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(var(--gold-rgb),.2)",
                  background: "linear-gradient(135deg,var(--surf),var(--bg))",
                  minHeight: 240,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "repeating-linear-gradient(125deg, rgba(var(--gold-rgb),.05) 0 1px, transparent 1px 11px)",
                  }}
                />
                <div style={{ position: "relative", textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: CINZEL,
                      fontSize: 84,
                      color: "var(--gold)",
                      opacity: 0.22,
                      lineHeight: 1,
                    }}
                  >
                    {am.num}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: "ui-monospace,monospace",
                      fontSize: 11,
                      letterSpacing: ".04em",
                      color: "rgba(var(--gold-rgb),.6)",
                    }}
                  >
                    capa · módulo {am.num}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: CINZEL,
                color: "var(--gold)",
                fontSize: 13,
                letterSpacing: ".12em",
                marginBottom: 6,
              }}
            >
              AULAS DO MÓDULO
            </div>
            <div
              style={{
                height: 1,
                background: "linear-gradient(90deg,rgba(var(--gold-rgb),.3),transparent)",
                marginBottom: 22,
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                gap: 22,
              }}
            >
              {am.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  label={`Aula ${lesson.code}`}
                  onOpen={() => openLesson(lesson.mid, lesson.id)}
                  onToggleFav={toggleFav}
                  showCaptions={SHOW_CAPTIONS}
                  showProgress={SHOW_PROGRESS}
                  basis={null}
                />
              ))}
            </div>
          </div>
        )}

        {/* PLAYER */}
        {screen === "player" && (
          <div className="scr" style={{ padding: "26px 48px 60px" }}>
            <div
              onClick={openActiveModule}
              className="lnk"
              style={{
                cursor: "pointer",
                color: "var(--text-dim)",
                fontSize: 12.5,
                marginBottom: 18,
                display: "inline-block",
              }}
            >
              ‹ {am.title}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 360px",
                gap: 28,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid rgba(var(--gold-rgb),.2)",
                    background: "linear-gradient(135deg,var(--surf),#09080700)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg,var(--surf),var(--bg))",
                    }}
                  />
                  {al.img && (
                    <>
                      <img
                        src={al.img}
                        alt={al.title}
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.dataset.fb && img.src.includes("maxresdefault")) {
                            img.dataset.fb = "1";
                            img.src = img.src.replace("maxresdefault", "mqdefault");
                          }
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.6))",
                        }}
                      />
                    </>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "repeating-linear-gradient(125deg, rgba(var(--gold-rgb),.045) 0 1px, transparent 1px 12px)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(180deg,var(--gold-light),var(--gold))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 14px 40px rgba(0,0,0,.55)",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: "24px solid var(--on-gold)",
                          borderTop: "15px solid transparent",
                          borderBottom: "15px solid transparent",
                          marginLeft: 6,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: "ui-monospace,monospace",
                        fontSize: 11,
                        letterSpacing: ".04em",
                        color: "rgba(var(--gold-rgb),.6)",
                      }}
                    >
                      player · {al.caption}
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "14px 16px",
                      background: "linear-gradient(0deg, rgba(8,7,6,.85), transparent)",
                    }}
                  >
                    <div
                      style={{
                        height: 4,
                        borderRadius: 4,
                        background: "rgba(255,255,255,.15)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: al.progStyle,
                          background: "linear-gradient(90deg,var(--gold),var(--gold-light))",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 8,
                        fontSize: 11,
                        color: "var(--text-soft)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span>00:00</span>
                      <span>{al.dur}</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 22,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: ".14em",
                        color: "var(--gold)",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Módulo {am.num} · Aula {al.code}
                    </div>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: 26,
                        fontWeight: 800,
                        lineHeight: 1.2,
                        letterSpacing: "-.01em",
                        color: "var(--text)",
                      }}
                    >
                      {al.title}
                    </h1>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    <button
                      className="gbtn"
                      onClick={markComplete}
                      style={{
                        border: "none",
                        cursor: "pointer",
                        padding: "11px 18px",
                        borderRadius: 9,
                        fontFamily: MANROPE,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--on-gold)",
                        background: "linear-gradient(180deg,var(--gold-light),var(--gold))",
                      }}
                    >
                      {al.completeLabel}
                    </button>
                    <button
                      onClick={() => toggleFav(al.id)}
                      style={{
                        cursor: "pointer",
                        padding: "11px 16px",
                        borderRadius: 9,
                        fontFamily: MANROPE,
                        fontSize: 13,
                        fontWeight: 600,
                        color: al.favColor,
                        background: "rgba(255,255,255,.03)",
                        border: "1px solid rgba(var(--gold-rgb),.28)",
                      }}
                    >
                      ★ {al.favLabel}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    marginTop: 18,
                    padding: "14px 0",
                    borderTop: "1px solid rgba(var(--gold-rgb),.12)",
                    borderBottom: "1px solid rgba(var(--gold-rgb),.12)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: CINZEL,
                      fontSize: 13,
                      color: "var(--on-gold)",
                      background: "linear-gradient(180deg,var(--gold-light),var(--gold))",
                    }}
                  >
                    GO
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>
                      Gustavo Ornellas
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>
                      Mentor · Estúdio Ornellas
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    margin: "20px 0 0",
                    color: "var(--text-mut)",
                    fontSize: 14.5,
                    lineHeight: 1.8,
                    maxWidth: 680,
                  }}
                >
                  {al.desc}
                </p>

                <div
                  style={{
                    marginTop: 22,
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={materialBtn}>
                    <span style={{ color: "var(--gold)" }}>⤓</span> Material em PDF
                  </div>
                  <div style={materialBtn}>
                    <span style={{ color: "var(--gold)" }}>◆</span> Tirar dúvida no grupo
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(var(--gold-rgb),.16)",
                  borderRadius: 14,
                  background: "linear-gradient(180deg,var(--surf),var(--bg))",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 16px 12px",
                    borderBottom: "1px solid rgba(var(--gold-rgb),.12)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: CINZEL,
                      color: "var(--gold)",
                      fontSize: 12,
                      letterSpacing: ".1em",
                    }}
                  >
                    CONTEÚDO DO MÓDULO
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                    {am.countLabel} · {am.pct}% concluído
                  </div>
                </div>
                <div
                  style={{
                    padding: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    maxHeight: 560,
                    overflowY: "auto",
                  }}
                >
                  {playerList.map((item) => (
                    <div
                      key={item.id}
                      className="plrow"
                      onClick={() => openLesson(item.mid, item.id)}
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: 10,
                        borderRadius: 10,
                        cursor: "pointer",
                        background: item.rowBg,
                        border: `1px solid ${item.rowBorder}`,
                      }}
                    >
                      <div
                        style={{
                          flex: "0 0 100px",
                          aspectRatio: "16/9",
                          borderRadius: 7,
                          background: "linear-gradient(135deg,var(--thumb1),var(--thumb2))",
                          border: "1px solid rgba(var(--gold-rgb),.14)",
                          position: "relative",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: CINZEL,
                            color: "var(--gold)",
                            opacity: 0.3,
                            fontSize: 17,
                          }}
                        >
                          {item.code}
                        </span>
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 3,
                            background: "rgba(255,255,255,.1)",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: item.progStyle,
                              background: "linear-gradient(90deg,var(--gold),var(--gold-light))",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          minWidth: 0,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: item.titleColor,
                            lineHeight: 1.3,
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>
                          {item.statusLabel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAVORITAS */}
        {screen === "favoritas" && (
          <div className="scr" style={{ padding: "30px 48px 60px" }}>
            <div
              style={{
                fontFamily: CINZEL,
                color: "var(--gold)",
                fontSize: 13,
                letterSpacing: ".14em",
                marginBottom: 8,
              }}
            >
              SUA SELEÇÃO
            </div>
            <h1 style={{ margin: "0 0 4px", fontSize: 30, fontWeight: 800, color: "var(--text)" }}>
              Aulas favoritas
            </h1>
            <p style={{ margin: "0 0 26px", color: "var(--text-dim)", fontSize: 13.5 }}>
              Aulas que você marcou com ★ para assistir depois.
            </p>
            {favList.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                  gap: 22,
                }}
              >
                {favList.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    label={`Módulo ${lesson.mnum}`}
                    onOpen={() => openLesson(lesson.mid, lesson.id)}
                    onToggleFav={toggleFav}
                    showCaptions={SHOW_CAPTIONS}
                    showProgress={false}
                    basis={null}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  border: "1px dashed rgba(var(--gold-rgb),.28)",
                  borderRadius: 14,
                  padding: "60px 24px",
                  textAlign: "center",
                  color: "var(--text-dim)",
                }}
              >
                <div
                  style={{
                    fontSize: 30,
                    color: "var(--gold)",
                    opacity: 0.5,
                    marginBottom: 10,
                  }}
                >
                  ★
                </div>
                <div style={{ fontSize: 14 }}>
                  Você ainda não favoritou nenhuma aula. Toque na estrela de uma aula para
                  salvá-la aqui.
                </div>
              </div>
            )}
          </div>
        )}

        {/* MENTORIAS PRESENCIAIS */}
        {screen === "mentorias" && (
          <div className="scr" style={{ padding: "30px 48px 60px" }}>
            <div
              style={{
                fontFamily: CINZEL,
                color: "var(--gold)",
                fontSize: 13,
                letterSpacing: ".14em",
                marginBottom: 8,
              }}
            >
              MATRÍCULAS ABERTAS
            </div>
            <h1
              style={{
                margin: "0 0 4px",
                fontSize: 30,
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              Mentorias presenciais
            </h1>
            <p style={{ margin: "0 0 30px", color: "var(--text-dim)", fontSize: 13.5, maxWidth: 620 }}>
              Formações intensivas com {STUDIO.mentor}, no {STUDIO.name} — conteúdo prático,
              dinâmico e voltado para resultado.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
                gap: 24,
                marginBottom: 30,
              }}
            >
              {MENTORIAS.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: "1px solid rgba(var(--gold-rgb),.2)",
                    borderRadius: 16,
                    background: "linear-gradient(180deg,var(--surf),var(--bg))",
                    padding: "26px 26px 24px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignSelf: "flex-start",
                      alignItems: "center",
                      gap: 7,
                      fontSize: 9.5,
                      letterSpacing: ".18em",
                      color: "var(--gold)",
                      textTransform: "uppercase",
                      border: "1px solid rgba(var(--gold-rgb),.25)",
                      padding: "5px 11px",
                      borderRadius: 20,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        transform: "rotate(45deg)",
                        background: "var(--gold-bright)",
                      }}
                    />
                    {c.kicker}
                  </div>
                  <h2
                    style={{
                      margin: "0 0 8px",
                      fontSize: 22,
                      fontWeight: 800,
                      lineHeight: 1.2,
                      color: "var(--text)",
                      letterSpacing: "-.01em",
                    }}
                  >
                    {c.title}
                  </h2>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--gold-bright)",
                      letterSpacing: ".02em",
                      marginBottom: 14,
                    }}
                  >
                    {c.format}
                  </div>
                  <p
                    style={{
                      margin: "0 0 18px",
                      color: "var(--text-mut)",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {c.lead}
                  </p>

                  {c.sections.map((sec) => (
                    <div key={sec.title} style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontFamily: CINZEL,
                          color: "var(--gold)",
                          fontSize: 12.5,
                          letterSpacing: ".08em",
                          marginBottom: 9,
                        }}
                      >
                        {sec.title}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {sec.items.map((it, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "flex-start",
                              fontSize: 13,
                              color: "var(--text-soft)",
                              lineHeight: 1.5,
                            }}
                          >
                            <span
                              style={{
                                marginTop: 6,
                                width: 5,
                                height: 5,
                                flexShrink: 0,
                                transform: "rotate(45deg)",
                                background: "var(--gold)",
                              }}
                            />
                            {it}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {c.bonus && (
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: "1px solid rgba(var(--gold-rgb),.28)",
                        background:
                          "radial-gradient(120% 120% at 0% 0%, rgba(var(--gold-rgb),.12), transparent 60%)",
                        color: "var(--text)",
                        fontSize: 13,
                        marginBottom: 16,
                      }}
                    >
                      <span style={{ color: "var(--gold-bright)", fontSize: 15 }}>★</span>
                      <span>
                        <b style={{ color: "var(--gold-bright)" }}>Bônus:</b> {c.bonus}
                      </span>
                    </div>
                  )}

                  <div style={{ marginTop: "auto" }}>
                    <div
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg,rgba(var(--gold-rgb),.3),transparent)",
                        margin: "6px 0 16px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            letterSpacing: ".14em",
                            color: "var(--text-dim)",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Investimento
                        </div>
                        <div
                          style={{
                            fontFamily: CINZEL,
                            fontSize: 28,
                            fontWeight: 700,
                            color: "var(--gold-light)",
                            lineHeight: 1,
                          }}
                        >
                          {c.price}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-mut)", marginTop: 5 }}>
                          {c.installments}
                        </div>
                      </div>
                      <button
                        className="gbtn"
                        onClick={() => openExt(waLink(c.title))}
                        style={{
                          border: "none",
                          cursor: "pointer",
                          padding: "13px 22px",
                          borderRadius: 10,
                          fontFamily: MANROPE,
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "var(--on-gold)",
                          background: "linear-gradient(180deg,var(--gold-light),var(--gold))",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Garantir vaga no WhatsApp
                      </button>
                    </div>
                    {c.includes && (
                      <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 14 }}>
                        {c.includes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CONTATO / ESTÚDIO */}
            <div
              style={{
                border: "1px solid rgba(var(--gold-rgb),.16)",
                borderRadius: 16,
                background: "linear-gradient(180deg,var(--surf),var(--bg))",
                padding: 24,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: CINZEL,
                    color: "var(--gold)",
                    fontSize: 12.5,
                    letterSpacing: ".1em",
                    marginBottom: 10,
                  }}
                >
                  {STUDIO.name.toUpperCase()}
                </div>
                {STUDIO.addressLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 13,
                      color: i === 0 ? "var(--text)" : "var(--text-dim)",
                      fontWeight: i === 0 ? 600 : 400,
                      lineHeight: 1.6,
                    }}
                  >
                    {line}
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  <button
                    onClick={() => openExt(STUDIO.instagramVisagista)}
                    style={socialBtn}
                  >
                    @ornellasvisagista
                  </button>
                  <button
                    onClick={() => openExt(STUDIO.instagramStudio)}
                    style={socialBtn}
                  >
                    @studioornellas
                  </button>
                  <button
                    onClick={() => openExt(STUDIO.instagramBarbeiro)}
                    style={socialBtn}
                  >
                    @ornellasbarbeiro
                  </button>
                </div>
              </div>
              <button
                className="gbtn"
                onClick={() => openExt(waLink("mentoria presencial do Estúdio Ornellas"))}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "14px 24px",
                  borderRadius: 10,
                  fontFamily: MANROPE,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--on-gold)",
                  background: "linear-gradient(180deg,var(--gold-light),var(--gold))",
                  whiteSpace: "nowrap",
                }}
              >
                WhatsApp {STUDIO.whatsappLabel}
              </button>
            </div>
          </div>
        )}

        {/* CONFIGURAÇÕES */}
        {screen === "config" && (
          <div className="scr" style={{ padding: "30px 48px 60px", maxWidth: 760 }}>
            <div
              style={{
                fontFamily: CINZEL,
                color: "var(--gold)",
                fontSize: 13,
                letterSpacing: ".14em",
                marginBottom: 8,
              }}
            >
              CONTA
            </div>
            <h1 style={{ margin: "0 0 26px", fontSize: 30, fontWeight: 800, color: "var(--text)" }}>
              Configurações
            </h1>
            <div
              style={{
                border: "1px solid rgba(var(--gold-rgb),.16)",
                borderRadius: 14,
                background: "linear-gradient(180deg,var(--surf),var(--bg))",
                padding: 22,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: ".12em",
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Dados do membro
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <Field label="Nome" value={USER.fullName} />
                <Field label="E-mail" value={USER.email} />
                <Field label="Plano" value={USER.plan} valueColor="var(--gold-bright)" />
                <Field label="Membro desde" value={USER.since} />
              </div>
            </div>
            <div
              style={{
                border: "1px solid rgba(var(--gold-rgb),.16)",
                borderRadius: 14,
                background: "linear-gradient(180deg,var(--surf),var(--bg))",
                padding: 22,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: ".12em",
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Preferências
              </div>
              <Toggle
                title="Avisar sobre novas aulas"
                sub="Receba e-mail quando um módulo for liberado"
                border
              />
              <Toggle
                title="Lembrete de aula ao vivo"
                sub="Notificação 1h antes da mentoria"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const arrowBtn = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "1px solid rgba(var(--gold-rgb),.25)",
  background: "rgba(255,255,255,.02)",
  color: "var(--gold)",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
};

const pill = {
  fontSize: 11.5,
  color: "var(--text-soft)",
  border: "1px solid rgba(var(--gold-rgb),.22)",
  padding: "6px 12px",
  borderRadius: 20,
};

function segStyle(active) {
  return {
    padding: "4px 11px",
    borderRadius: 16,
    fontSize: 10.5,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    fontWeight: 700,
    color: active ? "var(--on-gold)" : "var(--text-dim)",
    background: active
      ? "linear-gradient(180deg,var(--gold-light),var(--gold))"
      : "transparent",
  };
}

const socialBtn = {
  cursor: "pointer",
  padding: "8px 14px",
  borderRadius: 20,
  border: "1px solid rgba(var(--gold-rgb),.28)",
  background: "rgba(255,255,255,.02)",
  color: "var(--text-soft)",
  fontSize: 12.5,
  fontFamily: "var(--font-manrope), sans-serif",
};

const materialBtn = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  padding: "11px 16px",
  borderRadius: 10,
  border: "1px solid rgba(var(--gold-rgb),.22)",
  background: "rgba(255,255,255,.02)",
  color: "var(--text-soft)",
  fontSize: 13,
  cursor: "pointer",
};

function Field({ label, value, valueColor = "var(--text)" }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 6 }}>{label}</div>
      <div
        style={{
          padding: "11px 13px",
          border: "1px solid rgba(var(--gold-rgb),.18)",
          borderRadius: 9,
          background: "rgba(255,255,255,.02)",
          fontSize: 13.5,
          color: valueColor,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Toggle({ title, sub, border }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        ...(border ? { borderBottom: "1px solid rgba(var(--gold-rgb),.1)" } : {}),
      }}
    >
      <div>
        <div style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>{sub}</div>
      </div>
      <div
        style={{
          width: 42,
          height: 24,
          borderRadius: 20,
          background: "linear-gradient(90deg,var(--gold),var(--gold-light))",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            right: 3,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--on-gold)",
          }}
        />
      </div>
    </div>
  );
}
