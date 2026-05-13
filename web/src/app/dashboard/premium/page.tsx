export default function PremiumPage() {
  return (
    <div>
      <h1 style={{ fontSize:20, fontWeight:500, color:'#f0f4ff', marginBottom:4 }}>Premium access</h1>
      <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:28 }}>Get access to private projects, source code, and early content.</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        {/* Free tier */}
        <div style={{ padding:24, borderRadius:12, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:8 }}>Free</p>
          <p style={{ fontSize:28, fontWeight:700, color:'#f0f4ff', marginBottom:4 }}>€0 <span style={{ fontSize:13, fontWeight:400, color:'rgba(255,255,255,0.3)' }}>/mo</span></p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Current plan</p>
          {['All public projects','Blog posts','Discussions','Comments'].map(f => (
            <div key={f} style={{ display:'flex', gap:8, marginBottom:8, fontSize:13, color:'rgba(255,255,255,0.55)' }}>
              <span style={{ color:'#22c55e' }}>✓</span>{f}
            </div>
          ))}
        </div>

        {/* Premium tier */}
        <div style={{ padding:24, borderRadius:12, background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(6,182,212,0.07))', border:'1px solid rgba(99,102,241,0.35)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.15),transparent)', pointerEvents:'none' }} />
          <p style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#818cf8', marginBottom:8, position:'relative' }}>Premium ✦</p>
          <p style={{ fontSize:28, fontWeight:700, color:'#f0f4ff', marginBottom:4, position:'relative' }}>€5 <span style={{ fontSize:13, fontWeight:400, color:'rgba(255,255,255,0.4)' }}>/mo</span></p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:20, position:'relative' }}>Everything in Free, plus:</p>
          {['Private project source code','Early access to new projects','Exclusive build logs','Priority support','Discord role'].map(f => (
            <div key={f} style={{ display:'flex', gap:8, marginBottom:8, fontSize:13, color:'rgba(255,255,255,0.7)', position:'relative' }}>
              <span style={{ color:'#818cf8' }}>✦</span>{f}
            </div>
          ))}
          <button style={{ marginTop:16, width:'100%', padding:'11px', borderRadius:8, background:'linear-gradient(135deg,#4f46e5,#06b6d4)', color:'#fff', fontSize:13, fontWeight:500, border:'none', cursor:'pointer', position:'relative' }}>
            Upgrade — coming soon
          </button>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', textAlign:'center', marginTop:8, position:'relative' }}>Stripe integration coming. Subscribe to get notified.</p>
        </div>
      </div>

      {/* Support alternatives */}
      <div style={{ padding:20, borderRadius:10, background:'rgba(255,255,255,0.02)', border:'0.5px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontSize:13, fontWeight:500, color:'#f0f4ff', marginBottom:14 }}>Support the work directly</p>
        <div style={{ display:'flex', gap:10 }}>
          <a href="https://buymeacoffee.com" target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:8, background:'#FFDD00', color:'#1a1a1a', fontSize:13, fontWeight:500, textDecoration:'none' }}>
            ☕ Buy me a coffee
          </a>
          <a href="https://patreon.com" target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:8, background:'rgba(255,66,77,0.15)', border:'0.5px solid rgba(255,66,77,0.4)', color:'#ff424d', fontSize:13, fontWeight:500, textDecoration:'none' }}>
            ♥ Support on Patreon
          </a>
        </div>
      </div>
    </div>
  )
}
