import { useState } from 'react'
import Reveal from '@/components/ui/Reveal'

const ICONS = {
  rpa: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  ),
  ai: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7H1a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
    </svg>
  ),
  integration: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  bi: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  marketing: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  custom: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
}

const TYPES = [
  {
    id: 'rpa',
    icon: ICONS.rpa,
    title: 'RPA & Workflow',
    desc: 'Automatiza tarefas repetitivas com RPA, Zapier, Make, UiPath. Reduz erros humanos e liberta a tua equipa para trabalho de valor.',
    tools: ['Zapier', 'Make', 'n8n', 'UiPath', 'Power Automate'],
    color: '#818cf8',
  },
  {
    id: 'ai',
    icon: ICONS.ai,
    title: 'IA & Machine Learning',
    desc: 'Implementa modelos de IA nos teus processos de negócio. Desde chatbots a análise preditiva e processamento de linguagem natural.',
    tools: ['OpenAI', 'Python', 'TensorFlow', 'LangChain', 'Hugging Face'],
    color: '#C4B5FD',
  },
  {
    id: 'integration',
    icon: ICONS.integration,
    title: 'Integração de Sistemas',
    desc: 'Conecta as tuas ferramentas: CRM, ERP, e-commerce, APIs. Elimina silos de dados e cria fluxos de informação contínuos.',
    tools: ['Salesforce', 'SAP', 'REST API', 'GraphQL', 'Webhooks'],
    color: '#67E8F9',
  },
  {
    id: 'bi',
    icon: ICONS.bi,
    title: 'Business Intelligence',
    desc: 'Automatiza relatórios, dashboards e fluxos de dados. Toma decisões baseadas em dados atualizados em tempo real.',
    tools: ['Power BI', 'Tableau', 'dbt', 'Looker', 'BigQuery'],
    color: '#34D399',
  },
  {
    id: 'marketing',
    icon: ICONS.marketing,
    title: 'Marketing Automation',
    desc: 'Sequências de email, lead scoring, CRM automation. Aumenta a conversão sem aumentar a equipa de marketing.',
    tools: ['HubSpot', 'Mailchimp', 'ActiveCampaign', 'Klaviyo', 'Brevo'],
    color: '#FCD34D',
  },
  {
    id: 'custom',
    icon: ICONS.custom,
    title: 'Automação Custom',
    desc: 'Soluções à medida para os teus processos únicos. Quando as ferramentas standard não chegam, os nossos especialistas criam do zero.',
    tools: ['Node.js', 'Python', 'SQL', 'Docker', 'AWS Lambda'],
    color: '#F9A8D4',
  },
]

export default function AutomationTypes() {
  const [activeId, setActiveId] = useState('rpa')
  const active = TYPES.find(t => t.id === activeId)

  return (
    <section
      className="py-24"
      style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal>
          <div className="mb-12">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ display: 'block', width: '28px', height: '1px', background: 'var(--brand-light)', opacity: 0.6 }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-light)' }}>
                Tipos de automação
              </span>
            </div>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: 'var(--text)' }}
            >
              Todos os tipos de automação,{' '}
              <span style={{ color: 'var(--brand-light)' }}>num só lugar</span>
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1.0625rem', letterSpacing: '-0.01em', marginTop: '12px', maxWidth: '480px' }}>
              Seja qual for o processo que queres otimizar, temos o especialista certo.
            </p>
          </div>
        </Reveal>

        {/* Two-panel layout */}
        <div className="grid lg:grid-cols-5 gap-3 lg:gap-6">

          {/* Left: category list */}
          <div className="lg:col-span-2 flex flex-col gap-1">
            {TYPES.map((t, i) => (
              <Reveal key={t.id} delay={i * 50}>
                <button
                  onClick={() => setActiveId(t.id)}
                  className="type-row w-full text-left"
                  style={{
                    background: activeId === t.id ? 'rgba(124,92,246,0.08)' : 'transparent',
                    borderColor: activeId === t.id ? 'rgba(124,92,246,0.25)' : 'transparent',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: activeId === t.id ? `${t.color}18` : 'rgba(255,255,255,0.04)',
                      color: activeId === t.id ? t.color : 'var(--text-3)',
                      border: `1px solid ${activeId === t.id ? `${t.color}25` : 'rgba(255,255,255,0.07)'}`,
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    {t.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: activeId === t.id ? 'var(--text)' : 'var(--text-2)',
                        letterSpacing: '-0.01em',
                        transition: 'color 0.2s',
                        margin: 0,
                      }}
                    >
                      {t.title}
                    </p>
                  </div>
                  {activeId === t.id && (
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: 'var(--brand-light)', flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </button>
              </Reveal>
            ))}
          </div>

          {/* Right: detail panel */}
          <Reveal delay={100}>
            <div
              className="lg:col-span-3"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-2)',
                borderRadius: 'var(--r-xl)',
                padding: '36px',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {active && (
                <>
                  <div>
                    {/* Icon + title */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `${active.color}15`,
                          color: active.color,
                          border: `1px solid ${active.color}25`,
                          flexShrink: 0,
                        }}
                      >
                        {active.icon}
                      </div>
                      <div>
                        <h3
                          className="font-display"
                          style={{ fontSize: '1.375rem', color: 'var(--text)', margin: '0 0 6px 0', letterSpacing: '-0.03em' }}
                        >
                          {active.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            lineHeight: '1.65',
                            color: 'var(--text-2)',
                            letterSpacing: '-0.01em',
                            margin: 0,
                          }}
                        >
                          {active.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tools */}
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '12px' }}>
                      Ferramentas & Tecnologias
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {active.tools.map((tool, j) => (
                        <span
                          key={j}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: `${active.color}10`,
                            color: active.color,
                            border: `1px solid ${active.color}20`,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
