import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-8">
      <div className="card">
        <h2 className="text-2xl font-semibold">Bem-vindo ao Planner Fornecedores 2026</h2>
        <p className="mt-2 text-sm text-slate-600">
          Planeje Dia D, Semana PIX, campanhas mensais e ações avulsas entre março e dezembro de 2026.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/supplier">
            Acessar área do fornecedor
          </Link>
          <Link className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600" href="/admin">
            Acessar visão da equipe
          </Link>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Reservas controladas",
            desc: "Bloqueio de conflitos para Dia D e Semana PIX com regras de capacidade."
          },
          {
            title: "Filtros inteligentes",
            desc: "Equipe pode filtrar por fornecedor, grupo e tipo de campanha."
          },
          {
            title: "Exportação",
            desc: "Baixe seus dados em CSV/JSON e gere PDF do calendário mensal."
          }
        ].map((item) => (
          <div key={item.title} className="card">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
