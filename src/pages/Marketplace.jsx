import { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import useMeta from '@/hooks/useMeta'
import useSmartCTA from '@/hooks/useSmartCTA'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import CTABanner from '@/components/ui/CTABanner'
import Reveal from '@/components/ui/Reveal'
import CandidatarModal from '@/components/ui/CandidatarModal'
import { listarEspecialistas } from '@/lib/api/especialistas'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

// ─── Mock data ───────────────────────────────────────────────────────────────

const SPECIALISTS = [
  {
    id: 1,
    name: 'Ana Costa',
    title: 'Engenheira de Software Sénior',
    location: 'Lisboa',
    rate: '€85/h',
    rating: 4.9,
    reviews: 47,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    available: true,
    avatar: 'AC',
    avatarColor: '#6366f1',
    verified: true,
    projects: 23,
    bio: 'Especialista em arquitecturas escaláveis e aplicações web de alta performance.',
  },
  {
    id: 2,
    name: 'Miguel Ferreira',
    title: 'Designer de Produto',
    location: 'Porto',
    rate: '€70/h',
    rating: 4.8,
    reviews: 31,
    skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping'],
    available: true,
    avatar: 'MF',
    avatarColor: '#7c3aed',
    verified: true,
    projects: 18,
    bio: 'Foco em design centrado no utilizador e sistemas de design coerentes.',
  },
  {
    id: 3,
    name: 'Sara Lopes',
    title: 'Data Scientist',
    location: 'Remoto',
    rate: '€90/h',
    rating: 5.0,
    reviews: 19,
    skills: ['Python', 'Machine Learning', 'SQL', 'Power BI'],
    available: false,
    avatar: 'SL',
    avatarColor: '#0891b2',
    verified: true,
    projects: 14,
    bio: 'Transformo dados complexos em insights accionáveis para decisões estratégicas.',
  },
  {
    id: 4,
    name: 'João Rodrigues',
    title: 'DevOps Engineer',
    location: 'Braga',
    rate: '€80/h',
    rating: 4.7,
    reviews: 38,
    skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
    available: true,
    avatar: 'JR',
    avatarColor: '#059669',
    verified: false,
    projects: 29,
    bio: 'Automação de infraestrutura e pipelines de entrega contínua para equipas ágeis.',
  },
  {
    id: 5,
    name: 'Catarina Silva',
    title: 'Marketing Digital & Growth',
    location: 'Lisboa',
    rate: '€65/h',
    rating: 4.9,
    reviews: 54,
    skills: ['SEO', 'Google Ads', 'Analytics', 'Content Strategy'],
    available: true,
    avatar: 'CS',
    avatarColor: '#d97706',
    verified: true,
    projects: 41,
    bio: 'Estratégias de crescimento orientadas por dados com ROI comprovado.',
  },
  {
    id: 6,
    name: 'Pedro Alves',
    title: 'CFO Fractional',
    location: 'Porto',
    rate: '€120/h',
    rating: 4.8,
    reviews: 22,
    skills: ['Financiamento', 'M&A', 'Modelação Financeira', 'Fundraising'],
    available: true,
    avatar: 'PA',
    avatarColor: '#dc2626',
    verified: true,
    projects: 11,
    bio: 'Apoio financeiro estratégico para startups em fase de crescimento e scale-up.',
  },
]

const PROJECTS = [
  {
    id: 1,
    company: 'TechFlow Lda',
    logo: 'TF',
    logoColor: '#6366f1',
    title: 'Desenvolvimento de plataforma SaaS B2B',
    category: 'Desenvolvimento',
    budget: '€15.000 – €25.000',
    duration: '3 meses',
    urgency: 'Alta',
    urgencyColor: '#f87171',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    posted: '2 dias atrás',
    description: 'Procuramos um engenheiro sénior para construir o MVP da nossa plataforma de gestão de projectos para PME.',
    proposals: 4,
  },
  {
    id: 2,
    company: 'GreenRetail SA',
    logo: 'GR',
    logoColor: '#059669',
    title: 'Auditoria e estratégia de dados',
    category: 'Data & Analytics',
    budget: '€8.000 – €12.000',
    duration: '6 semanas',
    urgency: 'Média',
    urgencyColor: '#fbbf24',
    skills: ['Python', 'SQL', 'Power BI'],
    posted: '5 dias atrás',
    description: 'Necessitamos de um data scientist para auditar os nossos processos de dados e criar dashboards executivos.',
    proposals: 7,
  },
  {
    id: 3,
    company: 'FinanceUp',
    logo: 'FU',
    logoColor: '#7c3aed',
    title: 'Redesign completo da app mobile',
    category: 'Design',
    budget: '€10.000 – €18.000',
    duration: '2 meses',
    urgency: 'Alta',
    urgencyColor: '#f87171',
    skills: ['Figma', 'UX Research', 'Prototyping'],
    posted: '1 dia atrás',
    description: 'A nossa app de finanças pessoais precisa de um redesign completo focado em usabilidade e conversão.',
    proposals: 9,
  },
  {
    id: 4,
    company: 'LogisTech',
    logo: 'LT',
    logoColor: '#0891b2',
    title: 'Infraestrutura cloud e migração',
    category: 'DevOps',
    budget: '€20.000 – €35.000',
    duration: '4 meses',
    urgency: 'Baixa',
    urgencyColor: '#34d399',
    skills: ['AWS', 'Kubernetes', 'Terraform'],
    posted: '1 semana atrás',
    description: 'Migração de infraestrutura on-premise para AWS com arquitectura de microserviços e alta disponibilidade.',
    proposals: 3,
  },
  {
    id: 5,
    company: 'BeautyBrand',
    logo: 'BB',
    logoColor: '#d97706',
    title: 'Campanha de growth marketing',
    category: 'Marketing',
    budget: '€5.000 – €9.000',
    duration: '2 meses',
    urgency: 'Média',
    urgencyColor: '#fbbf24',
    skills: ['Google Ads', 'Meta Ads', 'Analytics'],
    posted: '3 dias atrás',
    description: 'Lançamento de nova linha de produtos. Procuramos especialista em paid media e growth para maximizar o alcance.',
    proposals: 12,
  },
  {
    id: 6,
    company: 'Startup X',
    logo: 'SX',
    logoColor: '#dc2626',
    title: 'CFO Fractional — Série A',
    category: 'Finanças',
    budget: '€3.000/mês',
    duration: 'Contínuo',
    urgency: 'Alta',
    urgencyColor: '#f87171',
    skills: ['Fundraising', 'M&A', 'Modelação Financeira'],
    posted: '4 dias atrás',
    description: 'Startup em fase pré-Série A procura CFO fractional para preparar due diligence e materiais para investidores.',
    proposals: 5,
  },
]

const CATEGORIES_SPECIALISTS = ['Todos', 'Desenvolvimento', 'Design', 'Data & Analytics', 'DevOps', 'Marketing', 'Finanças']
const CATEGORIES_PROJECTS = ['Todos', 'Desenvolvimento', 'Design', 'Data & Analytics', 'DevOps', 'Marketing', 'Finanças']
const CATEGORIES_SERVICES = ['Todos', 'RPA', 'IA & LLMs', 'Integrações', 'BI & Data', 'Marketing Automation', 'No-Code', 'Custom Dev']

const SERVICES_MOCK = [
  {
    id: 1,
    titulo: 'Automação WhatsApp Business com IA',
    categoria: 'IA & LLMs',
    specialist: { name: 'Ana Costa', avatar: 'AC', avatarColor: '#6366f1' },
    preco_base: 800,
    entrega_dias: 10,
    rating: 4.9,
    reviews: 23,
    ferramentas: ['ChatGPT', 'Make', 'WhatsApp API'],
    imagem_url: null,
  },
  {
    id: 2,
    titulo: 'Integração CRM Salesforce + ERP SAP',
    categoria: 'Integrações',
    specialist: { name: 'Miguel Ferreira', avatar: 'MF', avatarColor: '#7c3aed' },
    preco_base: 2500,
    entrega_dias: 21,
    rating: 4.8,
    reviews: 11,
    ferramentas: ['Salesforce', 'SAP', 'REST APIs'],
    imagem_url: null,
  },
  {
    id: 3,
    titulo: 'Dashboard Power BI para E-commerce',
    categoria: 'BI & Data',
    specialist: { name: 'Sara Lopes', avatar: 'SL', avatarColor: '#0891b2' },
    preco_base: 1200,
    entrega_dias: 14,
    rating: 5.0,
    reviews: 18,
    ferramentas: ['Power BI', 'SQL', 'dbt'],
    imagem_url: null,
  },
  {
    id: 4,
    titulo: 'Agente IA para Apoio ao Cliente 24/7',
    categoria: 'IA & LLMs',
    specialist: { name: 'João Rodrigues', avatar: 'JR', avatarColor: '#059669' },
    preco_base: 3000,
    entrega_dias: 30,
    rating: 4.7,
    reviews: 9,
    ferramentas: ['LangChain', 'OpenAI', 'n8n'],
    imagem_url: null,
  },
  {
    id: 5,
    titulo: 'Automação de Marketing com HubSpot',
    categoria: 'Marketing Automation',
    specialist: { name: 'Catarina Silva', avatar: 'CS', avatarColor: '#d97706' },
    preco_base: 900,
    entrega_dias: 12,
    rating: 4.9,
    reviews: 34,
    ferramentas: ['HubSpot', 'Zapier', 'Google Analytics'],
    imagem_url: null,
  },
  {
    id: 6,
    titulo: 'RPA com UiPath para Processamento Documental',
    categoria: 'RPA',
    specialist: { name: 'Pedro Alves', avatar: 'PA', avatarColor: '#dc2626' },
    preco_base: 4500,
    entrega_dias: 45,
    rating: 4.8,
    reviews: 7,
    ferramentas: ['UiPath', 'Python', 'OCR'],
    imagem_url: null,
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <span style={{ color: '#fbbf24', fontSize: '12px' }}>
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? '½' : ''}
    </span>
  )
}

