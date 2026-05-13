export default function AdminSettings() {
  return (
    <div style={{ padding:'32px 36px' }}>
      <h1 style={{ fontSize:22, fontWeight:500, color:'#f0f4ff', marginBottom:24 }}>Settings</h1>
      <div style={{ maxWidth:480, display:'flex', flexDirection:'column', gap:16 }}>
        {[
          { label:'Site name',   value:'illustrates.dev', type:'text'  },
          { label:'Contact email', value:'hello@illustrates.dev', type:'email' },
          { label:'GitHub URL',  value:'https://github.com', type:'url' },
        ].map(f => (
          <div key={f.label}>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:6, fontWeight:500 }}>{f.label}</label>
            <input
              defaultValue={f.value}
              type={f.type}
              style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'#f0f4ff', fontSize:13, outline:'none', fontFamily:'inherit' }}
            />
          </div>
        ))}
        <button style={{ alignSelf:'flex-start', padding:'9px 20px', borderRadius:8, background:'linear-gradient(135deg,#4f46e5,#06b6d4)', color:'#fff', fontSize:13, fontWeight:500, border:'none', cursor:'pointer', marginTop:8 }}>
          Save changes
        </button>
      </div>
    </div>
  )
}
