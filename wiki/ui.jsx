/* Pokémon Solar Eclipse — shared UI kit. window.VUI
   Mirrors the Void VUI component API, re-themed: starry black + corona orange/gold. */
(function () {
  const { TYPES, STAT_LABELS, STAT_MAX } = window.VSEDEX;
  const go = (hash) => { window.location.hash = hash; };

  // ---- Type pill ---------------------------------------------------------
  function TypePill({ t, sm, glow, onClick }) {
    const c = TYPES[t] || { name: t, bg: '#333', glow: '#888', fg: '#fff' };
    const stop = (e) => { e.stopPropagation(); go('#/types'); };
    return (
      <span onClick={onClick === undefined ? stop : onClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          padding: sm ? '3px 9px' : '5px 13px', borderRadius: 999, background: glow ? `${c.bg}cc` : c.bg, color: c.fg,
          fontFamily: "'Silkscreen', monospace", fontSize: sm ? 9 : 11, letterSpacing: 0.5, textTransform: 'uppercase',
          border: `1px solid ${c.glow}${glow ? '' : '55'}`,
          boxShadow: glow ? `0 0 16px ${c.glow}55, inset 0 0 12px ${c.glow}33` : `inset 0 0 10px ${c.glow}22`,
        }}>
        {!sm && <span style={{ width: 6, height: 6, borderRadius: 1, background: c.glow }} />}
        {c.name}
      </span>
    );
  }

  // ---- Sprite slot (auto-loads sprites/<dex>.png if present) -------------
  function SpriteSlot({ dex, name, size = 120, label, accent = '#ffb347', suffix }) {
    const knownBase = dex && window.SPRITE_SET && window.SPRITE_SET.has(String(dex));
    const hasSrc = dex && (suffix !== undefined || knownBase || !window.SPRITE_SET);
    const cacheKey = window.SPRITE_VERSION ? `?v=${window.SPRITE_VERSION}` : '';
    const src = hasSrc ? `sprites/${dex}${suffix ? '-' + suffix : ''}.png${cacheKey}` : null;
    const [ok, setOk] = React.useState(false);
    React.useEffect(() => { setOk(false); }, [src]);
    return (
      <div style={{
        position: 'relative', width: size, height: size, borderRadius: 10, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 42%, #2a1c08 0%, #0a0905 74%)', border: `1px solid ${accent}33`,
      }}>
        {/* faint corona ring + starfield */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 44%, transparent 30%, #ffb34711 42%, transparent 52%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(1px 1px at 20% 30%, #fff7, transparent), radial-gradient(1px 1px at 70% 60%, #fff5, transparent), radial-gradient(1px 1px at 42% 80%, #fff6, transparent), radial-gradient(2px 2px at 62% 22%, #ffd98a88, transparent)' }} />
        {src && <img src={src} alt={name} onLoad={() => setOk(true)} onError={() => setOk(false)}
          style={{ position: 'absolute', inset: '8%', width: '84%', height: '84%', objectFit: 'contain', imageRendering: 'pixelated', display: ok ? 'block' : 'none', zIndex: 3 }} />}
        {!ok && (
          <div style={{
            position: 'relative', zIndex: 2, width: '72%', height: '72%', borderRadius: 8,
            border: `1px dashed ${accent}66`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', color: '#c2a06f', fontFamily: "'Space Mono', monospace", fontSize: Math.max(8, size / 13), lineHeight: 1.5,
            background: 'repeating-linear-gradient(45deg, #161106, #161106 6px, #1d1608 6px, #1d1608 12px)',
          }}>{label || 'SPRITE'}</div>
        )}
      </div>
    );
  }

  // ---- Stat bars ---------------------------------------------------------
  const STAT_COLORS = { HP: '#ff7a6f', ATK: '#ffb347', DEF: '#ffd23c', SPA: '#ff9e58', SPD: '#ffe07a', SPE: '#ff6f4c' };
  function StatBars({ stats }) {
    return (
      <div>
        {Object.keys(STAT_LABELS).map(k => {
          const v = stats[k] || 0;
          const pct = Math.min(100, (v / STAT_MAX) * 100);
          const col = STAT_COLORS[k] || '#ffb347';
          return (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '74px 34px 1fr', alignItems: 'center', gap: 10, marginBottom: 9 }}>
              <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: 9, color: '#b8a489' }}>{STAT_LABELS[k].toUpperCase()}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: '#fff6e8', fontWeight: 700, textAlign: 'right' }}>{v}</span>
              <div style={{ height: 9, borderRadius: 3, background: '#1a1407', overflow: 'hidden', border: '1px solid #3a2c12' }}>
                <div style={{ width: pct + '%', height: '100%', background: col, boxShadow: `0 0 9px ${col}`, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ---- Panel -------------------------------------------------------------
  function Panel({ title, children, style }) {
    return (
      <section style={{ background: '#0f0b04cc', border: '1px solid #2a2110', borderRadius: 14, padding: 18, ...style }}>
        {title && <h3 style={{ margin: '0 0 14px', fontFamily: "'Silkscreen', monospace", fontSize: 11, letterSpacing: 1, color: '#ffb347', textTransform: 'uppercase' }}>{title}</h3>}
        {children}
      </section>
    );
  }

  // ---- Page header -------------------------------------------------------
  function PageHead({ kicker, title, sub }) {
    return (
      <div style={{ marginBottom: 26 }}>
        {kicker && <div style={{ fontFamily: "'Silkscreen', monospace", fontSize: 11, letterSpacing: 2, color: '#ffb347', marginBottom: 10 }}>{kicker}</div>}
        <h1 className="v-pagehead" style={{ margin: 0, fontFamily: "'Pixelify Sans', sans-serif", fontWeight: 700, fontSize: 46, lineHeight: 1, color: '#fff', textShadow: '0 0 28px #ffb34755' }}>{title}</h1>
        {sub && <p style={{ margin: '12px 0 0', fontSize: 16, color: '#b3a892', maxWidth: 640, textWrap: 'pretty' }}>{sub}</p>}
      </div>
    );
  }

  // ---- Empty -------------------------------------------------------------
  function Empty({ label }) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#8a7d63', fontFamily: "'Space Mono', monospace", fontSize: 14 }}>{label}</div>;
  }

  window.VUI = { go, TypePill, SpriteSlot, StatBars, Panel, PageHead, Empty, TYPES };
})();
