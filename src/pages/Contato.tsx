import { abrirWhatsApp, LOJA_INFO } from '../lib/config'

export function Contato() {
  return (
    <div className="p-4 space-y-6 pt-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          Contato
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          Fale com a loja de forma rápida e simples.
        </p>
      </div>

      {/* Card de WhatsApp */}
      <div
        className="rounded-3xl p-5 shadow-sm space-y-4"
        style={{ backgroundColor: '#FAFAFF', border: '1px solid #D8B4FE' }}
      >
        <div>
          <p className="font-bold" style={{ color: '#1F2937' }}>
            {LOJA_INFO.nome}
          </p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            {LOJA_INFO.responsavel}
          </p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Moda infantil · Atendimento pelo WhatsApp
          </p>
        </div>
        <button
          onClick={() =>
            abrirWhatsApp('Olá! Gostaria de saber mais sobre a Bambolê Kids. 😊')
          }
          className="w-full py-3 rounded-2xl font-semibold text-white text-sm"
          style={{ backgroundColor: '#22C55E' }}
        >
          Chamar no WhatsApp
        </button>
      </div>

      {/* Informações da loja */}
      <div
        className="rounded-3xl p-5 shadow-sm space-y-4"
        style={{ backgroundColor: '#FAFAFF', border: '1px solid #D8B4FE' }}
      >
        <h3 className="font-semibold" style={{ color: '#1F2937' }}>
          Informações da loja
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Endereço', value: LOJA_INFO.endereco },
            { label: 'Horário', value: LOJA_INFO.horario },
            { label: 'Pagamento', value: LOJA_INFO.pagamento },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs uppercase tracking-wide" style={{ color: '#6B7280' }}>
                {label}
              </p>
              <p className="text-sm mt-0.5" style={{ color: '#1F2937' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
