import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
const ESTADOS = [
  { value: 'aberto', label: 'Aberto' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluido', label: 'Concluído' },
]
const ESTADO_STYLE = {
  aberto: { badge: 'badge-emerald', label: 'Aberto' },
  em_andamento: { badge: 'badge-amber', label: 'Em andamento' },
  concluido: { badge: 'badge-indigo', label: 'Concluído' },
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 20, interactive = false, onSelect }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          width={size} height={size}
          viewBox="0 0 24 24"
          fill={(hover || rating) >= i ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ cursor: interactive ? 'pointer' : 'default', transition: 'fill 0.1s' }}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onSelect?.(i)}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Projeto() {
  useMeta({ title: 'Projeto', description: 'Ver detalhes do projeto.' })

  const { id } = useParams()
  const { user, perfil } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [projeto, setProjeto] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [empresaId, setEmpresaId] = useState(null)
  const [especialistaId, setEspecialistaId] = useState(null)
  const [minhaProposta, setMinhaProposta] = useState(null)
  const [propostas, setPropostas] = useState([])
  const [avaliacoes, setAvaliacoes] = useState([])

  // edit/delete state
  const [editMode, setEditMode] = useState(false)
  const [fields, setFields] = useState({})
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // concluir + avaliação
  const [concluindo, setConcluindo] = useState(false)
  const [avaliacaoModal, setAvaliacaoModal] = useState(null)
  const [ratingTemp, setRatingTemp] = useState(0)
  const [comentarioTemp, setComentarioTemp] = useState('')
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false)
  const [avaliacaoEnviada, setAvaliacaoEnviada] = useState(false)

  // pagamento escrow
  const [pagamento, setPagamento] = useState(null)
  const [iniciandoPagamento, setIniciandoPagamento] = useState(false)
  const [toastErro, setToastErro] = useState(null)

  useEffect(() => {
    if (!id || !user || !perfil) return

    async function load() {
      const { data: proj } = await supabase
        .from('projetos')
        .select('*, empresas(id, nome, nome_responsavel, email)')
        .eq('id', id)
        .maybeSingle()

      if (!proj) { navigate('/dashboard'); return }

      setProjeto(proj)
      setFields({
        titulo: proj.titulo,
        descricao: proj.descricao,
        tipo_automacao: proj.tipo_automacao,
        orcamento: proj.orcamento,
        prazo: proj.prazo,
        setor: proj.setor,
        estado: proj.estado,
      })

      if (perfil === 'empresa') {
        const { data: emp } = await supabase
          .from('empresas').select('id').eq('user_id', user.id).maybeSingle()
        if (!emp || emp.id !== proj.empresa_id) { navigate('/dashboard'); return }

        setIsOwner(true)
        setEmpresaId(emp.id)

        const [{ data: props }, { data: avs }, { data: pg }] = await Promise.all([
          supabase
            .from('propostas')
            .select('*, especialistas(id, nome, email, pais, anos_experiencia, skills, preco_hora, bio, user_id)')
            .eq('projeto_id', id)
            .order('created_at', { ascending: false }),
          supabase
            .from('avaliacoes')
            .select('*')
            .eq('projeto_id', id)
            .eq('empresa_id', emp.id),
          supabase
            .from('pagamentos')
            .select('*')
            .eq('projeto_id', id)
            .maybeSingle(),
        ])
        setPropostas(props || [])
        setAvaliacoes(avs || [])
        setPagamento(pg || null)

      } else if (perfil === 'especialista') {
        const { data: esp } = await supabase
          .from('especialistas').select('id').eq('user_id', user.id).maybeSingle()
        if (!esp) { navigate('/dashboard'); return }

        const { data: prop } = await supabase
          .from('propostas').select('*')
          .eq('projeto_id', id).eq('especialista_id', esp.id).maybeSingle()
        if (!prop) { navigate('/marketplace'); return }

        setEspecialistaId(esp.id)
        setEmpresaId(proj.empresa_id)
        setMinhaProposta(prop)
      } else {
        navigate('/dashboard'); return
      }

      setLoading(false)
    }

    load()
  }, [id, user, perfil, navigate])

  async function handleProposta(propostaId, novoEstado) {
    await supabase.from('propostas').update({ estado: novoEstado }).eq('id', propostaId)

    if (novoEstado === 'aceite') {
      const proposta = propostas.find(p => p.id === propostaId)
      const pendentes = propostas.filter(p => p.id !== propostaId && p.estado === 'pendente')

      // Rejeitar automaticamente pendentes
      if (pendentes.length > 0) {
        await supabase.from('propostas').update({ estado: 'rejeitado' }).in('id', pendentes.map(p => p.id))
        // Notificar rejeitados
        for (const p of pendentes) {
          if (p.especialistas?.user_id) {
            supabase.from('notificacoes').insert({
              user_id: p.especialistas.user_id,
              tipo: 'proposta_rejeitada',
              titulo: 'Candidatura não selecionada',
              mensagem: `Outra proposta foi escolhida para "${projeto.titulo}".`,
              link: `/projeto/${id}`,
            })
          }
        }
      }

      setPropostas(prev => prev.map(p => {
        if (p.id === propostaId) return { ...p, estado: 'aceite' }
        if (p.estado === 'pendente') return { ...p, estado: 'rejeitado' }
        return p
      }))

      // Projeto → em andamento
      if (projeto.estado === 'aberto') {
        await supabase.from('projetos').update({ estado: 'em_andamento' }).eq('id', id)
        setProjeto(prev => ({ ...prev, estado: 'em_andamento' }))
      }

      // Notificar especialista aceite
      if (proposta?.especialistas?.user_id) {
        supabase.from('notificacoes').insert({
          user_id: proposta.especialistas.user_id,
          tipo: 'proposta_aceite',
          titulo: '✅ Candidatura aceite!',
          mensagem: `A empresa aceitou a tua candidatura para "${projeto.titulo}".`,
          link: `/projeto/${id}`,
        })
      }
    } else {
      // Rejeição manual
      const proposta = propostas.find(p => p.id === propostaId)
      setPropostas(prev => prev.map(p => p.id === propostaId ? { ...p, estado: novoEstado } : p))
      if (proposta?.especialistas?.user_id) {
        supabase.from('notificacoes').insert({
          user_id: proposta.especialistas.user_id,
          tipo: 'proposta_rejeitada',
          titulo: 'Candidatura não selecionada',
          mensagem: `A empresa não selecionou a tua candidatura para "${projeto.titulo}".`,
          link: `/projeto/${id}`,
        })
      }
    }
  }

  async function handleEscrow(propostaAceiteLocal) {
    const proposta = propostaAceiteLocal
    if (!proposta) return
    const orcamento = Number(projeto?.orcamento)
    if (!orcamento || orcamento <= 0) {
      setToastErro('O projeto não tem orçamento definido. Edita o projeto e define um valor.')
      return
    }
    setIniciandoPagamento(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            plano: 'escrow_projeto',
            empresa_id: empresaId,
            projeto_id: id,
            especialista_id: proposta.especialistas?.id,
            valor: orcamento,
            success_url: `${window.location.origin}/Twonect/projeto/${id}?escrow=ok`,
            cancel_url:  `${window.location.origin}/Twonect/projeto/${id}?escrow=cancelado`,
          }),
        }
      )
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      if (!json.url) throw new Error('Resposta inválida do servidor de pagamento.')
      window.location.href = json.url
    } catch (err) {
      setToastErro('Erro ao iniciar pagamento: ' + err.message)
      setIniciandoPagamento(false)
    }
  }

  async function handleConcluir() {
    setConcluindo(true)
    await supabase.from('projetos').update({ estado: 'concluido' }).eq('id', id)
    setProjeto(prev => ({ ...prev, estado: 'concluido' }))
    setConcluindo(false)
    const aceite = propostas.find(p => p.estado === 'aceite')
    if (aceite) {
      setRatingTemp(0)
      setComentarioTemp('')
      setAvaliacaoEnviada(false)
      setAvaliacaoModal({ id: aceite.especialistas?.id, nome: aceite.especialistas?.nome })
      // Notificar especialista
      if (aceite.especialistas?.user_id) {
        supabase.from('notificacoes').insert({
          user_id: aceite.especialistas.user_id,
          tipo: 'projeto_concluido',
          titulo: '🎉 Projeto concluído!',
          mensagem: `O projeto "${projeto.titulo}" foi marcado como concluído. O teu pagamento será processado.`,
          link: `/projeto/${id}`,
        })
      }
    }
  }

  async function handleAvaliar(e) {
    e.preventDefault()
    if (!ratingTemp) return
    setEnviandoAvaliacao(true)
    const { error } = await supabase.from('avaliacoes').insert({
      projeto_id: id,
      empresa_id: empresaId,
      especialista_id: avaliacaoModal.id,
      rating: ratingTemp,
      comentario: comentarioTemp.trim() || null,
    })
    setEnviandoAvaliacao(false)
    if (!error) {
      setAvaliacaoEnviada(true)
      setAvaliacoes(prev => [...prev, { especialista_id: avaliacaoModal.id, rating: ratingTemp }])
      setTimeout(() => setAvaliacaoModal(null), 2000)
    }
  }

  const setField = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }))

  async function handleSave(e) {
    e.preventDefault()
    setErro(null)
    setSaving(true)
    const { error } = await supabase.from('projetos').update({
      titulo: fields.titulo,
      descricao: fields.descricao,
      tipo_automacao: fields.tipo_automacao,
      orcamento: Number(fields.orcamento),
      prazo: fields.prazo,
      setor: fields.setor,
      estado: fields.estado,
    }).eq('id', id)
    setSaving(false)
    if (error) { setErro('Erro ao guardar.') }
    else {
      setProjeto(prev => ({ ...prev, ...fields, orcamento: Number(fields.orcamento) }))
      setEditMode(false)
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from('projetos').delete().eq('id', id)
    if (error) { setErro('Erro ao apagar.'); setDeleting(false); setConfirmDelete(false) }
    else { navigate('/dashboard') }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
    </div>
  )

  const estadoInfo = ESTADO_STYLE[projeto.estado] ?? { badge: 'badge-indigo', label: projeto.estado }
  const prazoLabel = PRAZOS.find(p => p.value === projeto.prazo)?.label ?? projeto.prazo
  const propostaAceite = propostas.find(p => p.estado === 'aceite')
  const jaAvaliou = avaliacoes.some(a => a.especialista_id === propostaAceite?.especialistas?.id)
  const escrowPago = pagamento?.estado === 'escrow' || pagamento?.estado === 'libertado'
  // URL param de retorno do Stripe
  const escrowParam = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('escrow')

  // ── Vista do especialista ─────────────────────────────────────────────────
  if (!isOwner && minhaProposta) {
    const propStatus = minhaProposta.estado
    return (
      <section className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,92,246,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">

          <Reveal>
            <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--text-3)' }}>
              <Link to="/dashboard" style={{ color: 'var(--text-3)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
              >← Dashboard</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-2)' }}>{projeto.titulo}</span>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-5">
              <span className={`badge ${estadoInfo.badge} mb-3`}>{estadoInfo.label}</span>
              <h1 className="font-display text-2xl" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>{projeto.titulo}</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
                {projeto.empresas?.nome} · Criado em {new Date(projeto.created_at).toLocaleDateString('pt-PT')}
              </p>
            </div>
          </Reveal>

          {/* Estado da candidatura */}
          <Reveal delay={40}>
            <div className="card p-5 mb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>A tua candidatura</p>
                  <span className={`badge ${propStatus === 'aceite' ? 'badge-emerald' : propStatus === 'rejeitado' ? 'badge-red' : 'badge-amber'}`}>
                    {propStatus === 'aceite' ? '✅ Aceite' : propStatus === 'rejeitado' ? '❌ Rejeitada' : '⏳ Aguarda resposta'}
                  </span>
                </div>
                {minhaProposta.preco_proposto && (
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>A tua proposta</p>
                    <p className="font-bold text-lg" style={{ color: 'var(--brand-light)' }}>€{Number(minhaProposta.preco_proposto).toLocaleString('pt-PT')}</p>
                  </div>
                )}
              </div>
              {minhaProposta.mensagem && (
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '12px' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>A tua mensagem</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{minhaProposta.mensagem}</p>
                </div>
              )}
            </div>
          </Reveal>

          {/* Detalhes do projeto */}
          <Reveal delay={80}>
            <div className="card p-6 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Descrição</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>{projeto.descricao}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: 'Tipo de automação', value: projeto.tipo_automacao },
                    { label: 'Setor', value: projeto.setor },
                    { label: 'Orçamento', value: `€${Number(projeto.orcamento).toLocaleString('pt-PT')}` },
                    { label: 'Prazo', value: prazoLabel },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>{label}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                {propStatus === 'aceite' ? (
                  <Link
                    to={`/mensagens?projeto=${id}`}
                    className="btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '10px 20px' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Abrir chat com {projeto.empresas?.nome}
                  </Link>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                    💡 O chat fica disponível depois de a empresa aceitar a tua candidatura.
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    )
  }

  // ── Vista da empresa (owner) ──────────────────────────────────────────────
  return (
    <section className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,92,246,0.06) 0%, transparent 70%)' }} />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">

        <Reveal>
          <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--text-3)' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-3)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-light)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
            >← Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-2)' }}>{projeto.titulo}</span>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className={`badge ${estadoInfo.badge} mb-3`}>{estadoInfo.label}</span>
              <h1 className="font-display text-2xl" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>{projeto.titulo}</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
                Criado em {new Date(projeto.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {!editMode && projeto.estado !== 'concluido' && (
              <button onClick={() => setEditMode(true)} className="btn-ghost flex-shrink-0" style={{ fontSize: '13.5px', padding: '8px 16px' }}>
                ✏️ Editar
              </button>
            )}
          </div>
        </Reveal>

        {/* Banner: escrow de regresso do Stripe */}
        {escrowParam === 'ok' && escrowPago && !editMode && (
          <Reveal>
            <div className="rounded-2xl p-4 mb-4 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <span style={{ fontSize: '20px' }}>🔐</span>
              <p className="text-sm font-medium" style={{ color: '#10b981' }}>Pagamento em escrow confirmado! O especialista será pago na conclusão do projeto.</p>
            </div>
          </Reveal>
        )}

        {/* Banner: Pagar escrow — aparece quando proposta aceite mas escrow ainda não pago */}
        {propostaAceite && !escrowPago && projeto.estado !== 'concluido' && !editMode && (
          <Reveal>
            <div
              className="rounded-2xl p-5 mb-4 flex items-center justify-between gap-4"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: '#f59e0b' }}>🔐 Depositar valor em escrow</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                  Especialista aceite:{' '}
                  <strong style={{ color: 'var(--text-2)' }}>{propostaAceite.especialistas?.nome}</strong>.
                  {' '}Orçamento de <strong style={{ color: 'var(--text-2)' }}>€{Number(projeto.orcamento).toLocaleString('pt-PT')}</strong> fica em custódia e é libertado na conclusão.
                </p>
              </div>
              <button
                onClick={() => handleEscrow(propostaAceite)}
                disabled={iniciandoPagamento}
                className="btn-primary flex-shrink-0"
                style={{ fontSize: '13px', padding: '9px 18px', whiteSpace: 'nowrap', opacity: iniciandoPagamento ? 0.7 : 1 }}
              >
                {iniciandoPagamento ? 'A redirecionar…' : `Pagar €${Number(projeto.orcamento).toLocaleString('pt-PT')} →`}
              </button>
            </div>
          </Reveal>
        )}

        {/* Banner: Marcar como Concluído — só depois do escrow estar pago */}
        {propostaAceite && escrowPago && projeto.estado !== 'concluido' && !editMode && (
          <Reveal>
            <div
              className="rounded-2xl p-5 mb-4 flex items-center justify-between gap-4"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: '#10b981' }}>🔐 Projeto em andamento · Escrow ativo</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                  A trabalhar com {propostaAceite.especialistas?.nome}. Quando o trabalho estiver completo, marca como concluído para libertar o pagamento.
                </p>
              </div>
              <button
                onClick={handleConcluir}
                disabled={concluindo}
                className="flex-shrink-0"
                style={{
                  padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10b981', cursor: concluindo ? 'not-allowed' : 'pointer',
                  opacity: concluindo ? 0.7 : 1, whiteSpace: 'nowrap',
                }}
              >
                {concluindo ? 'A concluir…' : '✅ Marcar como Concluído'}
              </button>
            </div>
          </Reveal>
        )}

        {/* Banner: projeto concluído — avaliar */}
        {projeto.estado === 'concluido' && propostaAceite && !jaAvaliou && (
          <Reveal>
            <button
              onClick={() => { setRatingTemp(0); setComentarioTemp(''); setAvaliacaoEnviada(false); setAvaliacaoModal({ id: propostaAceite.especialistas?.id, nome: propostaAceite.especialistas?.nome }) }}
              className="w-full rounded-2xl p-5 mb-4 flex items-center justify-between gap-4 text-left"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', cursor: 'pointer' }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: '#f59e0b' }}>⭐ Avalia o especialista</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                  Deixa uma avaliação para {propostaAceite.especialistas?.nome}. Ajuda outros clientes a escolher.
                </p>
              </div>
              <span style={{ color: '#f59e0b', fontSize: '20px', flexShrink: 0 }}>→</span>
            </button>
          </Reveal>
        )}

        {sucesso && (
          <Reveal>
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ color: '#10b981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              ✅ Projeto atualizado com sucesso.
            </div>
          </Reveal>
        )}

        <Reveal delay={80}>
          <div className="rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {editMode ? (
              // ── Formulário de edição ──
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Título *</label>
                  <input type="text" required className="form-input" value={fields.titulo} onChange={setField('titulo')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Descrição *</label>
                  <textarea required rows={4} className="form-input" style={{ resize: 'vertical' }} value={fields.descricao} onChange={setField('descricao')} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Tipo de automação</label>
                    <select className="form-input w-full" value={fields.tipo_automacao} onChange={setField('tipo_automacao')}>
                      {TIPOS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Setor</label>
                    <select className="form-input w-full" value={fields.setor} onChange={setField('setor')}>
                      {SETORES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Orçamento (€)</label>
                    <input type="number" min={500} className="form-input" value={fields.orcamento} onChange={setField('orcamento')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)' }}>Prazo</label>
                    <select className="form-input w-full" value={fields.prazo} onChange={setField('prazo')}>
                      {PRAZOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>
                {/* Estado gerido automaticamente pelo sistema — não exposto na edição */}
                {erro && <p className="text-sm px-4 py-3 rounded-lg" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>{erro}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary btn-primary-lg" style={{ opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'A guardar…' : 'Guardar alterações →'}
                  </button>
                  <button type="button" onClick={() => { setEditMode(false); setErro(null) }} className="btn-ghost" style={{ fontSize: '14px', padding: '12px 20px' }}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              // ── Modo detalhe ──
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Descrição</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>{projeto.descricao}</p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {[
                      { label: 'Tipo de automação', value: projeto.tipo_automacao },
                      { label: 'Setor', value: projeto.setor },
                      { label: 'Orçamento', value: `€${Number(projeto.orcamento).toLocaleString('pt-PT')}` },
                      { label: 'Prazo', value: prazoLabel },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>{label}</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Propostas */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--text)' }}>
                    Propostas recebidas
                    <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-3)' }}>({propostas.length})</span>
                  </h3>

                  {propostas.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--text-3)' }}>Ainda não recebeste nenhuma proposta.</p>
                  ) : (
                    <div className="space-y-4">
                      {propostas.map(prop => (
                        <div key={prop.id} className="rounded-xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                          {/* Header do especialista */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                                style={{ background: 'rgba(124,92,246,0.15)', color: 'var(--brand-light)', border: '1px solid rgba(124,92,246,0.2)' }}
                              >
                                {prop.especialistas?.nome?.split(' ').map(w => w[0]).slice(0, 2).join('') || '?'}
                              </div>
                              <div>
                                <Link
                                  to={`/especialista/${prop.especialistas?.id}`}
                                  style={{ textDecoration: 'none' }}
                                >
                                  <p
                                    className="font-semibold text-sm"
                                    style={{ color: 'var(--text)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-light)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                                  >
                                    {prop.especialistas?.nome}
                                    <span className="ml-1 text-xs" style={{ color: 'var(--text-3)' }}>↗</span>
                                  </p>
                                </Link>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                                  {prop.especialistas?.pais}
                                  {prop.especialistas?.anos_experiencia && ` · ${prop.especialistas.anos_experiencia} anos exp.`}
                                  {prop.preco_proposto && (
                                    <span className="ml-2 font-semibold" style={{ color: 'var(--brand-light)' }}>
                                      €{Number(prop.preco_proposto).toLocaleString('pt-PT')}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <span className={`badge flex-shrink-0 ${prop.estado === 'aceite' ? 'badge-emerald' : prop.estado === 'rejeitado' ? 'badge-red' : 'badge-amber'}`}>
                              {prop.estado === 'aceite' ? '✅ Aceite' : prop.estado === 'rejeitado' ? '❌ Rejeitado' : '⏳ Pendente'}
                            </span>
                          </div>

                          {/* Mensagem */}
                          {prop.mensagem && (
                            <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>{prop.mensagem}</p>
                          )}

                          {/* Skills */}
                          {prop.especialistas?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {prop.especialistas.skills.slice(0, 5).map(s => (
                                <span key={s} className="badge badge-indigo" style={{ fontSize: '10px' }}>{s}</span>
                              ))}
                            </div>
                          )}

                          {/* Ações */}
                          <div className="flex gap-2 flex-wrap">
                            {prop.estado === 'pendente' && (
                              <>
                                <button
                                  onClick={() => handleProposta(prop.id, 'aceite')}
                                  className="btn-primary"
                                  style={{ fontSize: '12px', padding: '6px 16px' }}
                                >
                                  ✅ Aceitar
                                </button>
                                <button
                                  onClick={() => handleProposta(prop.id, 'rejeitado')}
                                  style={{ fontSize: '12px', padding: '6px 16px', borderRadius: '8px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', cursor: 'pointer' }}
                                >
                                  ❌ Rejeitar
                                </button>
                              </>
                            )}
                            {prop.estado === 'aceite' && (
                              <>
                                <Link
                                  to={`/mensagens?projeto=${id}&esp=${prop.especialistas?.id}`}
                                  className="btn-ghost"
                                  style={{ fontSize: '12px', padding: '6px 14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                  </svg>
                                  Chat com {prop.especialistas?.nome?.split(' ')[0]}
                                </Link>
                                <Link
                                  to={`/especialista/${prop.especialistas?.id}`}
                                  className="btn-ghost"
                                  style={{ fontSize: '12px', padding: '6px 14px', textDecoration: 'none' }}
                                >
                                  Ver perfil →
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ações do projeto */}
                {projeto.estado !== 'concluido' && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }} className="flex gap-3 flex-wrap">
                    {propostaAceite && !escrowPago && (
                      <button
                        onClick={() => handleEscrow(propostaAceite)}
                        disabled={iniciandoPagamento}
                        style={{
                          fontSize: '14px', padding: '10px 20px', borderRadius: '10px', fontWeight: 600,
                          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)',
                          color: '#f59e0b', cursor: iniciandoPagamento ? 'not-allowed' : 'pointer',
                          opacity: iniciandoPagamento ? 0.7 : 1, whiteSpace: 'nowrap',
                        }}
                      >
                        {iniciandoPagamento ? 'A redirecionar…' : `🔐 Pagar €${Number(projeto.orcamento).toLocaleString('pt-PT')} →`}
                      </button>
                    )}
                    <button onClick={() => setEditMode(true)} className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px' }}>
                      ✏️ Editar projeto
                    </button>
                    <button
                      onClick={() => setConfirmDelete(true)}
                      style={{ fontSize: '14px', padding: '10px 20px', borderRadius: '10px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171', cursor: 'pointer', fontWeight: 500 }}
                    >
                      🗑️ Apagar projeto
                    </button>
                    <Link to="/dashboard" className="btn-ghost" style={{ fontSize: '14px', padding: '10px 20px' }}>← Voltar</Link>
                  </div>
                )}

                {projeto.estado === 'concluido' && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <Link to="/dashboard" className="btn-ghost" style={{ fontSize: '14px', padding: '10px 20px' }}>← Voltar ao Dashboard</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Toast de erro de pagamento */}
      {toastErro && (
        <div
          className="fixed bottom-6 left-1/2 z-50 px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3"
          style={{
            transform: 'translateX(-50%)',
            background: 'rgba(248,113,113,0.12)',
            border: '1px solid rgba(248,113,113,0.35)',
            backdropFilter: 'blur(12px)',
            maxWidth: '420px',
            width: 'calc(100vw - 32px)',
          }}
        >
          <span style={{ fontSize: '18px', flexShrink: 0 }}>❌</span>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-0.5" style={{ color: '#f87171' }}>Erro no pagamento</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{toastErro}</p>
          </div>
          <button onClick={() => setToastErro(null)} style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, fontSize: '16px' }}>✕</button>
        </div>
      )}

      {/* Modal: confirmação de eliminação */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="rounded-2xl p-8 w-full max-w-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-4xl mb-4 text-center">🗑️</div>
            <h2 className="font-heading text-xl text-center mb-2" style={{ color: 'var(--text)' }}>Apagar projeto?</h2>
            <p className="text-sm text-center mb-6" style={{ color: 'var(--text-2)' }}>
              Esta ação é <strong>irreversível</strong>. O projeto "<span style={{ color: 'var(--text)' }}>{projeto?.titulo}</span>" será apagado permanentemente.
            </p>
            {erro && (
              <p className="text-sm px-4 py-3 rounded-lg mb-4" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                {erro}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? 'A apagar…' : 'Sim, apagar'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="btn-ghost flex-1" style={{ fontSize: '14px', padding: '12px' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Avaliação */}
      {avaliacaoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => !avaliacaoEnviada && setAvaliacaoModal(null)}
        >
          <div
            className="rounded-2xl p-8 w-full max-w-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            {avaliacaoEnviada ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="font-heading text-xl mb-2" style={{ color: 'var(--text)' }}>Obrigado!</h2>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>A tua avaliação foi registada com sucesso.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto mb-3"
                    style={{ background: 'rgba(124,92,246,0.15)', color: 'var(--brand-light)', border: '1px solid rgba(124,92,246,0.25)' }}
                  >
                    {avaliacaoModal.nome?.split(' ').map(w => w[0]).slice(0, 2).join('') || '?'}
                  </div>
                  <h2 className="font-heading text-xl" style={{ color: 'var(--text)' }}>Avaliar {avaliacaoModal.nome?.split(' ')[0]}</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Como correu o projeto?</p>
                </div>

                <form onSubmit={handleAvaliar} className="space-y-5">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Classificação *</p>
                    <Stars rating={ratingTemp} size={32} interactive onSelect={setRatingTemp} />
                    {ratingTemp > 0 && (
                      <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                        {['', 'Mau', 'Razoável', 'Bom', 'Muito bom', 'Excelente'][ratingTemp]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>
                      Comentário <span style={{ fontWeight: 400 }}>(opcional)</span>
                    </label>
                    <textarea
                      rows={3}
                      className="form-input"
                      placeholder="Descreve a tua experiência com este especialista..."
                      style={{ resize: 'none', fontSize: '13px' }}
                      value={comentarioTemp}
                      onChange={e => setComentarioTemp(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={!ratingTemp || enviandoAvaliacao}
                      className="btn-primary flex-1"
                      style={{ opacity: (!ratingTemp || enviandoAvaliacao) ? 0.6 : 1 }}
                    >
                      {enviandoAvaliacao ? 'A enviar…' : 'Publicar avaliação →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvaliacaoModal(null)}
                      className="btn-ghost"
                      style={{ fontSize: '13px', padding: '10px 16px' }}
                    >
                      Agora não
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
