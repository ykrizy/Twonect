import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useMeta from '@/hooks/useMeta'
import Reveal from '@/components/ui/Reveal'
import { registarEmpresa, registarEspecialista } from '@/lib/api/auth'

async function sendWelcomeEmail(email, nome, perfil) {
  try {
    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'welcome',
          record: { email, nome, perfil },
        }),
      }
    )
  } catch (err) {
    // Email failure is non-blocking — registo continua na mesma
    console.warn('Welcome email failed:', err)
  }
}

const AUTOMATION_TYPES = ['RPA', 'Integrações', 'IA / LLMs', 'Marketing Automation', 'BI & Data', 'Custom Dev', 'Outro']
const SPECIALIST_SKILLS = ['RPA (UiPath, AA)', 'Make / Zapier / n8n', 'Python Automation', 'IA Aplicada', 'Power BI', 'HubSpot / Marketing', 'Cloud & DevOps', 'Outro']
const COUNTRIES = ['Portugal', 'Espanha', 'Brasil', 'Outro']
const COMPANY_SIZES = ['1–10', '11–50', '51–200', '200+']
const EXPERIENCE_YEARS = ['< 1 ano', '1–3 anos', '3–5 anos', '5–10 anos', '10+ anos']

const IconBuilding = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/><path d="M12 12h.01"/>
    <path d="M8 11v5"/><path d="M16 11v5"/><path d="M12 11v5"/>
  </svg>
)

const IconCode = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
)

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconSuccess = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

