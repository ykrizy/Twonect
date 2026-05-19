import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useMeta from '@/hooks/useMeta'
import Reveal from '@/components/ui/Reveal'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

const TIPOS = ['RPA', 'Integrações', 'IA / LLMs', 'Marketing Automation', 'BI & Data', 'Custom Dev', 'Outro']
const SETORES = ['E-commerce', 'Logística', 'Saúde', 'Finanças', 'Tecnologia', 'Retalho', 'Indústria', 'Outro']
const PRAZOS = [
  { value: 'urgent', label: 'Urgente (menos de 1 semana)' },
  { value: 'short', label: 'Curto (1–2 semanas)' },
  { value: 'normal', label: 'Normal (1 mês)' },
  { value: 'flexible', label: 'Flexível (mais de 1 mês)' },
]

export default function PublicarProjeto() {
  useMeta({ title: 'Publicar Projeto', description: 'Publica o teu projeto e recebe propostas de especialistas.' })

  const { user } = useAuth()
  const navigate = useNavigate()

  const [fields, setFields] = useState({
    titulo: '', descricao: '', tipo_automacao: 'RPA',
    orcamento: 3000, prazo: 'normal', setor: 'Tecnologia',
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    try {
      // 1. Buscar o id da empresa do utilizador
      const { data: empresa } = await supabase
        .from('empresas')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!empresa) throw new Error('Perfil de empresa não encontrado. Certifica-te de que estás registado como empresa.')

      // 2. Inserir projeto diretamente como ativo — publicação gratuita
      const { error: projetoErr } = await supabase
        .from('projetos')
        .insert({
          empresa_id: empresa.id,
          ...fields,
          orcamento: Number(fields.orcamento),
          estado: 'ativo',
        })

      if (projetoErr) throw projetoErr

      // 3. Redirecionar para o dashboard
      navigate('/dashboard')

    } catch (err) {
      setErro(err.message || 'Erro ao publicar projeto. Tenta novamente.')
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,92,246,0.07) 0%, transparent 70%)' }}
      />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="mb-8">
            <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
              Publicar Projeto
            </h1>
            <p style={{ color: 'var(--text-2)' }}>
              Preenche os detalhes e publica gratuitamente. Recebem propostas em 48h.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Título do projeto *</label>
              <input type="text" required className="form-input" placeholder="ex: Automatizar faturação com Make" value={fields.titulo} onChange={set('titulo')} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Descrição *</label>
              <textarea required rows={4} className="form-input" style={{ resize: 'vertical' }} placeholder="Descreve o que precisas de automatizar..." value={fields.descricao} onChange={set('descricao')} />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Tipo de automação</label>
                <select className="form-input w-full" value={fields.tipo_automacao} onChange={set('tipo_automacao')}>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Setor</label>
                <select className="form-input w-full" value={fields.setor} onChange={set('setor')}>
                  {SETORES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Orçamento (€)</label>
                <input type="number" min={500} className="form-input" value={fields.orcamento} onChange={set('orcamento')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Prazo</label>
                <select className="form-input w-full" value={fields.prazo} onChange={set('prazo')}>
                  {PRAZOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>

            {erro && (
              <p className="text-sm px-4 py-3 rounded-lg" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                {erro}
              </p>
            )}

            {/* Info gratuito */}
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#34d399' }}>Publicação gratuita</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>Recebe propostas de especialistas verificados em 48h · Sem custos</p>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-primary-lg w-full justify-center" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'A publicar projeto…' : 'Publicar Projeto Gratuitamente →'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--text-3)' }}>
              O teu projeto ficará visível a todos os especialistas verificados na plataforma.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
