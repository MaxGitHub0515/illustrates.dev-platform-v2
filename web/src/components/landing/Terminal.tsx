'use client'
import { useEffect, useState } from 'react'

const SEQUENCE = [
  { method: 'GET',  mColor: 'text-emerald-400', path: '/api/v1/projects',    res: '→ 200 OK · 12ms · cached ✓',    rColor: 'text-white/30' },
  { method: 'POST', mColor: 'text-orange-400',  path: '/api/v1/discussions', res: '→ 201 · auth ✓ · validated ✓',  rColor: 'text-emerald-400' },
  { method: 'GET',  mColor: 'text-emerald-400', path: '/metrics',            res: 'http_requests_total ↑ 1.2k',     rColor: 'text-indigo-400' },
]

type Line = { method: string; mColor: string; path: string; res: string; rColor: string; done: boolean }

export function Terminal() {
  const [lines,  setLines]  = useState<Line[]>([])
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let i = 0
    const add = () => {
      if (i >= SEQUENCE.length) {
        setTimeout(() => { setLines([]); i = 0; setTimeout(loop, 600) }, 2800)
        return
      }
      setLines(prev => [...prev, { ...SEQUENCE[i], done: false }])
      i++
      setTimeout(() => {
        setLines(prev => prev.map((l, idx) => idx === i - 1 ? { ...l, done: true } : l))
        setTimeout(add, 700)
      }, 340)
    }
    const loop = () => add()
    const initial = setTimeout(loop, 800)
    return () => clearTimeout(initial)
  }, [])

  return (
    <div
      className="rounded-xl p-[1.5px]"
      style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.55),rgba(6,182,212,0.45),rgba(16,185,129,0.2))' }}
    >
      <div className="rounded-[11px] overflow-hidden bg-[#080a14]">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/5 bg-white/[0.02]">
          <div className="w-2 h-2 rounded-full bg-[#ff5f57] opacity-75" />
          <div className="w-2 h-2 rounded-full bg-[#ffbd2e] opacity-75" />
          <div className="w-2 h-2 rounded-full bg-[#28c840] opacity-75" />
          <span className="text-[11px] text-white/25 ml-2 font-mono">portfolio-api</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-mono">live</span>
          </div>
        </div>

        {/* Output */}
        <div className="p-4 font-mono text-[11px] leading-[2.1] min-h-[148px]">
          {lines.map((line, i) => (
            <div key={i}>
              <p>
                <span className={`${line.mColor} font-medium`}>{line.method}</span>
                {'  '}
                <span className="text-cyan-400">{line.path}</span>
              </p>
              {line.done && <p className={line.rColor}>{line.res}</p>}
            </div>
          ))}
          <span className={`text-white/30 ${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>▋</span>
        </div>

        {/* Status bar */}
        <div className="flex gap-3.5 px-4 py-2 border-t border-white/[0.04] bg-white/[0.015]">
          {['auth', 'redis', 'prometheus', 'docker'].map(s => (
            <span key={s} className="text-[10px] font-mono text-white/25">
              <span className="text-emerald-400">✓</span> {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
