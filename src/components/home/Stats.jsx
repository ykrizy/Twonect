import AnimatedNumber from '@/components/ui/AnimatedNumber'
import Reveal from '@/components/ui/Reveal'

const STATS = [
  {
    value: 500,
    suffix: '+',
    label: 'Especialistas Verificados',
    note: 'na plataforma',
    color: 'var(--brand-light)',
  },
  {
    value: 48,
    suffix: 'h',
    label: 'Tempo médio de match',
    note: 'garantido',
    color: '#34D399',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Projetos concluídos',
    note: 'com sucesso',
    color: '#67E8F9',
  },
  {
    value: 15,
    suffix: '%',
    label: 'Comissão',
    note: 'sem taxas escondidas',
    color: '#FCD34D',
  },
]

const CHECK_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function Stats() {
  return (
    <section
      className="py-20"
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <span style={{ display: 'block', width: '28px', height: '1px', background: 'var(--brand-light)', opacity: 0.6 }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-light)' }}>
              Twonect em números
            </span>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 70}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '20px 22px',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${s.color}30`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {/* Tick */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${s.color}12`,
                    color: s.color,
                    border: `1px solid ${s.color}20`,
                    flexShrink: 0,
                    marginTop: '3px',
                  }}
                >
                  {CHECK_ICON}
                </div>

                {/* Content */}
                <div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                      letterSpacing: '-0.05em',
                      lineHeight: 1,
                      color: 'var(--text)',
                      marginBottom: '6px',
                    }}
                  >
                    <AnimatedNumber end={s.value} suffix={s.suffix} />
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', margin: 0, letterSpacing: '-0.01em' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-3)', margin: '2px 0 0 0', letterSpacing: '-0.005em' }}>
                    {s.note}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
