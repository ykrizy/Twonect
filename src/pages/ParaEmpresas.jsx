import { useState } from 'react'
import { Link } from 'react-router-dom'
import useMeta from '@/hooks/useMeta'
import useSmartCTA from '@/hooks/useSmartCTA'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import CTABanner from '@/components/ui/CTABanner'
import Reveal from '@/components/ui/Reveal'

const PAINS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Demasiado tempo em tarefas repetitivas',
    desc: 'A tua equipa passa horas em processos que podiam estar automatizados.',
    color: '#fbbf24',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Contratar full-time é caro e lento',
    desc: 'Um especialista interno custa €40K+/ano. Um projeto de automação pode custar €2.000.',
    color: '#fbbf24',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: 'Difícil encontrar quem saiba o que preciso',
    desc: '"Automação" é vago. Não sabes se precisas de RPA, Make, Python ou IA.',
    color: '#fbbf24',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Medo de pagar e não receber',
    desc: 'Já pagaste a um freelancer e o resultado foi dececionante? Com Escrow isso não acontece.',
    color: '#f87171',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    title: 'Projetos sem gestão estruturada',
    desc: 'Email vai e vem, ficheiros perdem-se, prazos falham.',
    color: '#fbbf24',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Pouco acesso a talento especializado',
    desc: 'Portugal é pequeno. Os melhores especialistas podem estar em Espanha ou no Brasil.',
    color: '#22d3ee',
  },
]

const PERSONAS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    title: 'Retalho & E-commerce',
    desc: 'Automatiza inventário, fulfillment, email marketing e relatórios de vendas.',
    color: 'var(--brand-light)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Serviços Profissionais',
    desc: 'Automatiza faturação, CRM, onboarding de clientes e reporting.',
    color: '#34d399',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'Indústria & Logística',
    desc: 'Integra sistemas ERP/WMS, automatiza encomendas e rastreio de entregas.',
    color: '#fbbf24',
  },
]