function SpecialistCard({ s, ctaTo = '/registar' }) {
  return (
    <div
      className="card p-6 flex flex-col gap-4"
      style={{ cursor: 'pointer' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl font-bold text-sm flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              background: `${s.avatarColor}22`,
              color: s.avatarColor,
              border: `1px solid ${s.avatarColor}44`,
            }}
          >
            {s.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: '#e2e8f0' }}>{s.name}</span>
              {s.verified && (
                <span title="Verificado" style={{ color: '#6366f1', fontSize: '13px' }}>✓</span>
              )}
            </div>
            <div className="text-xs" style={{ color: '#64748b' }}>{s.title}</div>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
          style={{
            background: s.available ? 'rgba(52,211,153,0.12)' : 'rgba(100,116,139,0.12)',
            color: s.available ? '#34d399' : '#64748b',
          }}
        >
          {s.available ? 'Disponível' : 'Ocupado'}
        </span>
      </div>

      {/* Bio */}
      <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{s.bio}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {s.skills.map(skill => (
          <span key={skill} className="badge badge-indigo" style={{ fontSize: '11px' }}>{skill}</span>
        ))}
      </div>

      {/* Stats */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-1">
          <StarRating rating={s.rating} />
          <span className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{s.rating}</span>
          <span className="text-xs" style={{ color: '#475569' }}>({s.reviews})</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: '#64748b' }}>{s.projects} proj.</span>
          <span className="text-xs" style={{ color: '#64748b' }}>📍 {s.location}</span>
        </div>
      </div>

      {/* Rate + CTA */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-gradient">{s.rate}</span>
        <Link to={ctaTo} className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
          Ver Perfil
        </Link>
      </div>
    </div>
  )
}

