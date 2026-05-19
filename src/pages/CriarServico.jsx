import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, title: 'Serviço Base' },
  { num: 2, title: 'Packages' },
  { num: 3, title: 'Extras & Revisão' },
]

const CATEGORIES = [
  'RPA', 'IA & LLMs', 'Integrações', 'BI & Data',
  'Marketing Automation', 'No-Code', 'Custom Dev',
]

const DEFAULT_PACKAGES = [
  {
    nome: 'Básico',
    descricao: 'Implementação essencial para começar',
    preco: 500,
    entrega_dias: 7,
    revisoes: 1,
    features: ['Análise de requisitos', 'Configuração base', 'Documentação básica'],
  },
  {
    nome: 'Standard',
    descricao: 'Solução completa com suporte personalizado',
    preco: 1500,
    entrega_dias: 14,
    revisoes: 3,
    features: ['Tudo do Básico', 'Configuração avançada', 'Testes e QA', 'Suporte 30 dias', 'Relatório detalhado'],
  },
  {
    nome: 'Premium',
    descricao: 'Solução enterprise com garantias máximas',
    preco: 4000,
    entrega_dias: 30,
    revisoes: 999,
    features: ['Tudo do Standard', 'Arquitetura personalizada', 'Integrações ilimitadas', 'Suporte prioritário 90 dias', 'Formação da equipa', 'SLA garantido'],
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconX = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconUpload = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
      <div className="max-w-5xl mx-auto px-4 py-4">
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
                  width: 32, height: 32,
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
                {s.num < current ? <IconCheck size={14} /> : s.num}
              </div>
              <span className="text-xs font-medium" style={{ color: s.num === current ? 'var(--brand-light)' : 'var(--text-3)', whiteSpace: 'nowrap' }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: 3, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--brand), var(--brand-light))',
              borderRadius: 2, transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
              boxShadow: '0 0 12px rgba(124,92,246,0.6)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Shared components ────────────────────────────────────────────────────────

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

function NavButtons({ step, onBack, onNext, onPublish, loading, nextDisabled }) {
  return (
    <div className="flex items-center justify-between mt-10 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
      {step > 1 ? (
        <button onClick={onBack} className="btn-outline" style={{ padding: '10px 22px' }}>
          ← Anterior
        </button>
      ) : <div />}
      {step < 3 ? (
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
          onClick={onPublish}
          disabled={loading}
          className="btn-primary btn-primary-lg"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'A publicar…' : 'Publicar Serviço →'}
        </button>
      )}
    </div>
  )
}

// ─── Tag input ────────────────────────────────────────────────────────────────

function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [input, setInput] = useState('')

  function handleKey(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      const tag = input.trim().replace(/,$/, '')
      if (tag && !tags.includes(tag)) {
        onAdd(tag)
      }
      setInput('')
    }
  }

  return (
    <div
      className="flex flex-wrap gap-2 p-3 rounded-xl min-h-12"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)' }}
    >
      {tags.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(124,92,246,0.12)', color: 'var(--brand-light)', border: '1px solid rgba(124,92,246,0.25)' }}
        >
          {tag}
          <button type="button" onClick={() => onRemove(tag)} style={{ color: 'var(--brand-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
            <IconX size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? placeholder : 'Adicionar…'}
        style={{
          flex: 1, minWidth: 120, background: 'none', border: 'none', outline: 'none',
          color: 'var(--text)', fontSize: '14px', fontFamily: 'Inter, sans-serif',
        }}
      />
    </div>
  )
}

// ─── Step 1 — Serviço base ────────────────────────────────────────────────────

