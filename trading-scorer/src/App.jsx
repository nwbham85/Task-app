import { useState, useEffect } from "react";

const COLORS = ["#f59e0b","#10b981","#3b82f6","#8b5cf6","#ec4899","#06b6d4","#f97316","#a3e635","#e879f9","#38bdf8"];

const DEFAULT_TIMEFRAMES = [
  { id: "monthly", label: "Monthly", weight: 30, color: "#f59e0b", criteria: [
    { id: "m1", label: "Price vs Previous Profile" },
    { id: "m2", label: "Price vs Current Profile" },
    { id: "m3", label: "Previous Month Candle Close" },
  ]},
  { id: "weekly", label: "Weekly", weight: 25, color: "#10b981", criteria: [
    { id: "w1", label: "Price vs Previous Profile" },
    { id: "w2", label: "Price vs Current Profile" },
    { id: "w3", label: "Previous Week Candle Close" },
  ]},
  { id: "daily", label: "Daily", weight: 20, color: "#3b82f6", criteria: [
    { id: "d1", label: "Price vs Previous Profile" },
    { id: "d2", label: "Price vs Current Profile" },
    { id: "d3", label: "Previous Day Candle Close" },
    { id: "d4", label: "Previous Day Rotation Factor" },
    { id: "d5", label: "Current Rotation Factor" },
  ]},
  { id: "4hr", label: "4 Hour", weight: 15, color: "#8b5cf6", criteria: [
    { id: "h1", label: "Price vs Previous Profile" },
    { id: "h2", label: "Price vs Current Profile" },
    { id: "h3", label: "Previous 4HR Candle Close" },
  ]},
  { id: "5m", label: "5 Minute", weight: 5, color: "#ec4899", criteria: [
    { id: "f1", label: "Price vs Previous Profile" },
    { id: "f2", label: "Price vs Current Profile" },
  ]},
  { id: "1m", label: "1 Minute", weight: 5, color: "#06b6d4", criteria: [
    { id: "o1", label: "Price vs Previous Profile" },
    { id: "o2", label: "Price vs Current Profile" },
  ]},
];

const STATES = [
  { value: "bullish", label: "▲ Bull", score: 1,   color: "#10b981", bg: "#064e3b" },
  { value: "neutral", label: "● Neut", score: 0.5, color: "#f59e0b", bg: "#451a03" },
  { value: "bearish", label: "▼ Bear", score: 0,   color: "#ef4444", bg: "#450a0a" },
];

const LS_TF    = "mps_timeframes";
const LS_SC    = "mps_scores";
const LS_TK    = "mps_ticker";
const LS_SAVES = "mps_saves";

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

function getBiasLabel(pct) {
  if (pct >= 80) return { label: "STRONG BULL", color: "#10b981" };
  if (pct >= 60) return { label: "BULLISH",      color: "#34d399" };
  if (pct >= 45) return { label: "SLIGHT BULL",  color: "#6ee7b7" };
  if (pct >= 40) return { label: "NEUTRAL",      color: "#f59e0b" };
  if (pct >= 30) return { label: "SLIGHT BEAR",  color: "#fca5a5" };
  if (pct >= 20) return { label: "BEARISH",      color: "#f87171" };
  return            { label: "STRONG BEAR",  color: "#ef4444" };
}

function uid() { return Math.random().toString(36).slice(2, 8); }

function fmt(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric" }) +
    " " + d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
}

// ── Inline editable label ────────────────────────────────────────────────────
function InlineEdit({ value, onSave, style = {} }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);
  const commit = () => { onSave(draft.trim() || value); setEditing(false); };
  if (!editing) return (
    <span onClick={() => { setDraft(value); setEditing(true); }} title="Click to edit"
      style={{ cursor:"text", borderBottom:"1px dashed #374151", ...style }}>
      {value}
    </span>
  );
  return (
    <input autoFocus value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key==="Enter") commit(); if (e.key==="Escape") setEditing(false); }}
      style={{ background:"#1e293b", border:"1px solid #3b82f6", color:"#e2e8f0",
        borderRadius:3, padding:"2px 6px", fontFamily:"inherit", fontSize:"inherit",
        outline:"none", ...style }}
    />
  );
}

