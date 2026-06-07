/* Pokémon Solar Eclipse — Pokédex grid view. window.VIEWS.Pokedex */
window.VIEWS = window.VIEWS || {};
(function () {
  const { DEX, TYPES } = window.VSEDEX;
  const { go, TypePill, SpriteSlot, StatBars, Panel, PageHead, Empty } = window.VUI;
  const ALL_TYPES = Object.keys(TYPES);
  const bst = d => Object.values(d.stats).reduce((a, b) => a + b, 0);

  // ---- Grid card ---------------------------------------------------------
  function Card({ d, onOpen }) {
    const [hov, setHov] = React.useState(false);
    const accent = TYPES[d.types[0]].glow;
    const total = bst(d);
    const formCount = (d.forms || []).length;
    return (
      <button onClick={() => onOpen(d)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          textAlign: 'left', cursor: 'pointer', padding: 16, borderRadius: 16,
          background: hov ? `linear-gradient(160deg, ${TYPES[d.types[0]].bg}55, #0a0805)` : '#0c0a05',
          border: `1px solid ${hov ? accent + 'aa' : '#241d10'}`,
          boxShadow: hov ? `0 0 28px ${accent}33` : 'none', transition: 'all .18s', transform: hov ? 'translateY(-3px)' : 'none',
          fontFamily: "'Outfit', sans-serif",
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#7a6c4a' }}>No.{d.dex}</span>
          {formCount > 0 && <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 8, color: '#ffb347' }}>+{formCount} {formCount === 1 ? 'FORM' : 'FORMS'}</span>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <SpriteSlot dex={d.dex} name={d.name} size={132} accent={accent} />
        </div>
        <div style={{ fontFamily: "'Cinzel', Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: 22, color: '#fff', lineHeight: 1 }}>{d.name}</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11.5, color: '#b39a72', margin: '4px 0 10px', minHeight: 14, lineHeight: 1.35 }}>
          {[...d.abilities, ...(d.hidden ? [d.hidden] : [])].join(' · ') || '\u2014'}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>{d.types.map(t => <TypePill key={t} t={t} sm onClick={(e) => { e.stopPropagation(); onOpen(d); }} />)}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #1c1609' }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 8, color: '#7a6c4a' }}>BST</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: accent, fontWeight: 700 }}>{total}</span>
        </div>
      </button>
    );
  }

  // ---- Shiny / Super Shiny showcase --------------------------------------
  // Super shiny hue-shifts the shiny sprite in 45° increments (per the game's
  // adjust_shiny logic: superHue = (1 + rand(7)) * 45  ->  45..360).
  function ShinyShowcase({ d, accent }) {
    const HUE_STEPS = [45, 90, 135, 180, 225, 270, 315, 360];
    const [step, setStep] = React.useState(0);          // index into HUE_STEPS
    const [variant, setVariant] = React.useState(false); // superVariant flag (alt palette flip)
    const hue = HUE_STEPS[step];
    // Shiny stand-in: gold-ward hue rotate on the base sprite until real shiny rips exist.
    const shinyFilter = 'hue-rotate(40deg) saturate(1.35) brightness(1.06)';
    const superFilter = `hue-rotate(${hue}deg) saturate(1.5) brightness(1.08)${variant ? ' invert(0.08)' : ''}`;
    const cell = (label, color, filter, extra) => (
      <div style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 12, background: '#0d0a04', border: `1px solid ${color}44`, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1, color, marginBottom: 8, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ filter, display: 'inline-block' }}><SpriteSlot dex={d.dex} name={d.name} size={92} accent={color} /></div>
        {extra}
      </div>
    );
    return (
      <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #2a2110' }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, color: '#8a7d63', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Sprite Showcase</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {cell('Normal', accent, 'none')}
          {cell('Shiny', '#ffd700', shinyFilter)}
          {cell('Super Shiny', '#ff66cc', superFilter, (
            <div style={{ marginTop: 10 }}>
              <input type="range" min={0} max={HUE_STEPS.length - 1} step={1} value={step}
                onChange={e => setStep(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ff66cc', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#ff8fd6' }}>+{hue}°</span>
                <button onClick={() => setVariant(v => !v)} title="superVariant palette flip"
                  style={{ cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 9, padding: '2px 7px', borderRadius: 6, background: variant ? '#ff66cc22' : 'transparent', color: variant ? '#ff8fd6' : '#7a6c4a', border: `1px solid ${variant ? '#ff66cc66' : '#2a2110'}` }}>VARIANT</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: '#6a5d42', marginTop: 8 }}>
          Super shiny shifts the shiny hue in 45° steps (8 possible hues). Sprites are placeholders until the game's shiny rips are added.
        </div>
      </div>
    );
  }

  // ---- Detail modal (shows primary + nested alt forms) -------------------
  function StatBlock({ entry }) {
    return (
      <div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>{entry.types.map(t => <TypePill key={t} t={t} sm />)}</div>
        <StatBars stats={entry.stats} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 10, borderTop: '1px solid #2a2110' }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, color: '#b8a489' }}>TOTAL</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, color: '#ffb347', fontWeight: 700 }}>{Object.values(entry.stats).reduce((a, b) => a + b, 0)}</span>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, color: '#8a7d63', marginBottom: 6, letterSpacing: 0.5 }}>ABILITIES</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {entry.abilities.map(a => <span key={a} style={{ padding: '4px 10px', borderRadius: 7, background: '#1a1407', border: '1px solid #3a2c12', color: '#ffe0b0', fontSize: 13 }}>{a}</span>)}
            {entry.hidden && <span style={{ padding: '4px 10px', borderRadius: 7, background: '#2a1c08', border: '1px solid #ffb34755', color: '#ffb347', fontSize: 13 }}>{entry.hidden} <span style={{ fontSize: 9, opacity: 0.7 }}>HA</span></span>}
          </div>
        </div>
      </div>
    );
  }

  function Detail({ d, onClose }) {
    const accent = TYPES[d.types[0]].glow;
    const variants = [{ label: 'Base', name: d.name, types: d.types, abilities: d.abilities, hidden: d.hidden, stats: d.stats }, ...(d.forms || [])];
    const [vi, setVi] = React.useState(0);
    const cur = variants[vi];
    React.useEffect(() => {
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#05040108', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 720, background: 'linear-gradient(160deg, #14100a, #0a0805)', border: `1px solid ${accent}44`, borderRadius: 18, boxShadow: `0 0 60px ${accent}22, 0 30px 80px #000a`, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #241d10' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#7a6c4a' }}>No.{d.dex}</span>
            <button onClick={onClose} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid #3a2c12', color: '#b3a892', borderRadius: 8, width: 30, height: 30, fontSize: 16 }}>×</button>
          </div>
          <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, alignItems: 'start' }} className="se-detail-grid">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <SpriteSlot dex={d.dex} name={cur.name} size={160} accent={accent} suffix={vi > 0 ? String(vi) : undefined} />
              <div style={{ fontFamily: "'Cinzel', Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: 28, color: '#fff', textAlign: 'center', lineHeight: 1 }}>{cur.name}</div>
              {d.evoNote && vi === 0 && <div style={{ fontSize: 12, color: '#9a8d6f', textAlign: 'center' }}>Evolves {d.evoNote}</div>}
            </div>
            <div>
              {variants.length > 1 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {variants.map((v, i) => (
                    <button key={i} onClick={() => setVi(i)} style={{
                      cursor: 'pointer', padding: '5px 11px', borderRadius: 8, fontSize: 12, fontFamily: "'Outfit', sans-serif",
                      background: vi === i ? '#2a1c08' : 'transparent', color: vi === i ? '#ffb347' : '#9a8d6f',
                      border: `1px solid ${vi === i ? '#ffb34788' : '#2a2110'}`, fontWeight: vi === i ? 600 : 400,
                    }}>{i === 0 ? 'Base' : (v.label || `Form ${i}`)}</button>
                  ))}
                </div>
              )}
              <StatBlock entry={cur} />
              <ShinyShowcase d={d} accent={accent} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Page --------------------------------------------------------------
  window.VIEWS.Pokedex = function Pokedex({ query }) {
    const [filters, setFilters] = React.useState([]);
    const [sort, setSort] = React.useState('dex');
    const [open, setOpen] = React.useState(null);
    const q = (query || '').trim().toLowerCase();
    const toggle = (t) => setFilters(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t]);

    let list = DEX.filter(d => {
      if (q && !(d.name.toLowerCase().includes(q) || d.dex.includes(q) || (d.category || '').toLowerCase().includes(q))) return false;
      if (filters.length && !filters.every(t => d.types.includes(t))) return false;
      return true;
    });
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'bst') list = [...list].sort((a, b) => bst(b) - bst(a));
    else list = [...list].sort((a, b) => a.dex.localeCompare(b.dex));

    const SortBtn = ({ id, label }) => (
      <button onClick={() => setSort(id)} style={{
        cursor: 'pointer', padding: '6px 12px', borderRadius: 7, fontFamily: "'Outfit', sans-serif", fontSize: 13,
        background: sort === id ? '#2a1c08' : 'transparent', color: sort === id ? '#fff' : '#9a8d6f',
        border: `1px solid ${sort === id ? '#5a4318' : '#241d10'}`, fontWeight: sort === id ? 600 : 400, whiteSpace: 'nowrap', flexShrink: 0,
      }}>{label}</button>
    );

    return (
      <div>
        <PageHead kicker="REGIONAL SOLDEX" title="Pokédex"
          sub="Every species catalogued for Pokémon Solar Eclipse. Filter by type, search by name, and open any entry for its stats, abilities, and alternate forms." />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ALL_TYPES.map(t => {
              const on = filters.includes(t); const c = TYPES[t];
              return (
                <button key={t} onClick={() => toggle(t)} style={{
                  cursor: 'pointer', padding: '4px 10px', borderRadius: 999, fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 0.5, fontWeight: 600,
                  textTransform: 'uppercase', color: on ? c.fg : c.glow, background: on ? c.bg : c.glow + '14',
                  border: `1px solid ${on ? c.glow : c.glow + '66'}`, opacity: on ? 1 : 0.85,
                  boxShadow: on ? `0 0 12px ${c.glow}55, inset 0 0 10px ${c.glow}33` : 'none', transition: 'all .15s',
                }}>{c.name}</button>
              );
            })}
            {filters.length > 0 && <button onClick={() => setFilters([])} style={{ cursor: 'pointer', padding: '4px 10px', borderRadius: 999, fontSize: 11, color: '#ff8f6f', background: 'transparent', border: '1px solid #5e3020', fontFamily: "'Outfit', sans-serif" }}>clear ×</button>}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, color: '#7a6c4a' }}>SORT</span>
            <SortBtn id="dex" label="Dex №" /><SortBtn id="name" label="A–Z" /><SortBtn id="bst" label="Total" />
          </div>
        </div>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#8a7d63', marginBottom: 16 }}>{list.length} {list.length === 1 ? 'entry' : 'entries'}</div>

        {list.length === 0 ? <Empty label="No Pokémon match your filters." /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(216px, 1fr))', gap: 16 }}>
            {list.map(d => <Card key={d.dex} d={d} onOpen={setOpen} />)}
          </div>
        )}

        {open && <Detail d={open} onClose={() => setOpen(null)} />}
      </div>
    );
  };
})();