function ProjectCard({ p, ctaTo = '/registar', onCandidatar = null, jaCandidatou = false }) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl font-bold text-sm flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              background: `${p.logoColor}22`,
              color: p.logoColor,
              border: `1px solid ${p.logoColor}44`,
            }}
          >
            {p.logo}
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: '#e2e8f0' }}>{p.company}</div>
            <div className="text-xs" style={{ color: '#64748b' }}>{p.posted}</div>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
          style={{
            background: `${p.urgencyColor}18`,
            color: p.urgencyColor,
          }}
        >
          {p.urgency}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <div className="font-bold text-sm mb-1" style={{ color: '#e2e8f0', lineHeight: 1.4 }}>{p.title}</div>
        <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{p.description}</p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {p.skills.map(skill => (
          <span key={skill} className="badge badge-indigo" style={{ fontSize: '11px' }}>{skill}</span>
        ))}
      </div>

      {/* Meta */}
      <div
        className="grid grid-cols-3 gap-2 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <div className="text-xs" style={{ color: '#475569' }}>Orçamento</div>
          <div className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{p.budget}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#475569' }}>Duração</div>
          <div className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{p.duration}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#475569' }}>Propostas</div>
          <div className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{p.proposals}</div>
        </div>
      </div>

      {/* Category + CTA */}
      <div className="flex items-center justify-between">
        <span className="badge badge-violet" style={{ fontSize: '11px' }}>{p.category}</span>
        {jaCandidatou ? (
          <span
            style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 600 }}
          >
            ✅ Candidatado
          </span>
        ) : onCandidatar ? (
          <button
            onClick={() => onCandidatar(p)}
            className="btn-primary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            Candidatar
          </button>
        ) : (
          <Link to={ctaTo} className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
            Candidatar
          </Link>
        )}
      </div>
    </div>
  )
}