function CheckboxGroup({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(opt => (
        <label key={opt} className="checkbox-item">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )
}

function EmpresaForm({ onSuccess }) {
  const [automationTypes, setAutomationTypes] = useState([])
  const [fields, setFields] = useState({ nome_empresa: '', nome_responsavel: '', email: '', password: '', telefone: '', pais: 'Portugal', tamanho: '1–10' })
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggle = (val) => setAutomationTypes(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    try {
      await registarEmpresa({ ...fields, tipos_automacao: automationTypes })
      // Enviar email de boas-vindas (não bloqueia o registo em caso de falha)
      await sendWelcomeEmail(fields.email, fields.nome_responsavel, 'empresa')
      onSuccess()
    } catch (err) {
      setErro(err.message || 'Erro ao criar conta. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Nome da empresa *</label>
          <input type="text" required className="form-input" placeholder="Empresa Lda." value={fields.nome_empresa} onChange={set('nome_empresa')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Nome do responsável *</label>
          <input type="text" required className="form-input" placeholder="João Silva" value={fields.nome_responsavel} onChange={set('nome_responsavel')} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Email profissional *</label>
          <input type="email" required className="form-input" placeholder="joao@empresa.pt" value={fields.email} onChange={set('email')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Telefone</label>
          <input type="tel" className="form-input" placeholder="+351 900 000 000" value={fields.telefone} onChange={set('telefone')} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Password *</label>
        <input type="password" required minLength={8} className="form-input" placeholder="Mínimo 8 caracteres" value={fields.password} onChange={set('password')} />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>País</label>
          <select className="form-input w-full" value={fields.pais} onChange={set('pais')}>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Nº de funcionários</label>
          <select className="form-input w-full" value={fields.tamanho} onChange={set('tamanho')}>
            {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-2)' }}>Que tipo de automação precisas?</label>
        <CheckboxGroup options={AUTOMATION_TYPES} selected={automationTypes} onToggle={toggle} />
      </div>
      {erro && (
        <p className="text-sm px-4 py-3 rounded-lg" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
          {erro}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-primary btn-primary-lg w-full justify-center" style={{ marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'A criar conta…' : 'Criar Conta Gratuita →'}
      </button>
      <p className="text-xs text-center" style={{ color: 'var(--text-2)' }}>
        Ao registares-te, aceitas os{' '}
        <Link to="#" style={{ color: 'var(--brand-light)', textDecoration: 'none' }}>Termos de Serviço</Link>
        {' '}e a{' '}
        <Link to="#" style={{ color: 'var(--brand-light)', textDecoration: 'none' }}>Política de Privacidade</Link>.
      </p>
    </form>
  )
}

function EspecialistaForm({ onSuccess }) {
  const [skills, setSkills] = useState([])
  const [fields, setFields] = useState({ nome: '', email: '', password: '', telefone: '', linkedin: '', portfolio: '', pais: 'Portugal', anos_experiencia: '1–3 anos' })
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggle = (val) => setSkills(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    try {
      await registarEspecialista({ ...fields, skills })
      // Enviar email de boas-vindas (não bloqueia o registo em caso de falha)
      await sendWelcomeEmail(fields.email, fields.nome, 'especialista')
      onSuccess()
    } catch (err) {
      setErro(err.message || 'Erro ao submeter candidatura. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Nome completo *</label>
          <input type="text" required className="form-input" placeholder="Ricardo Fernandes" value={fields.nome} onChange={set('nome')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Email *</label>
          <input type="email" required className="form-input" placeholder="ricardo@email.com" value={fields.email} onChange={set('email')} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Password *</label>
        <input type="password" required minLength={8} className="form-input" placeholder="Mínimo 8 caracteres" value={fields.password} onChange={set('password')} />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Telefone</label>
          <input type="tel" className="form-input" placeholder="+351 900 000 000" value={fields.telefone} onChange={set('telefone')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>LinkedIn</label>
          <input type="url" className="form-input" placeholder="linkedin.com/in/teu-perfil" value={fields.linkedin} onChange={set('linkedin')} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>País</label>
          <select className="form-input w-full" value={fields.pais} onChange={set('pais')}>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Anos de experiência</label>
          <select className="form-input w-full" value={fields.anos_experiencia} onChange={set('anos_experiencia')}>
            {EXPERIENCE_YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-2)' }}>Especialidades principais</label>
        <CheckboxGroup options={SPECIALIST_SKILLS} selected={skills} onToggle={toggle} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Portfolio / GitHub (opcional)</label>
        <input type="url" className="form-input" placeholder="github.com/teu-perfil" value={fields.portfolio} onChange={set('portfolio')} />
      </div>
      {erro && (
        <p className="text-sm px-4 py-3 rounded-lg" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
          {erro}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-primary btn-primary-lg w-full justify-center" style={{ marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'A submeter…' : 'Submeter Candidatura →'}
      </button>
      <p className="text-xs text-center" style={{ color: 'var(--text-2)' }}>
        Ao registares-te, aceitas os{' '}
        <Link to="#" style={{ color: 'var(--brand-light)', textDecoration: 'none' }}>Termos de Serviço</Link>
        {' '}e a{' '}
        <Link to="#" style={{ color: 'var(--brand-light)', textDecoration: 'none' }}>Política de Privacidade</Link>.
      </p>
    </form>
  )
}

function SuccessMessage({ type, onReset }) {
  const isEmpresa = type === 'empresa'
  return (
    <div className="text-center py-16">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.2)' }}
      >
        <IconSuccess />
      </div>
      <h2 className="font-display mb-4" style={{ fontSize: '1.75rem', color: 'var(--text)' }}>
        {isEmpresa ? 'Conta criada com sucesso!' : 'Candidatura submetida!'}
      </h2>
      <p className="text-lg mb-8" style={{ color: 'var(--text-2)' }}>
        {isEmpresa
          ? 'Bem-vindo à Twonect. Podes já publicar o teu primeiro projeto.'
          : 'Analisamos o teu perfil em 24 horas úteis e entramos em contacto.'}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {isEmpresa ? (
          <>
            <Link to="/para-empresas" className="btn-primary btn-primary-lg">Publicar primeiro projeto →</Link>
            <button onClick={onReset} className="btn-ghost" style={{ fontSize: '15px', padding: '14px 24px' }}>Voltar</button>
          </>
        ) : (
          <>
            <Link to="/para-especialistas" className="btn-primary btn-primary-lg">Explorar projetos →</Link>
            <button onClick={onReset} className="btn-ghost" style={{ fontSize: '15px', padding: '14px 24px' }}>Voltar</button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Registar() {
  useMeta({
    title: 'Começa hoje',
    description: 'Regista-te na Twonect como empresa ou especialista. Rápido, grátis e sem compromisso.',
  })

  const [selected, setSelected] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const reset = () => { setSelected(null); setSuccess(false) }

  return (
    <section
      className="min-h-screen pt-20 pb-24 relative"
      style={{ background: 'var(--bg)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,92,246,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12 pt-8">
            <h1 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text)' }}>
              Como preferes{' '}
              <span className="text-gradient">começar?</span>
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-2)' }}>
              Escolhe o teu caminho e começa em minutos.
            </p>
          </div>
        </Reveal>

        {success ? (
          <Reveal>
            <div
              className="max-w-2xl mx-auto rounded-2xl p-8"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <SuccessMessage type={selected} onReset={reset} />
            </div>
          </Reveal>
        ) : selected === null ? (
          <Reveal delay={100}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Empresa card */}
              <button
                onClick={() => setSelected('empresa')}
                className="card p-8 text-left transition-all"
                style={{ borderRadius: '16px', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(124,92,246,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(124,92,246,0.1)', color: 'var(--brand-light)', border: '1px solid rgba(124,92,246,0.2)' }}
                >
                  <IconBuilding />
                </div>
                <h2 className="font-heading text-xl mb-2" style={{ color: 'var(--text)' }}>Sou uma Empresa</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
                  Quero contratar especialistas para automatizar processos
                </p>
                <ul className="space-y-2 mb-6">
                  {['Grátis', 'Propostas em 48h', 'Escrow incluído'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                      <span style={{ color: 'var(--success-light)' }}><IconCheck /></span> {item}
                    </li>
                  ))}
                </ul>
                <span className="btn-primary" style={{ display: 'inline-flex' }}>
                  Registar como Empresa →
                </span>
              </button>

              {/* Especialista card */}
              <button
                onClick={() => setSelected('especialista')}
                className="text-left transition-all"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid rgba(124,92,246,0.3)',
                  borderRadius: '16px',
                  padding: '32px',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(124,92,246,0.08)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(124,92,246,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,92,246,0.3)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(124,92,246,0.08)' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(167,139,250,0.1)', color: '#C4B5FD', border: '1px solid rgba(167,139,250,0.2)' }}
                >
                  <IconCode />
                </div>
                <h2 className="font-heading text-xl mb-2" style={{ color: 'var(--text)' }}>Sou Especialista</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
                  Quero aceder a projetos de automação qualificados
                </p>
                <ul className="space-y-2 mb-6">
                  {['Perfil gratuito', 'Pagamento garantido', 'Verificação em 24h'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                      <span style={{ color: '#C4B5FD' }}><IconCheck /></span> {item}
                    </li>
                  ))}
                </ul>
                <span className="btn-outline" style={{ display: 'inline-flex' }}>
                  Criar Perfil de Especialista →
                </span>
              </button>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="max-w-2xl mx-auto">
              <button
                onClick={reset}
                className="flex items-center gap-2 mb-8 text-sm"
                style={{ color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Voltar à seleção
              </button>

              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${selected === 'empresa' ? 'rgba(124,92,246,0.3)' : 'rgba(167,139,250,0.3)'}`,
                }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: selected === 'empresa' ? 'rgba(124,92,246,0.1)' : 'rgba(167,139,250,0.1)',
                      color: selected === 'empresa' ? 'var(--brand-light)' : '#C4B5FD',
                      border: `1px solid ${selected === 'empresa' ? 'rgba(124,92,246,0.2)' : 'rgba(167,139,250,0.2)'}`,
                    }}
                  >
                    {selected === 'empresa' ? <IconBuilding /> : <IconCode />}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl" style={{ color: 'var(--text)' }}>
                      {selected === 'empresa' ? 'Registar como Empresa' : 'Criar Perfil de Especialista'}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                      {selected === 'empresa' ? 'Leva menos de 2 minutos' : 'Verificação em 24h úteis'}
                    </p>
                  </div>
                </div>

                {selected === 'empresa'
                  ? <EmpresaForm onSuccess={() => navigate('/publicar-projeto')} />
                  : <EspecialistaForm onSuccess={() => navigate('/onboarding-especialista')} />
                }
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
