import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useSmartCTA from '@/hooks/useSmartCTA'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

const TRUST_ITEMS = [
  { label: 'Match em menos de 48h' },
  { label: 'Pagamento protegido por Escrow' },
  { label: 'Especialistas verificados' },
  { label: 'Portugal · Espanha · LATAM' },
]

const ACTIVITY = [
  {
    dot: 'rgba(52,211,153,0.9)',
    label: 'Nova proposta recebida',
    sub: 'Automação RPA · Ana Costa · €2.800',
    time: '2 min',
    to: '/dashboard',
  },
  {
    dot: 'rgba(167,139,250,0.9)',
    label: 'Match encontrado em 38h',
    sub: 'Integração Zapier · Miguel Santos',
    time: '1h',
    to: '/marketplace?tab=projetos',
  },
  {
    dot: 'rgba(52,211,153,0.9)',
    label: 'Projeto concluído com sucesso',
    sub: 'Power Automate · Avaliação 5★',
    time: '3h',
    to: '/marketplace?tab=especialistas',
  },
  {
    dot: 'rgba(167,139,250,0.9)',
    label: 'Pagamento libertado via Escrow',
    sub: 'GreenRetail SA · €4.500',
    time: '5h',
    to: '/dashboard',
  },
]

function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K'
  return String(n)
}

function HeroMockup() {
  const [stats, setStats] = useState({ especialistas: '—', projetos: '—' })
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    Promise.all([
      supabase.from('especialistas').select('*', { count: 'exact', head: true }),
      supabase.from('projetos').select('*', { count: 'exact', head: true }).neq('estado', 'pendente_pagamento'),
    ]).then(([esp, proj]) => {
      setStats({
        especialistas: fmt(esp.count ?? 0),
        projetos: fmt(proj.count ?? 0),
      })
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % ACTIVITY.length)
    }, 2600)
    return () => clearInterval(timer)
  }, [])

  const METRICS = [
    { value: stats.especialistas, label: 'Especialistas' },
    { value: stats.projetos, label: 'Projetos' },
    { value: '4.9★', label: 'Rating médio' },
    { value: '38h', label: 'Tempo de match' },
  ]

  return (
    <div className="relative" style={{ width: '380px', maxWidth: '100%' }}>
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: '0 0 80px rgba(124,92,246,0.12)',
          borderRadius: '18px',
        }}
      />
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(124,92,246,0.18)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(124,92,246,0.04)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--brand)' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="5" cy="19" r="2"/>
                <circle cx="19" cy="19" r="2"/>
                <line x1="12" y1="7" x2="6.5" y2="17"/>
                <line x1="12" y1="7" x2="17.5" y2="17"/>
              </svg>
            </div>
            <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 600, letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Twonect Platform
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34d399' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#34d399' }}>Ao vivo</span>
          </div>
        </div>

        {/* Metrics — horizontal bar */}
        <div
          className="grid grid-cols-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className="flex flex-col items-center justify-center py-3"
              style={{
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '15px', color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {m.value}
              </span>
              <span style={{ color: 'var(--text-3)', fontSize: '9px', marginTop: '3px', letterSpacing: '0.02em', textAlign: 'center' }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <div className="px-4 pt-3.5 pb-2">
          <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Atividade recente
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {ACTIVITY.map((a, i) => {
              const isActive = i === activeIdx
              return (
                <Link
                  key={i}
                  to={a.to}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      background: isActive ? 'rgba(124,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isActive ? 'rgba(124,92,246,0.22)' : 'transparent'}`,
                      transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: a.dot,
                        boxShadow: isActive ? `0 0 8px ${a.dot}` : 'none',
                        transition: 'box-shadow 0.45s ease',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: isActive ? 'var(--text)' : 'var(--text-2)', letterSpacing: '-0.01em', transition: 'color 0.45s ease', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.label}
                      </p>
                      <p style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.sub}
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-3)', flexShrink: 0 }}>{a.time}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(52,211,153,0.03)', marginTop: '8px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#34d399' }}>Pagamentos protegidos por Escrow</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-2)' }}>€1.2M+</span>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const { empresaTo, especialistaTo } = useSmartCTA()
  const { perfil } = useAuth()

  const isEspecialista = perfil === 'especialista'
  const isEmpresa = perfil === 'empresa'

  const heroHeadingPart1 = isEspecialista ? 'Encontra os melhores' : 'Automatiza o teu'
  const heroHighlight = isEspecialista ? 'projetos de automação' : 'negócio com os'
  const heroHeadingPart2 = isEspecialista ? null : 'melhores especialistas'
  const heroSub = isEspecialista
    ? 'A Twonect conecta-te a empresas que precisam das tuas competências. Projetos qualificados, pagamento garantido, sem intermediários desnecessários.'
    : 'A Twonect conecta a tua empresa a especialistas em automação verificados. Encontra o profissional certo, lança o projeto e paga só quando estiveres satisfeito.'

  const primaryTo = isEspecialista ? especialistaTo : empresaTo
  const primaryLabel = isEspecialista ? 'Ver Projetos' : isEmpresa ? 'Publicar Projeto' : 'Publicar Projeto Grátis'
  const secondaryTo = isEspecialista || isEmpresa ? '/dashboard' : especialistaTo
  const secondaryLabel = isEspecialista || isEmpresa ? 'Ir para o Dashboard' : 'Sou Especialista'

  return (
    <section
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Background: single ambient orb, no animation */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          right: '-5%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle at 60% 40%, rgba(124,92,246,0.11) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Structural line grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 10%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 10%, transparent 100%)',
        }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(124,92,246,0.5) 50%, transparent 100%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Copy */}
          <div>
            {/* Eyebrow — editorial style */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <span style={{ display: 'block', width: '28px', height: '1px', background: 'var(--brand-light)', opacity: 0.6 }} />
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--brand-light)',
              }}>
                Marketplace B2B de Automação
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display mb-6"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', color: 'var(--text)', letterSpacing: '-0.04em', lineHeight: 1.04 }}
            >
              {heroHeadingPart1}{' '}
              <span style={{ color: 'var(--brand-light)' }}>{heroHighlight}</span>
              {heroHeadingPart2 && <><br />{heroHeadingPart2}</>}
            </h1>

            <p
              className="mb-10 leading-relaxed"
              style={{ color: 'var(--text-2)', fontSize: '1.0625rem', letterSpacing: '-0.01em', maxWidth: '480px' }}
            >
              {heroSub}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
              <Link to={primaryTo} className="btn-primary btn-primary-lg">
                {primaryLabel}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to={secondaryTo} className="btn-outline">{secondaryLabel}</Link>
            </div>

            {/* Trust bar — horizontal with separators */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0',
                padding: '12px 16px',
                borderRadius: 'var(--r)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
              }}
            >
              {TRUST_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingRight: i < TRUST_ITEMS.length - 1 ? '14px' : '0',
                    marginRight: i < TRUST_ITEMS.length - 1 ? '14px' : '0',
                    borderRight: i < TRUST_ITEMS.length - 1 ? '1px solid var(--border-2)' : 'none',
                  }}
                >
                  <span
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--brand-light)',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-2)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div className="flex justify-center lg:justify-end">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
