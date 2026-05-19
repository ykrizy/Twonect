import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, title: 'Perfil Básico' },
  { num: 2, title: 'Especializações' },
  { num: 3, title: 'Portfólio' },
  { num: 4, title: 'Disponibilidade' },
  { num: 5, title: 'Revisão' },
]

const COUNTRIES = [
  'Portugal', 'Espanha', 'Brasil', 'França', 'Alemanha', 'Reino Unido',
  'Itália', 'Países Baixos', 'Bélgica', 'Suíça', 'Estados Unidos', 'Canadá',
  'Angola', 'Moçambique', 'Cabo Verde', 'Outro',
]

const SKILLS_BY_CATEGORY = {
  'IA & ML': [
    { id: 'chatgpt', label: 'ChatGPT / OpenAI' },
    { id: 'langchain', label: 'LangChain' },
    { id: 'ml', label: 'Machine Learning' },
    { id: 'agentes-ia', label: 'Agentes IA' },
    { id: 'computer-vision', label: 'Computer Vision' },
  ],
  'Automação': [
    { id: 'make', label: 'Make / Integromat' },
    { id: 'zapier', label: 'Zapier' },
    { id: 'n8n', label: 'n8n' },
    { id: 'power-automate', label: 'Power Automate' },
    { id: 'uipath', label: 'UiPath' },
    { id: 'python-auto', label: 'Python Automation' },
  ],
  'Integrações': [
    { id: 'rest-api', label: 'REST APIs' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'salesforce', label: 'Salesforce' },
    { id: 'hubspot', label: 'HubSpot' },
    { id: 'sap', label: 'SAP' },
    { id: 'shopify', label: 'Shopify' },
  ],
  'Data & BI': [
    { id: 'power-bi', label: 'Power BI' },
    { id: 'tableau', label: 'Tableau' },
    { id: 'dbt', label: 'dbt' },
    { id: 'sql', label: 'SQL' },
    { id: 'google-analytics', label: 'Google Analytics' },
  ],
  'No-Code / Low-Code': [
    { id: 'bubble', label: 'Bubble' },
    { id: 'webflow', label: 'Webflow' },
    { id: 'airtable', label: 'Airtable' },
    { id: 'notion', label: 'Notion' },
  ],
}

const SKILL_LEVELS = ['Iniciante', 'Intermédio', 'Avançado', 'Expert']

const SECTORS = [
  'E-commerce', 'Logística', 'Saúde', 'Finanças', 'Tecnologia',
  'Retalho', 'Indústria', 'Serviços', 'Educação', 'Imobiliário', 'Outro',
]

const LANGUAGES = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Mandarim']

const BUDGET_OPTIONS = ['€500', '€1.000', '€2.500', '€5.000', '€10.000+']

const RESPONSE_TIMES = ['< 1 hora', '< 4 horas', '< 24 horas', '1–2 dias']

// ─── Small icons ─────────────────────────────────────────────────────────────

