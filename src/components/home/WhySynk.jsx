import { useState, useEffect } from 'react'
import Reveal from '@/components/ui/Reveal'

const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Pagamento Escrow',
    desc: 'O dinheiro só é libertado quando aprovares o trabalho. Total segurança para ambas as partes.',
    color: '#A78BFA',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Especialistas Verificados',
    desc: 'Cada especialista passa por uma avaliação técnica antes de entrar na plataforma.',
    color: '#34D399',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Match em 48h',
    desc: 'O nosso algoritmo encontra os melhores candidatos para o teu projeto em menos de 48 horas.',
    color: '#FB923C',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Comunicação Integrada',
    desc: 'Gere toda a comunicação, ficheiros e milestones diretamente na plataforma.',
    color: '#67E8F9',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Sistema de Avaliações',
    desc: 'Reviews verificados de projetos reais. Sabes sempre com quem estás a trabalhar.',
    color: '#F59E0B',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Talentos Ibéricos e LATAM',
    desc: 'Acesso a especialistas em Portugal, Espanha e América Latina.',
    color: '#C4B5FD',
  },
]

const TIMELINE_STEPS = [
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    label: 'Projeto publicado',
    detail: 'Automação ERP · TechCorp SA',
    time: '2 min',
    done: true,
    accent: 'rgba(124,92,246,0.85)',
    accentBg: 'rgba(124,92,246,0.10)',
    accentBorder: 'rgba(124,92,246,0.22)',
  },
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: '4 propostas recebidas',
    detail: 'Especialistas verificados',
    time: '18h',
    done: true,
    accent: 'rgba(129,140,248,0.85)',
    accentBg: 'rgba(129,140,248,0.08)',
    accentBorder: 'rgba(129,140,248,0.2)',
  },
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    label: 'Especialista selecionado',
    detail: 'Ana Costa · Rating 4.9★',
    time: '38h',
    done: true,
    accent: 'rgba(52,211,153,0.85)',
    accentBg: 'rgba(52,211,153,0.08)',
    accentBorder: 'rgba(52,211,153,0.2)',
  },
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    label: 'Entrega em progresso',
    detail: '75% concluído · 3 dias restantes',
    time: 'Agora',
    done: false,
    accent: 'rgba(251,146,60,0.85)',
    accentBg: 'rgba(251,146,60,0.08)',
    accentBorder: 'rgba(251,146,60,0.2)',
  },
]

function ProjectTimeline() {
  const [activeStep, setActiveStep] = useState(3)

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep(prev => (prev + 1) % TIMELINE_STEPS.length)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  const step = TIMELINE_STEPS[activeStep]

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '360px',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        background: 'var(--surface)',
        border: '1px solid rgba(124,92,246,0.15)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 60px rgba(124,92,246,0.06)',
      }}
    >
      {/* Header */}
      <div
        style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(124,92,246,0.04)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>Automação ERP</span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px', background: 'rgba(251,146,60,0.1)', color: 'rgba(251,146,60,0.9)', border: '1px solid rgba(251,146,60,0.2)' }}>
          Em progresso
        </span>
      </div>

      {/* Timeline steps */}
      <div style={{ padding: '16px 20px' }}>
        {TIMELINE_STEPS.map((s, i) => {
          const isActive = i === activeStep
          const isPast = s.done && !isActive
          return (
            <div key={i} style={{ position: 'relative', marginBottom: i < 3 ? '4px' : '0' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  background: isActive ? s.accentBg : 'transparent',
                  border: `1px solid ${isActive ? s.accentBorder : 'transparent'}`,
                  transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: isActive ? s.accentBg : isPast ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? s.accent : isPast ? 'rgba(52,211,153,0.7)' : 'var(--text-3)',
                    border: `1px solid ${isActive ? s.accentBorder : isPast ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)'}`,
                    transition: 'all 0.5s ease',
                    marginTop: '1px',
                  }}
                >
                  {isPast ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : s.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: isActive ? 'var(--text)' : isPast ? 'var(--text-2)' : 'var(--text-3)', letterSpacing: '-0.01em', margin: 0, transition: 'color 0.5s ease' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-3)', margin: '2px 0 0 0' }}>{s.detail}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {isActive && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.accent, animation: 'pulse 1.5s ease-in-out infinite' }} />}
                  <span style={{ fontSize: '10px', color: isActive ? s.accent : 'var(--text-3)', transition: 'color 0.5s ease' }}>{s.time}</span>
                </div>
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div style={{ position: 'absolute', left: '33px', top: '42px', width: '1px', height: '8px', background: i < activeStep ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.06)', transition: 'background 0.5s ease' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(52,211,153,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(52,211,153,0.1)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#34d399', margin: 0 }}>€2.800 em Escrow</p>
            <p style={{ fontSize: '10px', color: 'var(--text-3)', margin: 0 }}>Libertado na aprovação</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>TechCorp SA</p>
          <p style={{ fontSize: '10px', color: 'var(--text-3)', margin: 0 }}>Ana Costa · 38h match</p>
        </div>
      </div>
    </div>
  )
}

export default function WhyTwonect() {
  return (
    <section id="features" className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Features */}
          <div>
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ display: 'block', width: '28px', height: '1px', background: 'var(--brand-light)', opacity: 0.6 }} />
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-light)' }}>
                  Porquê a Twonect
                </span>
              </div>
              <h2
                className="font-display"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: 'var(--text)', marginBottom: '12px' }}
              >
                Construído para que{' '}
                <span style={{ color: 'var(--brand-light)' }}>nada corra mal</span>
              </h2>
              <p style={{ color: 'var(--text-2)', fontSize: '1.0625rem', letterSpacing: '-0.01em', marginBottom: '40px', maxWidth: '440px' }}>
                Cada detalhe foi pensado para proteger empresas e especialistas.
              </p>
            </Reveal>

            {/* Feature rows — numbered, no identical cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {FEATURES.map((f, i) => (
                <Reveal key={i} delay={i * 55}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '24px 1fr',
                      gap: '0 16px',
                      paddingTop: i === 0 ? '0' : '18px',
                      paddingBottom: '18px',
                      borderBottom: i < FEATURES.length - 1 ? '1px solid var(--border)' : 'none',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Color dot */}
                    <div style={{ paddingTop: '3px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `${f.color}12`,
                          color: f.color,
                          border: `1px solid ${f.color}20`,
                          flexShrink: 0,
                        }}
                      >
                        {f.icon}
                      </div>
                    </div>
                    {/* Content */}
                    <div style={{ paddingTop: '5px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
                        {f.title}
                      </p>
                      <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-2)', margin: 0, letterSpacing: '-0.01em' }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Timeline mockup */}
          <Reveal delay={200}>
            <div className="flex justify-center lg:justify-end" style={{ position: 'sticky', top: '100px' }}>
              <ProjectTimeline />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