function ServiceCard({ s }) {
  return (
    <div className="card flex flex-col overflow-hidden" style={{ cursor: 'pointer' }}>
      {/* Cover */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          height: 130,
          background: s.imagem_url
            ? `url(${s.imagem_url}) center/cover`
            : 'linear-gradient(135deg, rgba(124,92,246,0.15), rgba(167,139,250,0.07))',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {!s.imagem_url && <span style={{ fontSize: 36 }}>⚡</span>}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category */}
        <span className="badge badge-indigo self-start">{s.categoria}</span>

        {/* Title */}
        <h3 className="font-heading text-sm leading-snug" style={{ color: '#e2e8f0' }}>
          {s.titulo}
        </h3>

        {/* Specialist */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
            style={{
              width: 28, height: 28,
              background: `${s.specialist.avatarColor}22`,
              color: s.specialist.avatarColor,
              border: `1px solid ${s.specialist.avatarColor}44`,
            }}
          >
            {s.specialist.avatar}
          </div>
          <span className="text-xs" style={{ color: '#64748b' }}>{s.specialist.name}</span>
          {s.rating > 0 && (
            <span className="ml-auto text-xs flex items-center gap-1" style={{ color: '#fbbf24' }}>
              ★ {s.rating} <span style={{ color: '#475569' }}>({s.reviews})</span>
            </span>
          )}
        </div>

        {/* Tools */}
        {s.ferramentas && s.ferramentas.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {s.ferramentas.slice(0, 3).map(f => (
              <span key={f} className="badge badge-neutral" style={{ fontSize: '10px' }}>{f}</span>
            ))}
            {s.ferramentas.length > 3 && (
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>+{s.ferramentas.length - 3}</span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <div className="text-xs" style={{ color: '#475569' }}>A partir de</div>
            <div className="text-sm font-bold" style={{ color: 'var(--brand-light)' }}>
              €{(s.preco_base || 0).toLocaleString('pt-PT')}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
            <span>⏱ {s.entrega_dias} dias</span>
          </div>
          <Link to="/registar" className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
            Ver Packages
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Marketplace() {
  const { empresaTo, especialistaTo } = useSmartCTA()
  const { user, perfil } = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  useMeta({
    title: 'Marketplace — Twonect',
    description: 'Encontra especialistas verificados ou publica o teu projecto. O marketplace da Twonect liga empresas e talentos independentes em Portugal.',
  })

  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab')
    if (tab === 'projetos') return 'projectos'
    if (tab === 'servicos') return 'servicos'
    return 'especialistas'
  })
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [specialists, setSpecialists] = useState(SPECIALISTS)
  const [projects, setProjects] = useState(PROJECTS)
  const [services, setServices] = useState(SERVICES_MOCK)
  const [modalProjeto, setModalProjeto] = useState(null)
  const [candidaturaSucesso, setCandidaturaSucesso] = useState(false)
  const [projetosComCandidatura, setProjetosComCandidatura] = useState(new Set())

  // Carregar especialistas reais
  useEffect(() => {
    listarEspecialistas()
      .then(data => {
        if (!data || data.length === 0) return
        const mapped = data.map(s => ({
          id: s.id,
          name: s.nome,
          title: s.bio || s.skills?.join(' · ') || '',
          location: s.pais || 'Portugal',
          rate: s.preco_hora ? `€${s.preco_hora}/h` : 'A definir',
          rating: s.rating || 0,
          reviews: s.num_avaliacoes || 0,
          skills: s.skills || [],
          available: s.disponivel_agora ?? true,
          avatar: s.nome?.split(' ').map(w => w[0]).slice(0, 2).join('') || '??',
          avatarColor: '#6366f1',
          verified: s.verificado,
          projects: 0,
          bio: s.bio || '',
        }))
        setSpecialists(mapped)
      })
      .catch(() => {})
  }, [])

  // Carregar projetos reais do Supabase
  useEffect(() => {
    supabase
      .from('projetos')
      .select('*, empresas(nome)')
      .eq('estado', 'aberto')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const PRAZO_MAP = { urgent: 'Urgente', short: '1–2 semanas', normal: '1 mês', flexible: 'Flexível' }
        const mapped = data.map(p => ({
          id: p.id,
          title: p.titulo,
          company: p.empresas?.nome || 'Empresa',
          description: p.descricao,
          skills: p.tipo_automacao ? [p.tipo_automacao] : [],
          budget: p.orcamento ? `€${Number(p.orcamento).toLocaleString('pt-PT')}` : 'A definir',
          duration: PRAZO_MAP[p.prazo] || p.prazo,
          category: p.tipo_automacao || 'Outro',
          urgency: p.prazo === 'urgent' ? '🔥 Urgente' : 'Normal',
          urgencyColor: p.prazo === 'urgent' ? '#f59e0b' : '#6366f1',
          logo: p.empresas?.nome?.charAt(0) || '?',
          logoColor: '#7c5cf6',
          posted: new Date(p.created_at).toLocaleDateString('pt-PT'),
          proposals: 0,
        }))
        setProjects(mapped)
      })
      .catch(() => {})
  }, [])

  // Carregar serviços reais do Supabase
  useEffect(() => {
    supabase
      .from('servicos')
      .select('*, especialistas(nome, foto_url)')
      .eq('estado', 'publicado')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const mapped = data.map(s => ({
          id: s.id,
          titulo: s.titulo,
          categoria: s.categoria,
          specialist: {
            name: s.especialistas?.nome || 'Especialista',
            avatar: (s.especialistas?.nome || 'ES').split(' ').map(w => w[0]).slice(0, 2).join(''),
            avatarColor: '#7c5cf6',
            foto_url: s.especialistas?.foto_url || null,
          },
          preco_base: s.preco_base || 0,
          entrega_dias: s.packages?.[0]?.entrega_dias || 0,
          rating: 0,
          reviews: 0,
          ferramentas: s.ferramentas || [],
          imagem_url: s.imagem_url || null,
        }))
        setServices(mapped)
      })
      .catch(() => {})
  }, [])

  // Carregar candidaturas já feitas pelo especialista — re-executa sempre que navegar para esta página
  useEffect(() => {
    if (!user) return
    supabase
      .from('especialistas')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(async ({ data: esp }) => {
        if (!esp) { setProjetosComCandidatura(new Set()); return }
        const { data } = await supabase
          .from('propostas')
          .select('projeto_id')
          .eq('especialista_id', esp.id)
        setProjetosComCandidatura(new Set((data ?? []).map(p => p.projeto_id)))
      })
      .catch(() => {})
  }, [user, location.key])

  const categories = activeTab === 'especialistas'
    ? CATEGORIES_SPECIALISTS
    : activeTab === 'servicos'
    ? CATEGORIES_SERVICES
    : CATEGORIES_PROJECTS

  const filteredServices = services.filter(s => {
    const matchesSearch = search === '' ||
      s.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (s.specialist?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.ferramentas || []).some(f => f.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = activeCategory === 'Todos' || s.categoria === activeCategory
    return matchesSearch && matchesCategory
  })

  const filteredSpecialists = specialists.filter(s => {
    const matchesSearch = search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = activeCategory === 'Todos' ||
      s.skills.some(sk => activeCategory.includes(sk)) ||
      s.title.toLowerCase().includes(activeCategory.toLowerCase())
    const matchesAvailable = !availableOnly || s.available
    return matchesSearch && matchesCategory && matchesAvailable
  })

  const filteredProjects = projects.filter(p => {
    const matchesSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveCategory('Todos')
    setSearch('')
    setAvailableOnly(false)
  }

  return (
    <>
      <PageHero
        badge="Marketplace"
        badgeVariant="badge-indigo"
        heading="O talento certo para"
        highlight="cada projecto"
        sub="Explora centenas de especialistas verificados ou descobre projectos que precisam das tuas competências. Tudo num só lugar."
        primaryCTA={
          perfil === 'especialista'
            ? { label: 'Explorar Projetos', onClick: () => document.getElementById('projetos-section')?.scrollIntoView({ behavior: 'smooth' }) }
            : perfil === 'empresa'
            ? { label: 'Publicar Projecto', to: empresaTo }
            : { label: 'Publicar Projecto', to: '/registar' }
        }
        secondaryCTA={
          perfil === 'especialista' || perfil === 'empresa'
            ? { label: 'Ir para o Dashboard', to: '/dashboard' }
            : { label: 'Criar Perfil', to: '/registar' }
        }
      />

      {/* ── Tab switcher + filters ── */}
      <section id="projetos-section" className="py-8 sticky top-16 z-30" style={{
        background: 'rgba(8,11,18,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Mode tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <div
              className="flex rounded-xl p-1 gap-1 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {[
                { key: 'especialistas', label: '👤 Especialistas' },
                { key: 'projectos', label: '💼 Projectos' },
                { key: 'servicos', label: '⚡ Serviços' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className="font-semibold rounded-lg transition-all duration-200"
                  style={{
                    padding: '8px 20px',
                    fontSize: '13px',
                    background: activeTab === tab.key
                      ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                      : 'transparent',
                    color: activeTab === tab.key ? '#fff' : '#64748b',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width="15" height="15" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={
                  activeTab === 'especialistas' ? 'Pesquisar especialistas ou skills…'
                  : activeTab === 'servicos' ? 'Pesquisar serviços ou ferramentas…'
                  : 'Pesquisar projectos ou empresas…'
                }
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  paddingTop: '9px',
                  paddingBottom: '9px',
                  fontSize: '13px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  color: '#e2e8f0',
                  outline: 'none',
                }}
              />
            </div>

            {/* CTA for services tab */}
            {activeTab === 'servicos' && perfil === 'especialista' && (
              <Link to="/criar-servico" className="btn-primary flex-shrink-0" style={{ fontSize: '13px', padding: '8px 18px' }}>
                + Criar Serviço
              </Link>
            )}

            {/* Available toggle (specialists only) */}
            {activeTab === 'especialistas' && (
              <button
                onClick={() => setAvailableOnly(!availableOnly)}
                className="flex items-center gap-2 rounded-lg transition-all"
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  background: availableOnly ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${availableOnly ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: availableOnly ? '#34d399' : '#64748b',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: availableOnly ? '#34d399' : '#475569',
                  display: 'inline-block',
                }} />
                Disponíveis
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full font-medium transition-all duration-200 flex-shrink-0"
                style={{
                  padding: '5px 14px',
                  fontSize: '12px',
                  background: activeCategory === cat
                    ? 'rgba(99,102,241,0.18)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeCategory === cat ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  color: activeCategory === cat ? '#818cf8' : '#64748b',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results grid ── */}
      <section className="py-16" style={{ background: '#080b12', minHeight: '60vh' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Result count */}
          <div className="mb-8 flex items-center justify-between">
            <span className="text-sm" style={{ color: '#475569' }}>
              {activeTab === 'especialistas'
                ? `${filteredSpecialists.length} especialista${filteredSpecialists.length !== 1 ? 's' : ''} encontrado${filteredSpecialists.length !== 1 ? 's' : ''}`
                : activeTab === 'servicos'
                ? `${filteredServices.length} serviço${filteredServices.length !== 1 ? 's' : ''} encontrado${filteredServices.length !== 1 ? 's' : ''}`
                : `${filteredProjects.length} projecto${filteredProjects.length !== 1 ? 's' : ''} encontrado${filteredProjects.length !== 1 ? 's' : ''}`}
            </span>
            {activeTab === 'projectos' && (
              <Link to={empresaTo} className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                + Publicar Projecto
              </Link>
            )}
            {activeTab === 'especialistas' && (
              <Link to={especialistaTo} className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                + Criar Perfil
              </Link>
            )}
            {activeTab === 'servicos' && (
              <Link to={perfil === 'especialista' ? '/criar-servico' : '/registar'} className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                + Publicar Serviço
              </Link>
            )}
          </div>

          {/* Grid */}
          {activeTab === 'especialistas' ? (
            filteredSpecialists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSpecialists.map((s, i) => (
                  <Reveal key={s.id} delay={i * 60}>
                    <SpecialistCard s={s} ctaTo={empresaTo} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState tab="especialistas" onReset={() => { setSearch(''); setActiveCategory('Todos'); setAvailableOnly(false) }} />
            )
          ) : activeTab === 'servicos' ? (
            filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map((s, i) => (
                  <Reveal key={s.id} delay={i * 60}>
                    <ServiceCard s={s} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState tab="servicos" onReset={() => { setSearch(''); setActiveCategory('Todos') }} />
            )
          ) : (
            filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((p, i) => (
                  <Reveal key={p.id} delay={i * 60}>
                    <ProjectCard
                      p={p}
                      ctaTo={especialistaTo}
                      onCandidatar={perfil === 'especialista' ? setModalProjeto : null}
                      jaCandidatou={projetosComCandidatura.has(p.id)}
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState tab="projectos" onReset={() => { setSearch(''); setActiveCategory('Todos') }} />
            )
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24" style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="COMO FUNCIONA"
              heading="Simples, rápido e"
              highlight="seguro"
              sub="Do primeiro contacto ao pagamento, a Twonect acompanha-te em cada passo."
              center
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            {/* For companies */}
            <Reveal delay={0}>
              <div className="card p-8">
                <div className="mb-6">
                  <span className="badge badge-indigo mb-4 inline-block">Para Empresas</span>
                  <h3 className="text-xl font-extrabold mb-2" style={{ color: '#e2e8f0' }}>
                    Publica e contrata
                  </h3>
                  <p className="text-sm" style={{ color: '#475569' }}>
                    Descreve o teu projecto e recebe propostas de especialistas verificados em 48h.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { step: '01', text: 'Publica o projecto com orçamento e requisitos' },
                    { step: '02', text: 'Recebe propostas de especialistas qualificados' },
                    { step: '03', text: 'Entrevista e selecciona com apoio do Synk Matching' },
                    { step: '04', text: 'Paga com segurança via escrow integrado' },
                  ].map(item => (
                    <div key={item.step} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: 'rgba(99,102,241,0.15)',
                          color: '#818cf8',
                          border: '1px solid rgba(99,102,241,0.25)',
                        }}
                      >
                        {item.step}
                      </span>
                      <span className="text-sm pt-0.5" style={{ color: '#94a3b8' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link to={empresaTo} className="btn-primary mt-6 inline-flex">
                  Publicar Projecto
                </Link>
              </div>
            </Reveal>

            {/* For specialists */}
            <Reveal delay={120}>
              <div className="card p-8">
                <div className="mb-6">
                  <span className="badge badge-violet mb-4 inline-block">Para Especialistas</span>
                  <h3 className="text-xl font-extrabold mb-2" style={{ color: '#e2e8f0' }}>
                    Mostra o teu portefólio
                  </h3>
                  <p className="text-sm" style={{ color: '#475569' }}>
                    Cria o teu perfil verificado e aparece nos resultados de empresas que procuram as tuas skills.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { step: '01', text: 'Cria o teu perfil com portefólio e experiência' },
                    { step: '02', text: 'Passa pela verificação de competências Twonect' },
                    { step: '03', text: 'Recebe convites e candidata-te a projectos' },
                    { step: '04', text: 'Recebe pagamentos protegidos e avaliações' },
                  ].map(item => (
                    <div key={item.step} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: 'rgba(124,58,237,0.15)',
                          color: '#a78bfa',
                          border: '1px solid rgba(124,58,237,0.25)',
                        }}
                      >
                        {item.step}
                      </span>
                      <span className="text-sm pt-0.5" style={{ color: '#94a3b8' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link to={especialistaTo} className="btn-outline mt-6 inline-flex">
                  Criar Perfil
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Trust stats ── */}
      <section className="py-16" style={{ background: '#080b12', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Especialistas verificados' },
              { value: '1.200+', label: 'Projectos publicados' },
              { value: '4.9★', label: 'Avaliação média' },
              { value: '48h', label: 'Tempo médio de match' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="card-no-hover p-6 text-center">
                  <div className="text-3xl font-extrabold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm" style={{ color: '#475569' }}>{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading={perfil === 'especialista' ? 'Encontra o teu próximo projeto' : 'Pronto para começar?'}
        sub={perfil === 'especialista'
          ? 'Candidata-te a projetos de automação publicados por empresas verificadas.'
          : 'Publica o teu projecto ou cria o teu perfil hoje. É gratuito para começar.'
        }
      />

      {/* Modal de candidatura */}
      {modalProjeto && (
        <CandidatarModal
          projeto={modalProjeto}
          onClose={() => { setModalProjeto(null); setCandidaturaSucesso(false) }}
          onSucesso={() => {
            setProjetosComCandidatura(prev => new Set([...prev, modalProjeto.id]))
            setModalProjeto(null)
            setCandidaturaSucesso(true)
            setTimeout(() => setCandidaturaSucesso(false), 4000)
          }}
        />
      )}

      {/* Toast de sucesso */}
      {candidaturaSucesso && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl text-sm font-semibold shadow-2xl"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }}
        >
          ✅ Candidatura enviada com sucesso!
        </div>
      )}
    </>
  )
}

function EmptyState({ tab, onReset }) {
  const emoji = tab === 'especialistas' ? '🔍' : tab === 'servicos' ? '⚡' : '📋'
  const noun = tab === 'especialistas' ? 'especialistas' : tab === 'servicos' ? 'serviços' : 'projectos'
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div style={{ fontSize: 48 }}>{emoji}</div>
      <h3 className="text-lg font-bold" style={{ color: '#e2e8f0' }}>Sem resultados</h3>
      <p className="text-sm text-center" style={{ color: '#475569', maxWidth: 320 }}>
        Não encontrámos {noun} com esses filtros.
        Tenta ajustar a pesquisa.
      </p>
      <button className="btn-outline" onClick={onReset}>
        Limpar filtros
      </button>
    </div>
  )
}
