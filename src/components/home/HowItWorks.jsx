import { useState } from 'react'
import Reveal from '@/components/ui/Reveal'

const ICONS = {
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  bolt: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  inbox: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
}

const STEPS = {
  empresas: [
    { icon: ICONS.search, title: 'Descreve o projeto', desc: 'Conta-nos que processo queres automatizar. O nosso sistema identifica o tipo de automação e sugere os melhores especialistas.', step: '01' },
    { icon: ICONS.bolt, title: 'Recebe propostas em 48h', desc: 'Compara perfis, portfolios, avaliações e preços. Fala diretamente com os candidatos antes de decidir.', step: '02' },
    { icon: ICONS.check, title: 'Paga só quando aprovares', desc: 'O pagamento fica retido em Escrow até aprovares o trabalho. Zero risco para a tua empresa.', step: '03' },
  ],
  especialistas: [
    { icon: ICONS.user, title: 'Cria o teu perfil', desc: 'Mostra as tuas competências em automação, ferramentas que dominas e projetos anteriores. Verificação rápida em 24h.', step: '01' },
    { icon: ICONS.inbox, title: 'Recebe projetos qualificados', desc: 'Recebe notificações de projetos que correspondem ao teu perfil. Sem spam, só oportunidades reais.', step: '02' },
    { icon: ICONS.shield, title: 'Recebe de forma segura', desc: 'Pagamento garantido via Escrow. Nunca trabalhas sem garantia de pagamento.', step: '03' },
  ],
}

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('empresas')

  return (
    <section id="como-funciona" className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal>
          <div className="mb-14">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ display: 'block', width: '28px', height: '1px', background: 'var(--brand-light)', opacity: 0.6 }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-light)' }}>
                Como funciona
              </span>
            </div>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: 'var(--text)', maxWidth: '520px' }}
            >
              Simples para empresas.{' '}
              <span style={{ color: 'var(--brand-light)' }}>Poderoso para especialistas.</span>
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1.0625rem', letterSpacing: '-0.01em', maxWidth: '480px', marginTop: '12px' }}>
              Um processo transparente do início ao fim, com proteção para ambas as partes.
            </p>
          </div>
        </Reveal>

        {/* Tab toggle — text style */}
        <Reveal delay={80}>
          <div style={{ display: 'flex', gap: '28px', marginBottom: '56px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
            {['empresas', 'especialistas'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  paddingBottom: '14px',
                  paddingTop: '0',
                  paddingLeft: '0',
                  paddingRight: '0',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  fontFamily: 'inherit',
                  color: activeTab === tab ? 'var(--text)' : 'var(--text-3)',
                  borderBottom: activeTab === tab ? '2px solid var(--brand-light)' : '2px solid transparent',
                  marginBottom: '-1px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                {tab === 'empresas' ? 'Para Empresas' : 'Para Especialistas'}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Steps — numbered flow, no card containers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STEPS[activeTab].map((step, i) => (
            <div
              key={`${activeTab}-${i}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '0 32px',
                paddingTop: i === 0 ? '0' : '36px',
                paddingBottom: '36px',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                position: 'relative',
                animation: 'stepFadeIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
                animationDelay: `${i * 60}ms`,
              }}
            >
              {/* Step number column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '4px' }}>
                <span
                  className="num-decor"
                  style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', color: 'rgba(124,92,246,0.08)' }}
                >
                  {step.step}
                </span>
                {/* Vertical connector */}
                {i < 2 && (
                  <div
                    style={{
                      width: '1px',
                      flex: 1,
                      background: 'linear-gradient(180deg, rgba(124,92,246,0.25) 0%, transparent 100%)',
                      marginTop: '8px',
                      marginLeft: '18px',
                      minHeight: '20px',
                    }}
                  />
                )}
              </div>

              {/* Content column */}
              <div style={{ paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(124,92,246,0.1)',
                      border: '1px solid rgba(124,92,246,0.2)',
                      color: 'var(--brand-light)',
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                  <h3
                    className="font-heading"
                    style={{ fontSize: '1.0625rem', color: 'var(--text)', margin: 0 }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.65',
                    color: 'var(--text-2)',
                    letterSpacing: '-0.01em',
                    maxWidth: '520px',
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