function Step1({ data, onChange }) {
  const fileRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    onChange('imagem_preview', URL.createObjectURL(file))
    onChange('imagem_file', file)
  }

  return (
    <StepContainer
      title="Define o teu serviço"
      subtitle="Apresenta o que ofereces com clareza. Um bom título e descrição fazem toda a diferença."
    >
      {/* Title */}
      <div className="mb-5">
        <FormLabel required>Título do serviço</FormLabel>
        <input
          type="text"
          className="form-input"
          maxLength={80}
          placeholder="ex: Automação WhatsApp Business, Integração CRM + ERP, Agente IA para apoio ao cliente…"
          value={data.titulo}
          onChange={e => onChange('titulo', e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="mb-5">
        <FormLabel required>Categoria</FormLabel>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => onChange('categoria', cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: data.categoria === cat ? 'rgba(124,92,246,0.15)' : 'var(--surface-2)',
                border: `1px solid ${data.categoria === cat ? 'rgba(124,92,246,0.4)' : 'var(--border)'}`,
                color: data.categoria === cat ? 'var(--brand-light)' : 'var(--text-2)',
                cursor: 'pointer',
              }}
            >
              {data.categoria === cat && '✓ '}{cat}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-5">
        <FormLabel required>Descrição detalhada</FormLabel>
        <textarea
          className="form-input"
          rows={5}
          maxLength={1000}
          placeholder="Descreve o teu serviço em detalhe: o que incluis, como trabalhas, quais os entregáveis…"
          value={data.descricao}
          onChange={e => onChange('descricao', e.target.value)}
          style={{ resize: 'vertical' }}
        />
        <div className="text-right text-xs mt-1" style={{ color: data.descricao.length >= 900 ? 'var(--accent-light)' : 'var(--text-3)' }}>
          {data.descricao.length}/1000
        </div>
      </div>

      {/* Tools */}
      <div className="mb-5">
        <FormLabel>Ferramentas e tecnologias</FormLabel>
        <TagInput
          tags={data.ferramentas}
          onAdd={t => onChange('ferramentas', [...data.ferramentas, t])}
          onRemove={t => onChange('ferramentas', data.ferramentas.filter(x => x !== t))}
          placeholder="ex: Make, n8n, Python, Zapier… (Enter ou vírgula)"
        />
        <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>Pressiona Enter ou vírgula para adicionar</p>
      </div>

      {/* SEO tags */}
      <div className="mb-5">
        <FormLabel>Tags SEO</FormLabel>
        <TagInput
          tags={data.tags_seo}
          onAdd={t => onChange('tags_seo', [...data.tags_seo, t])}
          onRemove={t => onChange('tags_seo', data.tags_seo.filter(x => x !== t))}
          placeholder="ex: automação, rpa, chatbot… (Enter ou vírgula)"
        />
      </div>

      {/* Cover image */}
      <div>
        <FormLabel>Imagem de capa</FormLabel>
        <div
          className="flex items-center justify-center rounded-2xl cursor-pointer transition-all"
          style={{
            height: 180,
            background: data.imagem_preview ? 'none' : 'var(--surface-2)',
            border: `2px dashed ${data.imagem_preview ? 'transparent' : 'var(--border-2)'}`,
            overflow: 'hidden',
            position: 'relative',
          }}
          onClick={() => fileRef.current?.click()}
          onMouseEnter={e => { if (!data.imagem_preview) e.currentTarget.style.borderColor = 'rgba(124,92,246,0.35)' }}
          onMouseLeave={e => { if (!data.imagem_preview) e.currentTarget.style.borderColor = 'var(--border-2)' }}
        >
          {data.imagem_preview ? (
            <>
              <img src={data.imagem_preview} alt="Capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = 1 }}
                onMouseLeave={e => { e.currentTarget.style.opacity = 0 }}
              >
                <span className="text-sm font-semibold" style={{ color: '#fff' }}>Alterar imagem</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2" style={{ color: 'var(--text-3)' }}>
              <IconUpload />
              <span className="text-sm">Clica para carregar imagem</span>
              <span className="text-xs">JPG, PNG, WebP — máx. 5 MB — 16:9 recomendado</span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </StepContainer>
  )
}

// ─── Step 2 — Packages ────────────────────────────────────────────────────────

function PackageEditor({ pkg, index, onChange, isPopular }) {
  function set(key, val) {
    onChange(index, { ...pkg, [key]: val })
  }

  function addFeature() {
    set('features', [...(pkg.features || []), ''])
  }

  function updateFeature(fi, val) {
    const next = [...(pkg.features || [])]
    next[fi] = val
    set('features', next)
  }

  function removeFeature(fi) {
    set('features', (pkg.features || []).filter((_, i) => i !== fi))
  }

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        border: `1px solid ${isPopular ? 'rgba(124,92,246,0.4)' : 'var(--border)'}`,
        background: isPopular ? 'rgba(124,92,246,0.04)' : 'var(--surface)',
        boxShadow: isPopular ? '0 0 40px rgba(124,92,246,0.08)' : 'none',
      }}
    >
      {isPopular && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-2 text-xs font-bold uppercase tracking-widest"
          style={{ background: 'rgba(124,92,246,0.15)', color: 'var(--brand-light)', borderBottom: '1px solid rgba(124,92,246,0.2)' }}
        >
          ★ Mais Popular
        </div>
      )}

      <div className={`p-6 ${isPopular ? 'pt-12' : ''}`}>
        {/* Package name */}
        <input
          className="form-input font-heading text-lg mb-4"
          value={pkg.nome}
          onChange={e => set('nome', e.target.value)}
          style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.03em' }}
        />

        {/* Short description */}
        <textarea
          className="form-input mb-4"
          rows={2}
          placeholder="Breve descrição deste package…"
          value={pkg.descricao}
          onChange={e => set('descricao', e.target.value)}
          style={{ resize: 'none', fontSize: '13px' }}
        />

        {/* Price */}
        <div className="mb-4">
          <FormLabel>Preço (€)</FormLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--brand-light)' }}>€</span>
            <input
              type="number"
              className="form-input"
              style={{ paddingLeft: '28px' }}
              min={0}
              value={pkg.preco}
              onChange={e => set('preco', Number(e.target.value))}
            />
          </div>
        </div>

        {/* Delivery + revisions */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <FormLabel>Entrega (dias)</FormLabel>
            <input
              type="number"
              className="form-input"
              min={1}
              value={pkg.entrega_dias}
              onChange={e => set('entrega_dias', Number(e.target.value))}
            />
          </div>
          <div>
            <FormLabel>Revisões</FormLabel>
            <input
              type="number"
              className="form-input"
              min={0}
              value={pkg.revisoes === 999 ? '∞' : pkg.revisoes}
              onChange={e => set('revisoes', Number(e.target.value) || 0)}
              placeholder="0 = ilimitado"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <FormLabel>Inclui</FormLabel>
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: 'var(--brand-light)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <IconPlus size={12} /> Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {(pkg.features || []).map((feat, fi) => (
              <div key={fi} className="flex items-center gap-2">
                <span style={{ color: 'var(--success-light)', flexShrink: 0 }}><IconCheck size={12} /></span>
                <input
                  className="form-input flex-1"
                  style={{ fontSize: '13px', padding: '7px 11px' }}
                  value={feat}
                  onChange={e => updateFeature(fi, e.target.value)}
                  placeholder="Inclui…"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(fi)}
                  style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <IconX size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step2({ packages, onChange }) {
  function updatePkg(index, val) {
    const next = [...packages]
    next[index] = val
    onChange(next)
  }

  return (
    <StepContainer
      title="Define os teus packages"
      subtitle="Três níveis distintos ajudam os clientes a escolher a opção certa. O tier do meio será destacado como o mais popular."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((pkg, i) => (
          <PackageEditor
            key={i}
            pkg={pkg}
            index={i}
            onChange={updatePkg}
            isPopular={i === 1}
          />
        ))}
      </div>
    </StepContainer>
  )
}

