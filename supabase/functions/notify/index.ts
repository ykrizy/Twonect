import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'khalidshah1328@gmail.com'
const FROM_NAME = 'Twonect'
const BASE_URL = 'https://ykrizy.github.io/Twonect'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })
  const data = await res.json()
  if (!res.ok) console.error('Brevo error:', data)
  return data
}

function emailBase(content: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #07070C; padding: 40px 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: #111117; border: 1px solid #1e1e28; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div style="padding: 24px 32px; border-bottom: 1px solid #1e1e28; display: flex; align-items: center; gap: 10px;">
          <div style="width: 28px; height: 28px; background: #7C5CF6; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
              <line x1="12" y1="7" x2="6.5" y2="17"/><line x1="12" y1="7" x2="17.5" y2="17"/>
            </svg>
          </div>
          <span style="font-size: 18px; font-weight: 800; color: #F0F0F6; letter-spacing: -0.04em;">Twonect</span>
        </div>
        <!-- Body -->
        <div style="padding: 32px;">
          ${content}
        </div>
        <!-- Footer -->
        <div style="padding: 16px 32px; border-top: 1px solid #1e1e28; background: #0D0D13;">
          <p style="margin: 0; font-size: 12px; color: #4E4E66;">
            Recebeste este email porque tens conta na Twonect.
            <a href="${BASE_URL}" style="color: #A78BFA; text-decoration: none;">twonect.pt</a>
          </p>
        </div>
      </div>
    </div>
  `
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const body = await req.json()
  const { table, type, record, old_record } = body

  // ── Email de boas-vindas (chamado directamente do frontend após registo) ──
  if (type === 'welcome') {
    const { email, nome, perfil } = record as { email: string; nome: string; perfil: 'empresa' | 'especialista' }

    const isEmpresa = perfil === 'empresa'
    const ctaUrl = isEmpresa ? `${BASE_URL}/publicar-projeto` : `${BASE_URL}/marketplace?tab=projetos`
    const ctaLabel = isEmpresa ? 'Publicar o teu primeiro projeto →' : 'Explorar projetos disponíveis →'
    const subtitleLine = isEmpresa
      ? 'A tua conta de empresa está pronta. Publica o teu primeiro projeto e recebe propostas de especialistas verificados em menos de 48 horas.'
      : 'O teu perfil foi submetido com sucesso. A nossa equipa irá analisá-lo em 24 horas úteis. Enquanto isso, podes explorar os projetos disponíveis.'

    await sendEmail(
      email,
      `Bem-vindo à Twonect, ${nome}!`,
      emailBase(`
        <h2 style="margin: 0 0 8px; color: #F0F0F6; font-size: 22px; font-weight: 800; letter-spacing: -0.03em;">
          Bem-vindo à Twonect 👋
        </h2>
        <p style="color: #8888A6; margin: 0 0 20px; font-size: 15px;">Olá ${nome},</p>
        <p style="color: #c8c8d8; line-height: 1.65; margin: 0 0 28px; font-size: 15px;">
          ${subtitleLine}
        </p>

        <!-- Features -->
        <div style="background: #18181F; border: 1px solid #1e1e28; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
          ${isEmpresa ? `
          <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
            <span style="color: #34D399; font-size: 14px; margin-top: 2px;">✓</span>
            <p style="margin: 0; font-size: 14px; color: #c8c8d8;">Especialistas verificados disponíveis para o teu projeto</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
            <span style="color: #34D399; font-size: 14px; margin-top: 2px;">✓</span>
            <p style="margin: 0; font-size: 14px; color: #c8c8d8;">Match garantido em menos de 48 horas</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span style="color: #34D399; font-size: 14px; margin-top: 2px;">✓</span>
            <p style="margin: 0; font-size: 14px; color: #c8c8d8;">Pagamento por Escrow — só pagas quando aprovares</p>
          </div>
          ` : `
          <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
            <span style="color: #34D399; font-size: 14px; margin-top: 2px;">✓</span>
            <p style="margin: 0; font-size: 14px; color: #c8c8d8;">Perfil criado — verificação em curso (24h úteis)</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
            <span style="color: #34D399; font-size: 14px; margin-top: 2px;">✓</span>
            <p style="margin: 0; font-size: 14px; color: #c8c8d8;">Acesso a projetos qualificados de empresas portuguesas</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span style="color: #34D399; font-size: 14px; margin-top: 2px;">✓</span>
            <p style="margin: 0; font-size: 14px; color: #c8c8d8;">Pagamento garantido via Escrow em todos os projetos</p>
          </div>
          `}
        </div>

        <a href="${ctaUrl}"
           style="display: inline-block; background: #7C5CF6; color: white; text-decoration: none;
                  padding: 13px 28px; border-radius: 100px; font-weight: 600; font-size: 15px; letter-spacing: -0.01em;">
          ${ctaLabel}
        </a>
      `)
    )
  }

  // ── Nova candidatura → notificar empresa ─────────────────────────────────
  if (table === 'propostas' && type === 'INSERT') {
    const { data: projeto } = await supabase
      .from('projetos')
      .select('titulo, empresa_id, empresas(email, nome, nome_responsavel)')
      .eq('id', record.projeto_id)
      .single()

    const { data: especialista } = await supabase
      .from('especialistas')
      .select('nome')
      .eq('id', record.especialista_id)
      .single()

    if (projeto && especialista) {
      const empresa = projeto.empresas as { email: string; nome: string; nome_responsavel: string }
      await sendEmail(
        empresa.email,
        `Nova candidatura — "${projeto.titulo}"`,
        emailBase(`
          <h2 style="margin: 0 0 8px; color: #F0F0F6; font-size: 20px; font-weight: 800; letter-spacing: -0.03em;">
            Nova candidatura recebida 🎉
          </h2>
          <p style="color: #8888A6; margin: 0 0 20px;">Olá ${empresa.nome_responsavel},</p>
          <p style="color: #c8c8d8; line-height: 1.65; margin: 0 0 28px; font-size: 15px;">
            <strong style="color: #F0F0F6;">${especialista.nome}</strong> candidatou-se ao teu projeto
            <strong style="color: #F0F0F6;">"${projeto.titulo}"</strong>.
            Acede ao dashboard para ver a candidatura completa e responder.
          </p>
          <a href="${BASE_URL}/dashboard"
             style="display: inline-block; background: #7C5CF6; color: white; text-decoration: none;
                    padding: 13px 28px; border-radius: 100px; font-weight: 600; font-size: 15px;">
            Ver candidatura →
          </a>
        `)
      )
    }
  }

  // ── Candidatura aceite ou rejeitada → notificar especialista ─────────────
  if (
    table === 'propostas' &&
    type === 'UPDATE' &&
    old_record?.estado === 'pendente' &&
    (record.estado === 'aceite' || record.estado === 'rejeitado')
  ) {
    const { data: especialista } = await supabase
      .from('especialistas')
      .select('nome, email')
      .eq('id', record.especialista_id)
      .single()

    const { data: projeto } = await supabase
      .from('projetos')
      .select('titulo')
      .eq('id', record.projeto_id)
      .single()

    if (especialista && projeto) {
      const aceite = record.estado === 'aceite'
      await sendEmail(
        especialista.email,
        aceite
          ? `✅ Candidatura aceite — "${projeto.titulo}"`
          : `A tua candidatura a "${projeto.titulo}"`,
        emailBase(`
          <h2 style="margin: 0 0 8px; color: #F0F0F6; font-size: 20px; font-weight: 800; letter-spacing: -0.03em;">
            ${aceite ? '✅ Candidatura aceite!' : 'Candidatura não selecionada'}
          </h2>
          <p style="color: #8888A6; margin: 0 0 20px;">Olá ${especialista.nome},</p>
          ${aceite
            ? `<p style="color: #c8c8d8; line-height: 1.65; margin: 0 0 28px; font-size: 15px;">
                A tua candidatura ao projeto <strong style="color: #F0F0F6;">"${projeto.titulo}"</strong>
                foi <strong style="color: #34D399;">aceite</strong>!
                A empresa irá entrar em contacto contigo em breve.
               </p>
               <a href="${BASE_URL}/dashboard"
                  style="display: inline-block; background: #7C5CF6; color: white; text-decoration: none;
                         padding: 13px 28px; border-radius: 100px; font-weight: 600; font-size: 15px;">
                 Ver no dashboard →
               </a>`
            : `<p style="color: #c8c8d8; line-height: 1.65; margin: 0 0 28px; font-size: 15px;">
                A tua candidatura ao projeto <strong style="color: #F0F0F6;">"${projeto.titulo}"</strong>
                não foi selecionada desta vez. Continua a explorar outros projetos no Marketplace!
               </p>
               <a href="${BASE_URL}/marketplace"
                  style="display: inline-block; background: #7C5CF6; color: white; text-decoration: none;
                         padding: 13px 28px; border-radius: 100px; font-weight: 600; font-size: 15px;">
                 Ver mais projetos →
               </a>`
          }
        `)
      )
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
})
