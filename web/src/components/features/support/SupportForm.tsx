'use client'
import { useState } from 'react'
import { useSubmitSupport } from '@/lib/hooks/useSupport'
import { Button }  from '@/components/ui/Button'
import { Input }   from '@/components/ui/Input'
import type { SupportDto } from '@/lib/hooks/useSupport'

const EMPTY: SupportDto = { name:'', email:'', subject:'', message:'', type:'general' }

export function SupportForm() {
  const { mutateAsync, isPending, isSuccess, error, reset } = useSubmitSupport()
  const [form, setForm] = useState<SupportDto>(EMPTY)
  const set = (k: keyof SupportDto, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await mutateAsync(form)
  }

  if (isSuccess) {
    return (
      <div style={{ padding:'32px', borderRadius:12, background:'rgba(34,197,94,0.08)', border:'0.5px solid rgba(34,197,94,0.25)', textAlign:'center' }}>
        <p style={{ fontSize:22 }}>✓</p>
        <p style={{ fontSize:15, fontWeight:500, color:'#22c55e', marginBottom:6 }}>Message sent!</p>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>I&apos;ll get back to you soon.</p>
        <Button variant="ghost" size="sm" onClick={() => { reset(); setForm(EMPTY) }}>Send another</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Input required label="Name" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Max Smith" />
        <Input required label="Email" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" />
      </div>
      <Input required label="Subject" value={form.subject} onChange={e=>set('subject',e.target.value)} placeholder="Collaboration on a project" />
      <div>
        <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.5)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Type</label>
        <select value={form.type} onChange={e=>set('type',e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:13, outline:'none', cursor:'pointer' }}>
          <option value="general">General enquiry</option>
          <option value="feature">Project collaboration</option>
          <option value="billing">Billing / Premium</option>
          <option value="bug">Bug report</option>
        </select>
      </div>
      <div>
        <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.5)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Message</label>
        <textarea required rows={5} value={form.message} onChange={e=>set('message',e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'#f0f4ff', fontSize:13, outline:'none', fontFamily:'inherit', resize:'vertical' }} />
      </div>
      {error && <p style={{ fontSize:12, color:'#f87171' }}>⚠ {(error as Error).message}</p>}
      <Button type="submit" loading={isPending}>Send message</Button>
    </form>
  )
}