// ── Save dialog modal ────────────────────────────────────────────────────────
function SaveModal({ onConfirm, onCancel, defaultName }) {
  const [name, setName] = useState(defaultName);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8,
        padding:28, minWidth:320, display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ fontSize:"11px", letterSpacing:"2px", color:"#4b5563" }}>NAME THIS SAVE</div>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key==="Enter") onConfirm(name); if (e.key==="Escape") onCancel(); }}
          placeholder="e.g. ES 2024-03-05 Bull Setup"
          style={{ background:"#1e293b", border:"1px solid #374151", color:"#e2e8f0",
            borderRadius:4, padding:"8px 12px", fontFamily:"'IBM Plex Mono',monospace",
            fontSize:13, outline:"none", width:"100%" }} />
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button className="btn btn-ghost" onClick={onCancel}>CANCEL</button>
          <button className="btn btn-save" onClick={() => onConfirm(name.trim() || defaultName)}>SAVE</button>
        </div>
      </div>
    </div>
  );
}

// ── Saves panel ───────────────────────────────────────────────────────────────
function SavesPanel({ saves, onLoad, onDelete, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:100,
      display:"flex", alignItems:"flex-start", justifyContent:"flex-end" }}>
      <div style={{ background:"#0a0a0f", border:"1px solid #1e293b", borderLeft:"1px solid #1e293b",
        width:380, height:"100vh", overflowY:"auto", display:"flex", flexDirection:"column" }}>
        {/* panel header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 20px", borderBottom:"1px solid #1e293b", position:"sticky", top:0,
          background:"#0a0a0f", zIndex:1 }}>
          <span style={{ fontSize:"11px", letterSpacing:"2px", color:"#4b5563" }}>SAVED ANALYSES</span>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding:"3px 8px" }}>✕</button>
        </div>

        {saves.length === 0 && (
          <div style={{ padding:32, color:"#374151", fontSize:12, textAlign:"center" }}>
            No saves yet. Hit SAVE AS to create one.
          </div>
        )}

        {[...saves].reverse().map(s => {
          const bias = s.overallPct !== null ? getBiasLabel(s.overallPct) : null;
          return (
            <div key={s.id} style={{ padding:"14px 20px", borderBottom:"1px solid #111827",
              display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", flex:1, minWidth:0,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {s.name}
                </span>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button className="btn btn-save" onClick={() => onLoad(s)}
                    style={{ padding:"3px 10px", fontSize:10 }}>LOAD</button>
                  <button className="btn btn-danger" onClick={() => onDelete(s.id)}
                    style={{ padding:"3px 8px" }}>✕</button>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {s.ticker && (
                  <span style={{ fontSize:11, fontWeight:700, color:"#3b82f6", letterSpacing:1 }}>
                    {s.ticker}
                  </span>
                )}
                {bias && (
                  <span style={{ fontSize:11, fontWeight:700, color:bias.color }}>{bias.label}</span>
                )}
                {s.overallPct !== null && (
                  <span style={{ fontSize:11, color:"#4b5563" }}>{s.overallPct.toFixed(1)}/100</span>
                )}
              </div>
              <div style={{ fontSize:10, color:"#374151" }}>{fmt(s.savedAt)}</div>
            </div>
          );
        })}
      </div>
      {/* click outside to close */}
      <div style={{ position:"absolute", inset:0, zIndex:-1 }} onClick={onClose} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TradingScorer() {
  const [timeframes,   setTimeframes]   = useState(() => load(LS_TF, DEFAULT_TIMEFRAMES));
  const [scores,       setScores]       = useState(() => load(LS_SC, {}));
  const [ticker,       setTicker]       = useState(() => load(LS_TK, ""));
  const [saves,        setSaves]        = useState(() => load(LS_SAVES, []));
  const [saveFlash,    setSaveFlash]    = useState(false);
  const [showSaveModal,setShowSaveModal]= useState(false);
  const [showSaves,    setShowSaves]    = useState(false);

  // auto-save working state
  useEffect(() => { localStorage.setItem(LS_TF, JSON.stringify(timeframes)); }, [timeframes]);
  useEffect(() => { localStorage.setItem(LS_SC, JSON.stringify(scores));     }, [scores]);
  useEffect(() => { localStorage.setItem(LS_TK, JSON.stringify(ticker));     }, [ticker]);
  useEffect(() => { localStorage.setItem(LS_SAVES, JSON.stringify(saves));   }, [saves]);

  // ── Score calc (needed for save snapshot) ────────────────────────────────────
  let totalEarned = 0, totalPossible = 0;
  const tfResults = timeframes.map(tf => {
    const n   = tf.criteria.length;
    const ppc = n > 0 ? tf.weight / n : 0;
    let earned = 0, possible = 0;
    tf.criteria.forEach(c => {
      const state = STATES.find(s => s.value === scores[c.id]);
      if (state) { earned += state.score * ppc; possible += ppc; }
    });
    totalEarned   += earned;
    totalPossible += possible;
    return { ...tf, earned, possible, pct: possible > 0 ? (earned / possible) * 100 : null };
  });
  const overallPct  = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : null;
  const bias        = overallPct !== null ? getBiasLabel(overallPct) : null;
  const totalWeight = timeframes.reduce((s, t) => s + t.weight, 0);

  // ── Save actions ──────────────────────────────────────────────────────────────
  const handleSaveAs = (name) => {
    const entry = {
      id: uid(), name, ticker, savedAt: Date.now(),
      timeframes, scores, overallPct,
    };
    setSaves(p => [...p, entry]);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1800);
    setShowSaveModal(false);
  };

  const handleLoad = (s) => {
    setTimeframes(s.timeframes);
    setScores(s.scores);
    setTicker(s.ticker || "");
    setShowSaves(false);
  };

  const handleDeleteSave = (id) => {
    if (!window.confirm("Delete this save?")) return;
    setSaves(p => p.filter(s => s.id !== id));
  };

  // ── Working state actions ─────────────────────────────────────────────────────
  const setScore    = (cid, val) => setScores(p => ({ ...p, [cid]: val }));
  const resetScores = () => { setScores({}); setTicker(""); };
  const resetAll    = () => {
    if (!window.confirm("Reset everything including timeframes and criteria?")) return;
    setTimeframes(DEFAULT_TIMEFRAMES); setScores({}); setTicker("");
  };

  // ── Timeframe mutations ───────────────────────────────────────────────────────
  const addTimeframe = () => {
    const usedColors = timeframes.map(t => t.color);
    const color = COLORS.find(c => !usedColors.includes(c)) || COLORS[timeframes.length % COLORS.length];
    setTimeframes(p => [...p, { id: uid(), label: "New TF", weight: 5, color, criteria: [] }]);
  };
  const deleteTimeframe = (tfId) => {
    const tf = timeframes.find(t => t.id === tfId);
    setTimeframes(p => p.filter(t => t.id !== tfId));
    setScores(p => { const n={...p}; tf?.criteria.forEach(c => delete n[c.id]); return n; });
  };
  const updateTF = (tfId, patch) =>
    setTimeframes(p => p.map(t => t.id === tfId ? { ...t, ...patch } : t));
  const cycleTFColor = (tfId) => {
    const tf = timeframes.find(t => t.id === tfId);
    updateTF(tfId, { color: COLORS[(COLORS.indexOf(tf.color) + 1) % COLORS.length] });
  };

  // ── Criteria mutations ────────────────────────────────────────────────────────
  const addCriteria = (tfId) =>
    setTimeframes(p => p.map(t => t.id === tfId
      ? { ...t, criteria: [...t.criteria, { id: uid(), label: "New Criteria" }] } : t));
  const deleteCriteria = (tfId, cid) => {
    setTimeframes(p => p.map(t => t.id === tfId
      ? { ...t, criteria: t.criteria.filter(c => c.id !== cid) } : t));
    setScores(p => { const n={...p}; delete n[cid]; return n; });
  };
  const updateCriteriaLabel = (tfId, cid, label) =>
    setTimeframes(p => p.map(t => t.id === tfId
      ? { ...t, criteria: t.criteria.map(c => c.id === cid ? { ...c, label } : c) } : t));

  const defaultSaveName = [ticker, new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})].filter(Boolean).join(" — ");

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", color:"#e2e8f0",
      fontFamily:"'IBM Plex Mono','Courier New',monospace", padding:"24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .btn { border-radius:4px; cursor:pointer; font-family:'IBM Plex Mono',monospace;
          font-size:11px; font-weight:600; transition:all .15s; white-space:nowrap;
          padding:5px 10px; border:1px solid; }
        .btn-state { background:#111827; color:#374151; border-color:#1e293b; }
        .btn-state:hover { filter:brightness(1.4); }
        .btn-ghost { background:transparent; color:#4b5563; border-color:#1e293b; }
        .btn-ghost:hover { color:#e2e8f0; border-color:#4b5563; }
        .btn-save { background:#0f2d1a; color:#10b981; border-color:#10b981; }
        .btn-save:hover { background:#10b981; color:#000; }
        .btn-saved { background:#10b981; color:#000; border-color:#10b981; cursor:default; }
        .btn-loads { background:#0c1a2e; color:#3b82f6; border-color:#3b82f6; }
        .btn-loads:hover { background:#3b82f6; color:#000; }
        .btn-danger { background:transparent; color:#374151; border-color:transparent; padding:4px 7px; }
        .btn-danger:hover { color:#ef4444; border-color:#ef4444; }
        .btn-add { background:#0f172a; color:#4b5563; border-color:#1e293b; border-style:dashed; }
        .btn-add:hover { color:#94a3b8; border-color:#4b5563; }
        .ticker-input { background:#111827; border:1px solid #1e293b; color:#e2e8f0;
          padding:6px 12px; border-radius:4px; font-family:'IBM Plex Mono',monospace;
          font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:2px;
          width:130px; outline:none; }
        .ticker-input:focus { border-color:#3b82f6; }
        .ticker-input::placeholder { color:#374151; }
        .weight-input { background:#1e293b; border:1px solid #374151; color:#e2e8f0;
          border-radius:3px; padding:2px 4px; width:46px; text-align:center;
          font-family:'IBM Plex Mono',monospace; font-size:11px; outline:none; }
        .weight-input:focus { border-color:#3b82f6; }
        .tf-card { background:#0f172a; border:1px solid #1e293b; border-radius:8px;
          overflow:hidden; margin-bottom:12px; }
        .tf-header { display:flex; align-items:center; justify-content:space-between;
          padding:10px 16px; border-bottom:1px solid #1e293b; gap:8px; }
        .criteria-row { display:flex; align-items:center; justify-content:space-between;
          padding:9px 16px; border-bottom:1px solid #0f172a; gap:12px; }
        .criteria-row:last-child { border-bottom:none; }
        .criteria-row:hover { background:#111827; }
        .gauge-bar { height:6px; background:#1e293b; border-radius:3px; overflow:hidden; flex:1; }
        .gauge-fill { height:100%; border-radius:3px; transition:width .4s ease; }
        .color-dot { width:12px; height:12px; border-radius:50%; cursor:pointer;
          border:2px solid rgba(255,255,255,.2); flex-shrink:0; transition:transform .15s; }
        .color-dot:hover { transform:scale(1.4); }
      `}</style>

      {/* ── Modals ── */}
      {showSaveModal && (
        <SaveModal defaultName={defaultSaveName}
          onConfirm={handleSaveAs} onCancel={() => setShowSaveModal(false)} />
      )}
      {showSaves && (
        <SavesPanel saves={saves} onLoad={handleLoad}
          onDelete={handleDeleteSave} onClose={() => setShowSaves(false)} />
      )}

      {/* ── Header ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <div style={{ fontSize:"10px", letterSpacing:"3px", color:"#4b5563", marginBottom:"4px" }}>
            MARKET PROFILE SCORER
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <input className="ticker-input" placeholder="TICKER" value={ticker}
              onChange={e => setTicker(e.target.value.toUpperCase())} maxLength={10} />
            {ticker && <span style={{ fontSize:"20px", fontWeight:"700" }}>{ticker}</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
          {totalWeight !== 100 && (
            <span style={{ color:"#f59e0b", fontSize:"10px" }}>⚠ weights sum to {totalWeight}/100</span>
          )}
          <button className={`btn ${saveFlash ? "btn-saved" : "btn-save"}`}
            onClick={() => !saveFlash && setShowSaveModal(true)}>
            {saveFlash ? "✓ SAVED" : "SAVE AS"}
          </button>
          <button className="btn btn-loads" onClick={() => setShowSaves(true)}>
            LOAD {saves.length > 0 && <span style={{ opacity:.6 }}>({saves.length})</span>}
          </button>
          <button className="btn btn-ghost" onClick={resetScores}>RESET SCORES</button>
          <button className="btn btn-ghost" onClick={resetAll}
            style={{ color:"#6b7280", borderColor:"#1f2937" }}>RESET ALL</button>
        </div>
      </div>

      {/* ── Summary ── */}
      <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:"8px",
        padding:"20px", marginBottom:"20px", display:"flex", alignItems:"center",
        gap:"32px", flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#4b5563", marginBottom:"6px" }}>TOTAL SCORE</div>
          <div style={{ fontSize:"48px", fontWeight:"700", lineHeight:1, color: bias ? bias.color : "#4b5563" }}>
            {overallPct !== null ? overallPct.toFixed(1) : "—"}
            <span style={{ fontSize:"18px", color:"#4b5563" }}>{overallPct !== null ? "/100" : ""}</span>
          </div>
        </div>
        <div style={{ flex:1, minWidth:"180px" }}>
          <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#4b5563", marginBottom:"8px" }}>TREND BIAS</div>
          <div style={{ fontSize:"22px", fontWeight:"700", letterSpacing:"2px", color: bias ? bias.color : "#4b5563" }}>
            {bias ? bias.label : "NO DATA"}
          </div>
          <div style={{ marginTop:"10px" }}>
            <div className="gauge-bar">
              <div className="gauge-fill" style={{
                width: overallPct !== null ? `${overallPct}%` : "0%",
                background: bias ? bias.color : "#1e293b" }} />
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
          {tfResults.map(r => (
            <div key={r.id} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"9px", color:r.color, letterSpacing:"1px", marginBottom:"3px" }}>
                {r.label.toUpperCase()}
              </div>
              <div style={{ fontSize:"15px", fontWeight:"700", color: r.pct !== null ? r.color : "#374151" }}>
                {r.pct !== null ? `${r.pct.toFixed(0)}%` : "—"}
              </div>
              <div style={{ fontSize:"9px", color:"#4b5563" }}>{r.weight}pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Timeframe Cards ── */}
      {timeframes.map(tf => {
        const r   = tfResults.find(x => x.id === tf.id);
        const ppc = tf.criteria.length > 0 ? tf.weight / tf.criteria.length : 0;
        return (
          <div className="tf-card" key={tf.id}>
            <div className="tf-header">
              <div style={{ display:"flex", alignItems:"center", gap:"8px", flex:1, minWidth:0 }}>
                <div className="color-dot" style={{ background:tf.color }}
                  onClick={() => cycleTFColor(tf.id)} title="Click to change color" />
                <InlineEdit value={tf.label} onSave={v => updateTF(tf.id,{label:v})}
                  style={{ fontWeight:"700", fontSize:"13px", letterSpacing:"1px", color:tf.color }} />
                <span style={{ fontSize:"10px", color:"#4b5563" }}>—</span>
                <input className="weight-input" type="number" min={0} max={100}
                  value={tf.weight}
                  onChange={e => updateTF(tf.id,{weight:Math.max(0,parseInt(e.target.value)||0)})}
                  title="Edit weight" />
                <span style={{ fontSize:"10px", color:"#4b5563" }}>pts · {ppc.toFixed(1)}/c</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div className="gauge-bar" style={{ width:"70px" }}>
                  <div className="gauge-fill" style={{ width: r.pct!==null?`${r.pct}%`:"0%", background:tf.color }} />
                </div>
                <span style={{ fontSize:"13px", fontWeight:"700", minWidth:"42px", textAlign:"right",
                  color: r.pct !== null ? tf.color : "#374151" }}>
                  {r.pct !== null ? r.earned.toFixed(1) : "—"}
                  <span style={{ fontSize:"10px", color:"#4b5563" }}>/{tf.weight}</span>
                </span>
                <button className="btn btn-danger" onClick={() => deleteTimeframe(tf.id)}>✕</button>
              </div>
            </div>

            {tf.criteria.map((c, i) => {
              const currentVal = scores[c.id] ?? null;
              const earnedPts  = (() => {
                const s = STATES.find(s => s.value === currentVal);
                return s ? (s.score * ppc).toFixed(1) : null;
              })();
              return (
                <div className="criteria-row" key={c.id}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", flex:1, minWidth:0 }}>
                    <span style={{ fontSize:"9px", color:"#374151", minWidth:"16px" }}>C{i+1}</span>
                    <InlineEdit value={c.label} onSave={v => updateCriteriaLabel(tf.id,c.id,v)}
                      style={{ fontSize:"12px", color:"#94a3b8" }} />
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    {STATES.map(state => (
                      <button key={state.value} className="btn btn-state"
                        onClick={() => setScore(c.id, currentVal===state.value ? null : state.value)}
                        style={{
                          background:  currentVal===state.value ? state.bg    : "#111827",
                          color:       currentVal===state.value ? state.color : "#374151",
                          borderColor: currentVal===state.value ? state.color : "#1e293b",
                        }}>
                        {state.label}
                      </button>
                    ))}
                    <span style={{ fontSize:"11px", fontWeight:"700", minWidth:"36px", textAlign:"right",
                      color: earnedPts !== null ? tf.color : "#374151" }}>
                      {earnedPts !== null ? `+${earnedPts}` : "—"}
                    </span>
                    <button className="btn btn-danger" onClick={() => deleteCriteria(tf.id,c.id)}>✕</button>
                  </div>
                </div>
              );
            })}

            <div style={{ padding:"8px 16px" }}>
              <button className="btn btn-add" onClick={() => addCriteria(tf.id)}>+ ADD CRITERIA</button>
            </div>
          </div>
        );
      })}

      <button className="btn btn-add" onClick={addTimeframe}
        style={{ width:"100%", padding:"12px", fontSize:"12px", marginBottom:"20px" }}>
        + ADD TIMEFRAME
      </button>

      {/* ── Legend ── */}
      <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
        {[
          { range:"80–100", label:"Strong Bull", color:"#10b981" },
          { range:"60–79",  label:"Bullish",     color:"#34d399" },
          { range:"45–59",  label:"Slight Bull", color:"#6ee7b7" },
          { range:"40–44",  label:"Neutral",     color:"#f59e0b" },
          { range:"30–39",  label:"Slight Bear", color:"#fca5a5" },
          { range:"20–29",  label:"Bearish",     color:"#f87171" },
          { range:"0–19",   label:"Strong Bear", color:"#ef4444" },
        ].map(b => (
          <div key={b.range} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:b.color }} />
            <span style={{ fontSize:"10px", color:"#4b5563" }}>{b.range}</span>
            <span style={{ fontSize:"10px", color:b.color }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