const STEPS_3 = [
  {
    num: '1',
    title: 'Descreve o que precisas',
    sub: '2 min',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    num: '2',
    title: 'Recebe propostas',
    sub: '48h',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Começa o projeto',
    sub: 'Esta semana',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
]

function ROICalculator() {
  const { empresaTo } = useSmartCTA()
  const [hours, setHours] = useState(10)
  const [hourCost, setHourCost] = useState(25)

  const annualCost = hours * hourCost * 52
  const automationCost = Math.min(8000, Math.max(2000, Math.round((hours * hourCost * 1.8) / 500) * 500))
  const paybackMonths = Math.max(1, Math.ceil(automationCost / (annualCost / 12)))
  const firstYearSavings = Math.max(0, annualCost - automationCost)

  const fmt = (v) => `€${v.toLocaleString('pt-PT')}`

  const ROI_ITEMS = [
    {
      label: 'Custo anual do problema',
      value: fmt(annualCost),
      color: '#f87171',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
        </svg>
      ),
    },
    {
      label: 'Custo estimado de automação',
      value: fmt(automationCost),
      color: '#fbbf24',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
      ),
    },
    {
      label: 'Payback em',
      value: `${paybackMonths} meses`,
      color: '#22d3ee',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      label: 'Poupança no 1º ano',
      value: fmt(firstYearSavings),
      color: '#34d399',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
  ]

  return (
    <div
      className="rounded-2xl p-8"
      style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="grid md:grid-cols-2 gap-10">
        {/* Inputs */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-sm font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Horas semanais em tarefas manuais</label>
              <span className="text-sm font-bold" style={{ color: 'var(--brand-light)' }}>{hours}h</span>
            </div>
            <input type="range" min="1" max="40" value={hours} onChange={e => setHours(+e.target.value)} />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-3)' }}>
              <span>1h</span><span>40h</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <label className="text-sm font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Custo hora da tua equipa</label>
              <span className="text-sm font-bold" style={{ color: 'var(--brand-light)' }}>€{hourCost}</span>
            </div>
            <input type="range" min="10" max="100" value={hourCost} onChange={e => setHourCost(+e.target.value)} />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-3)' }}>
              <span>€10</span><span>€100</span>
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-3">
          {ROI_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl p-4"
              style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${item.color}18` }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-sm" style={{ color: 'var(--text-2)', letterSpacing: '-0.01em' }}>{item.label}</span>
              </div>
              <span className="font-bold text-sm" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>* Valores estimados com base em médias do mercado ibérico</p>
        <Link to={empresaTo} className="btn-primary btn-primary-lg">
          Automatizar agora
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </div>
  )
}

export default function ParaEmpresas() {
  const { empresaTo, primaryLabel } = useSmartCTA()
  useMeta({
    title: 'Para Empresas',
    description: 'Encontra especialistas em automação verificados para o teu negócio. Rápido, seguro e sem risco.',
  })

  return (
    <>
      <PageHero
        badge="Para Empresas"
        badgeVariant="badge-indigo"
        heading="Para de perder tempo em"
        highlight="processos manuais"
        sub="Conecta-te a especialistas em automação que transformam os teus processos em menos de uma semana. Sem risco, sem contrato de longo prazo."
        primaryCTA={{ label: 'Publicar Projeto Grátis', to: '/registar' }}
      />

      {/* Problemas */}
      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="Reconheces algum" highlight="destes problemas?" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAINS.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card p-6 h-full">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}22` }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', letterSpacing: '-0.01em' }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios alternados */}
      <section className="py-24" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="O que a Twonect" highlight="faz por ti" />

          {[
            {
              title: 'Especialistas verificados, sem surpresas',
              body: 'Cada especialista passa por uma avaliação técnica antes de entrar na plataforma. Vês o portfolio, as avaliações reais de projetos anteriores e o tempo médio de resposta.',
              visual: (
                <div
                  className="rounded-xl p-6"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff' }}>MS</div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>Miguel Santos</div>
                      <div className="text-xs" style={{ color: 'var(--text-2)' }}>RPA & Workflow Specialist</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                      <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>4.9</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="badge badge-emerald">Verificado</span>
                    <span className="badge badge-indigo">47 projetos</span>
                    <span className="badge badge-cyan">RPA</span>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-3)' }}>
                    <span>Tempo de resposta: &lt;2h</span>
                    <span>Taxa de sucesso: 100%</span>
                  </div>
                </div>
              ),
            },
            {
              title: 'Proposta em 48h, projeto em dias',
              body: 'Publica o projeto hoje. Amanhã já tens propostas de especialistas qualificados. Em média, os projetos começam dentro de 3 a 5 dias após publicação.',
              visual: (
                <div
                  className="rounded-xl p-6"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {[
                    { label: 'Projeto publicado', time: 'Hoje', done: true },
                    { label: 'Primeiras propostas', time: '+24h', done: true },
                    { label: 'Escolha do especialista', time: '+48h', done: false },
                    { label: 'Início do projeto', time: '+72h', done: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4 mb-3 last:mb-0">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: step.done ? '#10b981' : 'rgba(255,255,255,0.06)', border: step.done ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {step.done ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <span className="text-xs font-bold" style={{ color: 'var(--text-3)' }}>{i + 1}</span>
                        )}
                      </div>
                      <span className="text-sm flex-1" style={{ color: step.done ? '#e2e8f0' : '#475569', letterSpacing: '-0.01em' }}>{step.label}</span>
                      <span className="badge badge-emerald">{step.time}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: 'Pagamento 100% protegido',
              body: 'O dinheiro só sai quando tu approvas. O sistema Escrow da Twonect garante que nunca perdes o investimento — mesmo que o projeto não corra como esperado.',
              visual: (
                <div
                  className="rounded-xl p-6"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex flex-col gap-3">
                    {[
                      { step: '1', label: 'Empresa deposita', desc: 'Pagamento retido pela Twonect', color: 'var(--brand-light)' },
                      { step: '2', label: 'Trabalho em progresso', desc: 'Especialista executa o projeto', color: '#a78bfa' },
                      { step: '3', label: 'Aprovação da empresa', desc: 'Empresa revê e aprova', color: '#22d3ee' },
                      { step: '4', label: 'Pagamento libertado', desc: 'Especialista recebe automaticamente', color: '#34d399' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: s.color, color: '#fff' }}
                        >
                          {s.step}
                        </div>
                        <div>
                          <div className="text-xs font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>{s.label}</div>
                          <div className="text-xs" style={{ color: 'var(--text-2)' }}>{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
          ].map((block, i) => (
            <Reveal key={i} delay={100}>
              <div className={`grid md:grid-cols-2 gap-10 items-center mb-20 last:mb-0 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
                <div className={i % 2 === 1 ? 'md:[direction:ltr]' : ''}>
                  <h3 className="text-xl sm:text-2xl font-display mb-4" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>{block.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', letterSpacing: '-0.01em' }}>{block.body}</p>
                </div>
                <div className={i % 2 === 1 ? 'md:[direction:ltr]' : ''}>{block.visual}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Personas */}
      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="Feito para PMEs que querem" highlight="crescer sem contratar" />
          <div className="grid md:grid-cols-3 gap-5">
            {PERSONAS.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card p-7 text-center h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${p.color}12`, color: p.color, border: `1px solid ${p.color}20` }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', letterSpacing: '-0.01em' }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="Quanto podes poupar" highlight="com automação?" />
          <Reveal delay={100}>
            <ROICalculator />
          </Reveal>
        </div>
      </section>

      {/* 3 passos simples */}
      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader heading="Como publicar" highlight="um projeto" sub="Rápido, simples e sem compromisso." />
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {STEPS_3.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card p-7 text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(124,92,246,0.1)', color: 'var(--brand-light)', border: '1px solid rgba(124,92,246,0.2)' }}
                  >
                    {s.icon}
                  </div>
                  <div className="text-sm font-bold mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>{s.title}</div>
                  <div className="badge badge-emerald">{s.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <Link to={empresaTo} className="btn-primary btn-primary-lg">
              {primaryLabel}
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </Reveal>
        </div>
      </section>

      <CTABanner
        heading="Pronto para automatizar o teu negócio?"
        sub="Publica o teu projeto gratuitamente e recebe propostas de especialistas verificados em menos de 48 horas."
        secondaryLabel="Saber mais sobre como funciona"
        secondaryTo="/como-funciona"
      />
    </>
  )
}