const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const IconUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const IconSuccess = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current }) {
  const pct = ((current - 1) / (STEPS.length - 1)) * 100

  return (
    <div
      className="sticky top-0 z-40"
      style={{ background: 'rgba(7,7,12,0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Step labels */}
        <div className="flex items-center justify-between mb-3">
          {STEPS.map(s => (
            <div
              key={s.num}
              className="flex flex-col items-center gap-1"
              style={{ opacity: s.num <= current ? 1 : 0.35, transition: 'opacity 0.3s' }}
            >
              <div
                className="flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                style={{
                  width: 28,
                  height: 28,
                  background: s.num < current
                    ? 'var(--brand)'
                    : s.num === current
                    ? 'linear-gradient(135deg, #8B6AFF, #7C5CF6)'
                    : 'var(--surface-2)',
                  color: s.num <= current ? '#fff' : 'var(--text-3)',
                  border: s.num === current ? '2px solid rgba(167,139,250,0.4)' : '1px solid var(--border-2)',
                  boxShadow: s.num === current ? '0 0 16px rgba(124,92,246,0.4)' : 'none',
                }}
              >
                {s.num < current ? <IconCheck size={12} /> : s.num}
              </div>
              <span
                className="hidden sm:block text-xs font-medium"
                style={{ color: s.num === current ? 'var(--brand-light)' : 'var(--text-3)', whiteSpace: 'nowrap' }}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Bar */}
        <div style={{ height: 3, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--brand), var(--brand-light))',
              borderRadius: 2,
              transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: '0 0 12px rgba(124,92,246,0.6)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────

function StepContainer({ children, title, subtitle }) {
  return (
    <div style={{ animation: 'stepFadeIn 0.35s cubic-bezier(0.22,1,0.36,1) both' }}>
      <div className="mb-8">
        <h2 className="font-heading text-2xl mb-2" style={{ color: 'var(--text)' }}>{title}</h2>
        {subtitle && <p style={{ color: 'var(--text-2)', fontSize: '15px' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function FormLabel({ children, required }) {
  return (
    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>
      {children}{required && <span style={{ color: 'var(--brand-light)', marginLeft: 3 }}>*</span>}
    </label>
  )
}

function NavButtons({ step, onBack, onNext, onSubmit, loading, nextDisabled }) {
  return (
    <div className="flex items-center justify-between mt-10 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
      {step > 1 ? (
        <button
          onClick={onBack}
          className="btn-outline"
          style={{ padding: '10px 22px' }}
        >
          ← Anterior
        </button>
      ) : <div />}

      {step < 5 ? (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="btn-primary"
          style={{ opacity: nextDisabled ? 0.5 : 1, padding: '11px 28px' }}
        >
          Próximo →
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={loading}
          className="btn-primary btn-primary-lg"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'A submeter…' : 'Submeter Perfil para Verificação →'}
        </button>
      )}
    </div>
  )
}

// ─── Step 1 — Perfil básico ───────────────────────────────────────────────────

function Step1({ data, onChange }) {
  const fileRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange('foto_preview', url)
    onChange('foto_file', file)
  }

  return (
    <StepContainer
      title="O teu perfil básico"
      subtitle="Apresenta-te aos clientes. Um perfil completo aumenta as tuas chances de contratação em 3×."
    >
      {/* Photo upload */}
      <div className="mb-6">
        <FormLabel>Foto profissional</FormLabel>
        <div className="flex items-center gap-5">
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-2xl overflow-hidden"
            style={{
              width: 88, height: 88,
              background: 'var(--surface-2)',
              border: '2px dashed var(--border-2)',
            }}
          >
            {data.foto_preview ? (
              <img src={data.foto_preview} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ color: 'var(--text-3)' }}>
                <IconUpload />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-outline"
              style={{ fontSize: '13px', padding: '8px 18px' }}
            >
              {data.foto_preview ? 'Alterar foto' : 'Carregar foto'}
            </button>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-3)' }}>JPG, PNG ou WebP — máx. 5 MB</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        </div>
      </div>

      {/* Título profissional */}
      <div className="mb-5">
        <FormLabel required>Título profissional</FormLabel>
        <input
          type="text"
          className="form-input"
          placeholder="ex: Automation Engineer, RPA Consultant, AI Workflow Architect…"
          value={data.titulo}
          onChange={e => onChange('titulo', e.target.value)}
          maxLength={80}
        />
      </div>

      {/* Bio */}
      <div className="mb-5">
        <FormLabel required>Bio profissional</FormLabel>
        <textarea
          className="form-input"
          rows={4}
          maxLength={500}
          placeholder="Descreve a tua experiência, abordagem e o que te distingue…"
          value={data.bio}
          onChange={e => onChange('bio', e.target.value)}
          style={{ resize: 'vertical' }}
        />
        <div className="text-right text-xs mt-1" style={{ color: data.bio.length >= 450 ? 'var(--accent-light)' : 'var(--text-3)' }}>
          {data.bio.length}/500
        </div>
      </div>

      {/* Grid row */}
      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <FormLabel required>Anos de experiência</FormLabel>
          <select
            className="form-input w-full"
            value={data.anos_experiencia}
            onChange={e => onChange('anos_experiencia', e.target.value)}
          >
            {['< 1 ano', '1–3 anos', '3–5 anos', '5–10 anos', '10+ anos'].map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <FormLabel>País</FormLabel>
          <select
            className="form-input w-full"
            value={data.pais}
            onChange={e => onChange('pais', e.target.value)}
          >
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FormLabel>LinkedIn</FormLabel>
          <input
            type="url"
            className="form-input"
            placeholder="linkedin.com/in/teu-perfil"
            value={data.linkedin}
            onChange={e => onChange('linkedin', e.target.value)}
          />
        </div>
        <div>
          <FormLabel>Website / Portfólio</FormLabel>
          <input
            type="url"
            className="form-input"
            placeholder="teu-portfolio.com"
            value={data.website}
            onChange={e => onChange('website', e.target.value)}
          />
        </div>
      </div>
    </StepContainer>
  )
}

// ─── Step 2 — Especializações ─────────────────────────────────────────────────

function Step2({ data, onChange }) {
  const selectedMap = data.skills || {}

  function toggleSkill(id) {
    const next = { ...selectedMap }
    if (next[id]) {
      delete next[id]
    } else {
      next[id] = 'Intermédio'
    }
    onChange('skills', next)
  }

  function setLevel(id, level) {
    onChange('skills', { ...selectedMap, [id]: level })
  }

  const count = Object.keys(selectedMap).length

  return (
    <StepContainer
      title="As tuas especializações"
      subtitle="Seleciona as tuas competências e define o teu nível em cada uma. Mínimo 3 skills."
    >
      {/* Count indicator */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
        style={{
          background: count >= 3 ? 'rgba(16,185,129,0.07)' : 'rgba(124,92,246,0.07)',
          border: `1px solid ${count >= 3 ? 'rgba(16,185,129,0.2)' : 'rgba(124,92,246,0.2)'}`,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full text-xs font-bold"
          style={{
            width: 28, height: 28,
            background: count >= 3 ? 'rgba(16,185,129,0.15)' : 'rgba(124,92,246,0.15)',
            color: count >= 3 ? 'var(--success-light)' : 'var(--brand-light)',
          }}
        >
          {count}
        </div>
        <span className="text-sm" style={{ color: count >= 3 ? 'var(--success-light)' : 'var(--text-2)' }}>
          {count >= 3 ? `${count} skills selecionadas — ótimo!` : `${3 - count} mais para continuar`}
        </span>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {Object.entries(SKILLS_BY_CATEGORY).map(([cat, skills]) => (
          <div key={cat}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)', letterSpacing: '0.1em' }}>
              {cat}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {skills.map(skill => {
                const selected = !!selectedMap[skill.id]
                return (
                  <div key={skill.id}>
                    <button
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        background: selected ? 'rgba(124,92,246,0.12)' : 'var(--surface-2)',
                        border: `1px solid ${selected ? 'rgba(124,92,246,0.35)' : 'var(--border)'}`,
                        color: selected ? 'var(--brand-light)' : 'var(--text-2)',
                        cursor: 'pointer',
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {selected && (
                          <span style={{ color: 'var(--brand-light)', flexShrink: 0 }}>
                            <IconCheck size={12} />
                          </span>
                        )}
                        {skill.label}
                      </span>
                    </button>
                    {selected && (
                      <select
                        value={selectedMap[skill.id]}
                        onChange={e => setLevel(skill.id, e.target.value)}
                        className="form-input mt-1 text-xs"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                      >
                        {SKILL_LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </StepContainer>
  )
}

// ─── Step 3 — Portfólio ───────────────────────────────────────────────────────

function ProjectCard3({ project, index, onUpdate, onRemove, allSkills }) {
  function set(key, val) {
    onUpdate(index, { ...project, [key]: val })
  }

  function toggleTool(tool) {
    const current = project.ferramentas || []
    const next = current.includes(tool)
      ? current.filter(t => t !== tool)
      : [...current, tool]
    set('ferramentas', next)
  }

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-lg)',
        padding: '24px',
        animation: 'stepFadeIn 0.3s ease both',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div
          className="flex items-center gap-3"
        >
          <div
            className="flex items-center justify-center rounded-lg text-xs font-bold"
            style={{
              width: 32, height: 32,
              background: 'rgba(124,92,246,0.12)',
              color: 'var(--brand-light)',
              border: '1px solid rgba(124,92,246,0.25)',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
            {project.titulo || `Projeto ${index + 1}`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          title="Remover"
        >
          <IconTrash />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <FormLabel required>Título do projeto</FormLabel>
          <input
            className="form-input"
            value={project.titulo || ''}
            onChange={e => set('titulo', e.target.value)}
            placeholder="ex: Automação de faturação SAP"
          />
        </div>
        <div>
          <FormLabel>Setor</FormLabel>
          <select
            className="form-input w-full"
            value={project.setor || ''}
            onChange={e => set('setor', e.target.value)}
          >
            <option value="">Selecionar…</option>
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <FormLabel>Problema resolvido</FormLabel>
        <textarea
          className="form-input"
          rows={2}
          value={project.problema || ''}
          onChange={e => set('problema', e.target.value)}
          placeholder="Qual era o desafio do cliente?"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="mb-4">
        <FormLabel>Solução implementada</FormLabel>
        <textarea
          className="form-input"
          rows={2}
          value={project.solucao || ''}
          onChange={e => set('solucao', e.target.value)}
          placeholder="Como resolves-te o problema?"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="mb-4">
        <FormLabel>Resultados / ROI</FormLabel>
        <textarea
          className="form-input"
          rows={2}
          value={project.resultados || ''}
          onChange={e => set('resultados', e.target.value)}
          placeholder="ex: Redução de 60% do tempo manual, €40k poupados por ano…"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Tools */}
      {allSkills.length > 0 && (
        <div className="mb-4">
          <FormLabel>Ferramentas utilizadas</FormLabel>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => {
              const selected = (project.ferramentas || []).includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleTool(skill)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all"
                  style={{
                    background: selected ? 'rgba(124,92,246,0.15)' : 'var(--surface-2)',
                    border: `1px solid ${selected ? 'rgba(124,92,246,0.4)' : 'var(--border)'}`,
                    color: selected ? 'var(--brand-light)' : 'var(--text-3)',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {selected ? '✓ ' : ''}{skill}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <FormLabel>Link externo (opcional)</FormLabel>
        <input
          type="url"
          className="form-input"
          value={project.link || ''}
          onChange={e => set('link', e.target.value)}
          placeholder="https://…"
        />
      </div>
    </div>
  )
}

function Step3({ data, onChange, skillsData }) {
  const projects = data.portfolio || []

  // Flatten selected skills for tag selection
  const allSkillLabels = Object.entries(SKILLS_BY_CATEGORY)
    .flatMap(([, skills]) => skills)
    .filter(s => skillsData[s.id])
    .map(s => s.label)

  function addProject() {
    if (projects.length >= 5) return
    onChange('portfolio', [...projects, {}])
  }

  function updateProject(index, val) {
    const next = [...projects]
    next[index] = val
    onChange('portfolio', next)
  }

  function removeProject(index) {
    onChange('portfolio', projects.filter((_, i) => i !== index))
  }

  return (
    <StepContainer
      title="Portfólio de projetos"
      subtitle="Mostra o teu trabalho. Case studies concretos aumentam a confiança dos clientes. Até 5 projetos."
    >
      <div className="space-y-5 mb-6">
        {projects.map((p, i) => (
          <ProjectCard3
            key={i}
            project={p}
            index={i}
            onUpdate={updateProject}
            onRemove={removeProject}
            allSkills={allSkillLabels}
          />
        ))}
      </div>

      {projects.length < 5 ? (
        <button
          type="button"
          onClick={addProject}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: 'rgba(124,92,246,0.04)',
            border: '1px dashed rgba(124,92,246,0.25)',
            color: 'var(--brand-light)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(124,92,246,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,92,246,0.04)'; e.currentTarget.style.borderColor = 'rgba(124,92,246,0.25)' }}
        >
          <IconPlus /> Adicionar projeto {projects.length > 0 ? `(${projects.length}/5)` : ''}
        </button>
      ) : (
        <p className="text-center text-sm" style={{ color: 'var(--text-3)' }}>
          Atingiste o máximo de 5 projetos.
        </p>
      )}

      {projects.length === 0 && (
        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-3)' }}>
          O portfólio é opcional, mas altamente recomendado.
        </p>
      )}
    </StepContainer>
  )
}

// ─── Step 4 — Disponibilidade e tarifas ──────────────────────────────────────

function Step4({ data, onChange }) {
  return (
    <StepContainer
      title="Disponibilidade e tarifas"
      subtitle="Define as tuas condições de trabalho para aparecer nos projetos certos."
    >
      {/* Tipo */}
      <div className="mb-6">
        <FormLabel>Tipo de perfil</FormLabel>
        <div className="flex gap-3">
          {['Freelancer', 'Empresa'].map(tipo => (
            <button
              key={tipo}
              type="button"
              onClick={() => onChange('tipo_perfil', tipo)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: data.tipo_perfil === tipo ? 'rgba(124,92,246,0.12)' : 'var(--surface-2)',
                border: `1px solid ${data.tipo_perfil === tipo ? 'rgba(124,92,246,0.4)' : 'var(--border-2)'}`,
                color: data.tipo_perfil === tipo ? 'var(--brand-light)' : 'var(--text-2)',
                cursor: 'pointer',
              }}
            >
              {data.tipo_perfil === tipo && '✓ '}{tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Disponibilidade */}
      <div className="mb-6">
        <FormLabel>Disponibilidade</FormLabel>
        <div className="flex flex-col gap-2">
          {['Tempo completo', 'Tempo parcial', 'Por projeto'].map(disp => (
            <label
              key={disp}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
              style={{
                background: data.disponibilidade === disp ? 'rgba(124,92,246,0.08)' : 'var(--surface-2)',
                border: `1px solid ${data.disponibilidade === disp ? 'rgba(124,92,246,0.3)' : 'var(--border)'}`,
              }}
            >
              <input
                type="radio"
                name="disponibilidade"
                value={disp}
                checked={data.disponibilidade === disp}
                onChange={() => onChange('disponibilidade', disp)}
                style={{ accentColor: 'var(--brand)', width: 16, height: 16 }}
              />
              <span className="text-sm font-medium" style={{ color: data.disponibilidade === disp ? 'var(--text)' : 'var(--text-2)' }}>
                {disp}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Taxa horária */}
      <div className="mb-6">
        <FormLabel>Taxa horária (€/hora)</FormLabel>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="number"
            className="form-input"
            style={{ width: 120 }}
            min={10}
            max={500}
            value={data.taxa_horaria}
            onChange={e => onChange('taxa_horaria', Number(e.target.value))}
            placeholder="75"
          />
          <span className="text-lg font-bold" style={{ color: 'var(--brand-light)' }}>
            €{data.taxa_horaria || 0}/hora
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={300}
          step={5}
          value={data.taxa_horaria || 50}
          onChange={e => onChange('taxa_horaria', Number(e.target.value))}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-3)' }}>
          <span>€10</span><span>€300</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {/* Orçamento mínimo */}
        <div>
          <FormLabel>Orçamento mínimo por projeto</FormLabel>
          <select
            className="form-input w-full"
            value={data.orcamento_minimo}
            onChange={e => onChange('orcamento_minimo', e.target.value)}
          >
            {BUDGET_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Tempo de resposta */}
        <div>
          <FormLabel>Tempo de resposta típico</FormLabel>
          <select
            className="form-input w-full"
            value={data.tempo_resposta}
            onChange={e => onChange('tempo_resposta', e.target.value)}
          >
            {RESPONSE_TIMES.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Idiomas */}
      <div>
        <FormLabel>Idiomas</FormLabel>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => {
            const sel = (data.idiomas || []).includes(lang)
            return (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  const current = data.idiomas || []
                  onChange('idiomas', sel ? current.filter(l => l !== lang) : [...current, lang])
                }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: sel ? 'rgba(124,92,246,0.12)' : 'var(--surface-2)',
                  border: `1px solid ${sel ? 'rgba(124,92,246,0.35)' : 'var(--border)'}`,
                  color: sel ? 'var(--brand-light)' : 'var(--text-2)',
                  cursor: 'pointer',
                }}
              >
                {sel ? '✓ ' : ''}{lang}
              </button>
            )
          })}
        </div>
      </div>
    </StepContainer>
  )
}

// ─── Step 5 — Revisão ─────────────────────────────────────────────────────────

function completeness(data) {
  const checks = {
    titulo: !!data.step1?.titulo,
    bio: data.step1?.bio?.length >= 50,
    foto: !!data.step1?.foto_file,
    linkedin: !!data.step1?.linkedin,
    skills: Object.keys(data.step2?.skills || {}).length >= 3,
    portfolio: (data.step3?.portfolio || []).length > 0,
    taxa_horaria: !!data.step4?.taxa_horaria,
    idiomas: (data.step4?.idiomas || []).length > 0,
  }
  const done = Object.values(checks).filter(Boolean).length
  const total = Object.keys(checks).length
  return { pct: Math.round((done / total) * 100), checks }
}

const CHECK_LABELS = {
  titulo: 'Título profissional',
  bio: 'Bio profissional (mín. 50 caracteres)',
  foto: 'Foto de perfil',
  linkedin: 'LinkedIn',
  skills: 'Mínimo 3 skills',
  portfolio: 'Pelo menos 1 projeto no portfólio',
  taxa_horaria: 'Taxa horária definida',
  idiomas: 'Idiomas selecionados',
}

function ReviewRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="text-sm flex-shrink-0 w-36" style={{ color: 'var(--text-3)' }}>{label}</span>
      <span className="text-sm" style={{ color: 'var(--text-2)' }}>{value}</span>
    </div>
  )
}

function Step5({ data, agreements, onAgreement, error }) {
  const { pct, checks } = completeness(data)
  const step1 = data.step1 || {}
  const step2 = data.step2 || {}
  const step4 = data.step4 || {}
  const skillCount = Object.keys(step2.skills || {}).length
  const portfolioCount = (data.step3?.portfolio || []).length

  const barColor = pct < 50 ? 'var(--danger)' : pct < 80 ? 'var(--warning)' : 'var(--success)'

  return (
    <StepContainer
      title="Revisão e submissão"
      subtitle="Confirma os teus dados antes de submeter o perfil para verificação."
    >
      {/* Completeness */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Completude do perfil</span>
          <span
            className="text-2xl font-extrabold"
            style={{ color: pct >= 80 ? 'var(--success-light)' : pct >= 50 ? '#FCD34D' : 'var(--accent-light)', fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.04em' }}
          >
            {pct}%
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${barColor}88` }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(checks).map(([key, done]) => (
            <div key={key} className="flex items-center gap-2 text-xs" style={{ color: done ? 'var(--success-light)' : 'var(--text-3)' }}>
              <span style={{ flexShrink: 0 }}>{done ? '✓' : '○'}</span>
              {CHECK_LABELS[key]}
            </div>
          ))}
        </div>
      </div>

      {/* Profile summary */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid var(--border)' }}>
        <div className="px-6 py-4" style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>Resumo do perfil</span>
        </div>
        <div className="px-6 py-4 space-y-0" style={{ background: 'var(--surface)' }}>
          <ReviewRow label="Título" value={step1.titulo} />
          <ReviewRow label="Experiência" value={step1.anos_experiencia} />
          <ReviewRow label="País" value={step1.pais} />
          <ReviewRow label="LinkedIn" value={step1.linkedin} />
          <ReviewRow label="Website" value={step1.website} />
          <ReviewRow label="Skills" value={skillCount > 0 ? `${skillCount} skills selecionadas` : null} />
          <ReviewRow label="Portfólio" value={portfolioCount > 0 ? `${portfolioCount} projeto(s)` : null} />
          <ReviewRow label="Disponibilidade" value={step4.disponibilidade} />
          <ReviewRow label="Taxa horária" value={step4.taxa_horaria ? `€${step4.taxa_horaria}/hora` : null} />
          <ReviewRow label="Orçamento mín." value={step4.orcamento_minimo} />
          <ReviewRow label="Idiomas" value={(step4.idiomas || []).join(', ') || null} />
          <ReviewRow label="Tempo de resp." value={step4.tempo_resposta} />
        </div>
      </div>

      {/* Agreements */}
      <div className="space-y-2 mb-6">
        {[
          { key: 'termos', label: 'Aceito os Termos de Serviço da Twonect' },
          { key: 'privacidade', label: 'Aceito a Política de Privacidade' },
          { key: 'nda', label: 'Aceito o NDA e política de confidencialidade' },
          { key: 'veracidade', label: 'Confirmo que todas as informações são verdadeiras e precisas' },
        ].map(({ key, label }) => (
          <label
            key={key}
            className="flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
            style={{
              background: agreements[key] ? 'rgba(16,185,129,0.07)' : 'var(--surface-2)',
              border: `1px solid ${agreements[key] ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
            }}
          >
            <input
              type="checkbox"
              checked={!!agreements[key]}
              onChange={e => onAgreement(key, e.target.checked)}
              style={{ accentColor: 'var(--brand)', width: 16, height: 16, flexShrink: 0, marginTop: 2 }}
            />
            <span className="text-sm" style={{ color: agreements[key] ? 'var(--text)' : 'var(--text-2)' }}>
              {label}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm mb-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          {error}
        </div>
      )}
    </StepContainer>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  const navigate = useNavigate()
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg)', animation: 'stepFadeIn 0.5s ease both' }}
    >
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <IconSuccess />
        </div>
        <h1 className="font-display text-3xl mb-3" style={{ color: 'var(--text)' }}>
          Perfil submetido!
        </h1>
        <p className="text-base mb-6" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
          A nossa equipa irá analisar o teu perfil nas próximas <strong style={{ color: 'var(--text)' }}>24 horas úteis</strong>.
          Receberás uma notificação por email quando estiver verificado.
        </p>
        <div
          className="rounded-xl px-5 py-4 mb-8 text-sm text-left"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>O que acontece a seguir:</p>
          {[
            'Verificação de identidade e credenciais',
            'Análise do portfólio e competências técnicas',
            'Ativação do perfil público no marketplace',
            'Acesso a projetos de automação verificados',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 mt-2" style={{ color: 'var(--text-2)' }}>
              <span style={{ color: 'var(--brand-light)', flexShrink: 0 }}>
                <IconCheck size={12} />
              </span>
              {item}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/dashboard')} className="btn-primary btn-primary-lg">
            Ir para o Dashboard →
          </button>
          <button onClick={() => navigate('/marketplace')} className="btn-outline" style={{ padding: '14px 24px' }}>
            Ver Marketplace
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingEspecialista() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Step 1
  const [s1, setS1] = useState({
    foto_preview: '', foto_file: null,
    titulo: '', bio: '',
    anos_experiencia: '1–3 anos',
    linkedin: '', website: '',
    pais: 'Portugal',
  })
  // Step 2
  const [s2, setS2] = useState({ skills: {} })
  // Step 3
  const [s3, setS3] = useState({ portfolio: [] })
  // Step 4
  const [s4, setS4] = useState({
    tipo_perfil: 'Freelancer',
    disponibilidade: 'Por projeto',
    taxa_horaria: 75,
    orcamento_minimo: '€1.000',
    idiomas: ['Português'],
    tempo_resposta: '< 24 horas',
  })
  // Step 5 agreements
  const [agreements, setAgreements] = useState({
    termos: false, privacidade: false, nda: false, veracidade: false,
  })

  const contentRef = useRef(null)

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateS1(key, val) { setS1(prev => ({ ...prev, [key]: val })) }
  function updateS2(key, val) { setS2(prev => ({ ...prev, [key]: val })) }
  function updateS3(key, val) { setS3(prev => ({ ...prev, [key]: val })) }
  function updateS4(key, val) { setS4(prev => ({ ...prev, [key]: val })) }
  function updateAgreement(key, val) { setAgreements(prev => ({ ...prev, [key]: val })) }

  // Validation per step
  const canProceed = {
    1: !!s1.titulo && s1.bio.length >= 10,
    2: Object.keys(s2.skills).length >= 3,
    3: true, // portfolio is optional
    4: !!s4.disponibilidade && !!s4.taxa_horaria,
    5: Object.values(agreements).every(Boolean),
  }

  function goNext() {
    if (canProceed[step]) {
      setStep(s => s + 1)
      scrollTop()
    }
  }

  function goBack() {
    setStep(s => s - 1)
    scrollTop()
  }

  async function handleSubmit() {
    if (!Object.values(agreements).every(Boolean)) {
      setSubmitError('Por favor, aceita todos os termos antes de submeter.')
      return
    }
    setLoading(true)
    setSubmitError(null)

    try {
      // Build skills array for storage
      const skillsArray = Object.entries(s2.skills).map(([id, level]) => ({ id, level }))

      const payload = {
        // If user is logged in, link to them
        ...(user ? { user_id: user.id } : {}),
        titulo: s1.titulo,
        bio: s1.bio,
        anos_experiencia: s1.anos_experiencia,
        linkedin: s1.linkedin,
        website: s1.website,
        pais: s1.pais,
        skills: skillsArray,
        portfolio: s3.portfolio,
        tipo_perfil: s4.tipo_perfil,
        disponibilidade: s4.disponibilidade,
        preco_hora: s4.taxa_horaria,
        orcamento_minimo: s4.orcamento_minimo,
        idiomas: s4.idiomas,
        tempo_resposta: s4.tempo_resposta,
        estado_verificacao: 'pendente',
        updated_at: new Date().toISOString(),
      }

      // Upload photo if present
      if (s1.foto_file && user) {
        const ext = s1.foto_file.name.split('.').pop()
        const path = `avatars/${user.id}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('especialistas')
          .upload(path, s1.foto_file, { upsert: true })
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('especialistas').getPublicUrl(path)
          payload.foto_url = urlData.publicUrl
        }
      }

      if (user) {
        // Check if record exists
        const { data: existing } = await supabase
          .from('especialistas')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (existing) {
          await supabase.from('especialistas').update(payload).eq('user_id', user.id)
        } else {
          await supabase.from('especialistas').insert(payload)
        }
      } else {
        await supabase.from('especialistas').insert(payload)
      }

      setDone(true)
    } catch (err) {
      setSubmitError(err.message || 'Erro ao submeter perfil. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return <SuccessScreen />

  const allData = { step1: s1, step2: s2, step3: s3, step4: s4 }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <ProgressBar current={step} />

      <div ref={contentRef} className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        {/* Ambient glow */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,92,246,0.05) 0%, transparent 70%)', zIndex: 0 }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {step === 1 && <Step1 data={s1} onChange={updateS1} />}
          {step === 2 && <Step2 data={s2} onChange={updateS2} />}
          {step === 3 && <Step3 data={s3} onChange={updateS3} skillsData={s2.skills} />}
          {step === 4 && <Step4 data={s4} onChange={updateS4} />}
          {step === 5 && (
            <Step5
              data={allData}
              agreements={agreements}
              onAgreement={updateAgreement}
              error={submitError}
            />
          )}

          <NavButtons
            step={step}
            onBack={goBack}
            onNext={goNext}
            onSubmit={handleSubmit}
            loading={loading}
            nextDisabled={!canProceed[step]}
          />
        </div>
      </div>
    </div>
  )
}