// ─── Step 3 — Extras & revisão ────────────────────────────────────────────────

function ServicePreviewCard({ titulo, categoria, packages, ferramentas }) {
  const lowestPrice = packages.reduce((min, p) => Math.min(min, p.preco || 0), Infinity)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', maxWidth: 340 }}
    >
      {/* Image placeholder */}
      <div
        className="flex items-center justify-center"
        style={{
          height: 140,
          background: 'linear-gradient(135deg, rgba(124,92,246,0.15), rgba(167,139,250,0.08))',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span style={{ fontSize: 40 }}>⚡</span>
      </div>

      <div className="p-5">
        {categoria && (
          <span className="badge badge-indigo mb-3 inline-block">{categoria}</span>
        )}
        <h3 className="font-heading text-base mb-2" style={{ color: 'var(--text)', lineHeight: 1.3 }}>
          {titulo || 'Título do serviço'}
        </h3>

        {/* Specialist placeholder */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="rounded-full flex items-center justify-center text-xs font-bold"
            style={{ width: 28, height: 28, background: 'rgba(124,92,246,0.12)', color: 'var(--brand-light)', border: '1px solid rgba(124,92,246,0.2)' }}
          >
            EU
          </div>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>O teu nome</span>
          <span className="text-xs ml-auto" style={{ color: '#fbbf24' }}>
            <IconStar /> 5.0
          </span>
        </div>

        {ferramentas.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {ferramentas.slice(0, 3).map(f => (
              <span key={f} className="badge badge-neutral" style={{ fontSize: '10px' }}>{f}</span>
            ))}
            {ferramentas.length > 3 && (
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>+{ferramentas.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>A partir de</div>
            <div className="text-lg font-extrabold" style={{ color: 'var(--brand-light)', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.04em' }}>
              €{lowestPrice === Infinity ? '—' : lowestPrice.toLocaleString('pt-PT')}
            </div>
          </div>
          <button className="btn-primary" style={{ fontSize: '12px', padding: '7px 16px' }}>
            Ver Packages
          </button>
        </div>
      </div>
    </div>
  )
}

function Step3({ extras, onExtras, serviceData, packages, error }) {
  function setExtra(key, val) {
    onExtras({ ...extras, [key]: val })
  }

  function addCustomExtra() {
    const current = extras.custom_extras || []
    onExtras({ ...extras, custom_extras: [...current, { nome: '', preco: '' }] })
  }

  function updateCustomExtra(i, key, val) {
    const current = [...(extras.custom_extras || [])]
    current[i] = { ...current[i], [key]: val }
    onExtras({ ...extras, custom_extras: current })
  }

  function removeCustomExtra(i) {
    onExtras({ ...extras, custom_extras: (extras.custom_extras || []).filter((_, idx) => idx !== i) })
  }

  return (
    <StepContainer
      title="Extras e pré-visualização"
      subtitle="Adiciona extras opcionais e revê como o teu serviço ficará no marketplace."
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: extras */}
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Extras opcionais</p>

          {/* Fast delivery */}
          <div className="rounded-xl p-4 mb-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={!!extras.entrega_rapida}
                onChange={e => setExtra('entrega_rapida', e.target.checked)}
                style={{ accentColor: 'var(--brand)', width: 16, height: 16 }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Entrega rápida</span>
            </div>
            {extras.entrega_rapida && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FormLabel>Preço adicional (€)</FormLabel>
                  <input
                    type="number"
                    className="form-input"
                    value={extras.entrega_rapida_preco || ''}
                    onChange={e => setExtra('entrega_rapida_preco', e.target.value)}
                    placeholder="ex: 200"
                  />
                </div>
                <div>
                  <FormLabel>Entregar em (dias)</FormLabel>
                  <input
                    type="number"
                    className="form-input"
                    value={extras.entrega_rapida_dias || ''}
                    onChange={e => setExtra('entrega_rapida_dias', e.target.value)}
                    placeholder="ex: 3"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Team training */}
          <div className="rounded-xl p-4 mb-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={!!extras.formacao}
                onChange={e => setExtra('formacao', e.target.checked)}
                style={{ accentColor: 'var(--brand)', width: 16, height: 16 }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Formação da equipa</span>
            </div>
            {extras.formacao && (
              <div>
                <FormLabel>Preço adicional (€)</FormLabel>
                <input
                  type="number"
                  className="form-input"
                  value={extras.formacao_preco || ''}
                  onChange={e => setExtra('formacao_preco', e.target.value)}
                  placeholder="ex: 500"
                />
              </div>
            )}
          </div>

          {/* Monthly support */}
          <div className="rounded-xl p-4 mb-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={!!extras.suporte_mensal}
                onChange={e => setExtra('suporte_mensal', e.target.checked)}
                style={{ accentColor: 'var(--brand)', width: 16, height: 16 }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Suporte mensal</span>
            </div>
            {extras.suporte_mensal && (
              <div>
                <FormLabel>Preço mensal (€/mês)</FormLabel>
                <input
                  type="number"
                  className="form-input"
                  value={extras.suporte_mensal_preco || ''}
                  onChange={e => setExtra('suporte_mensal_preco', e.target.value)}
                  placeholder="ex: 300"
                />
              </div>
            )}
          </div>

          {/* Custom extras */}
          <div className="rounded-xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Extras personalizados</span>
              <button
                type="button"
                onClick={addCustomExtra}
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: 'var(--brand-light)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <IconPlus size={12} /> Adicionar
              </button>
            </div>
            <div className="space-y-3">
              {(extras.custom_extras || []).map((extra, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <input
                    className="form-input text-sm"
                    placeholder="Nome do extra"
                    value={extra.nome}
                    onChange={e => updateCustomExtra(i, 'nome', e.target.value)}
                    style={{ fontSize: '13px' }}
                  />
                  <div className="flex gap-1">
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--brand-light)' }}>€</span>
                      <input
                        type="number"
                        className="form-input text-sm"
                        placeholder="Preço"
                        value={extra.preco}
                        onChange={e => updateCustomExtra(i, 'preco', e.target.value)}
                        style={{ fontSize: '13px', paddingLeft: '22px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomExtra(i)}
                      style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
                    >
                      <IconX />
                    </button>
                  </div>
                </div>
              ))}
              {(extras.custom_extras || []).length === 0 && (
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>Sem extras personalizados ainda.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Pré-visualização</p>
          <ServicePreviewCard
            titulo={serviceData.titulo}
            categoria={serviceData.categoria}
            packages={packages}
            ferramentas={serviceData.ferramentas}
          />
          <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-3)' }}>
            Assim ficará o teu serviço no marketplace.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          {error}
        </div>
      )}
    </StepContainer>
  )
}

// ─── Success ──────────────────────────────────────────────────────────────────

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
          Serviço publicado!
        </h1>
        <p className="text-base mb-8" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
          O teu serviço está agora <strong style={{ color: 'var(--text)' }}>visível no marketplace</strong>.
          Os clientes já podem encontrar e contratar os teus packages.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/marketplace?tab=servicos')} className="btn-primary btn-primary-lg">
            Ver no Marketplace →
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-outline" style={{ padding: '14px 24px' }}>
            Ir para Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CriarServico() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Step 1
  const [serviceData, setServiceData] = useState({
    titulo: '', categoria: '', descricao: '',
    ferramentas: [], tags_seo: [],
    imagem_preview: '', imagem_file: null,
  })

  // Step 2
  const [packages, setPackages] = useState(DEFAULT_PACKAGES)

  // Step 3
  const [extras, setExtras] = useState({
    entrega_rapida: false,
    entrega_rapida_preco: '',
    entrega_rapida_dias: '',
    formacao: false,
    formacao_preco: '',
    suporte_mensal: false,
    suporte_mensal_preco: '',
    custom_extras: [],
  })

  function updateService(key, val) {
    setServiceData(prev => ({ ...prev, [key]: val }))
  }

  const canProceed = {
    1: !!serviceData.titulo && !!serviceData.categoria && serviceData.descricao.length >= 20,
    2: packages.every(p => p.preco > 0 && p.entrega_dias > 0),
    3: true,
  }

  function goNext() {
    if (canProceed[step]) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goBack() {
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handlePublish() {
    setLoading(true)
    setError(null)

    try {
      const payload = {
        titulo: serviceData.titulo,
        categoria: serviceData.categoria,
        descricao: serviceData.descricao,
        ferramentas: serviceData.ferramentas,
        tags_seo: serviceData.tags_seo,
        packages: packages,
        extras: {
          entrega_rapida: extras.entrega_rapida ? { preco: extras.entrega_rapida_preco, dias: extras.entrega_rapida_dias } : null,
          formacao: extras.formacao ? { preco: extras.formacao_preco } : null,
          suporte_mensal: extras.suporte_mensal ? { preco: extras.suporte_mensal_preco } : null,
          custom: (extras.custom_extras || []).filter(e => e.nome),
        },
        preco_base: Math.min(...packages.map(p => p.preco || 0)),
        estado: 'publicado',
        ...(user ? { user_id: user.id } : {}),
        created_at: new Date().toISOString(),
      }

      // Upload cover image
      if (serviceData.imagem_file && user) {
        const ext = serviceData.imagem_file.name.split('.').pop()
        const path = `servicos/${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('servicos')
          .upload(path, serviceData.imagem_file, { upsert: true })
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('servicos').getPublicUrl(path)
          payload.imagem_url = urlData.publicUrl
        }
      }

      await supabase.from('servicos').insert(payload)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Erro ao publicar serviço. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return <SuccessScreen />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <ProgressBar current={step} />

      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6">
        <div
          className="pointer-events-none fixed inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,92,246,0.05) 0%, transparent 70%)', zIndex: 0 }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {step === 1 && <Step1 data={serviceData} onChange={updateService} />}
          {step === 2 && <Step2 packages={packages} onChange={setPackages} />}
          {step === 3 && (
            <Step3
              extras={extras}
              onExtras={setExtras}
              serviceData={serviceData}
              packages={packages}
              error={error}
            />
          )}
          <NavButtons
            step={step}
            onBack={goBack}
            onNext={goNext}
            onPublish={handlePublish}
            loading={loading}
            nextDisabled={!canProceed[step]}
          />
        </div>
      </div>
    </div>
  )
}
