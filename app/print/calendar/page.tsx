import { prisma } from "@/lib/prisma";
import { buildMonthDays, formatDate } from "@/lib/constants";

interface PrintCalendarProps {
  searchParams: { month?: string; scope?: string; supplierId?: string };
}

export default async function PrintCalendar({ searchParams }: PrintCalendarProps) {
  const month = searchParams.month ?? "2026-03";
  const scope = searchParams.scope ?? "team";
  const supplierId = searchParams.supplierId ? Number(searchParams.supplierId) : undefined;

  const [diaD, pix, oneOff] = await Promise.all([
    prisma.diaDReservation.findMany({
      where: {
        ...(supplierId ? { supplierId } : {}),
        date: {
          gte: new Date(`${month}-01T00:00:00`),
          lt: new Date(`${month}-31T23:59:59`)
        }
      },
      include: { supplier: true }
    }),
    prisma.pixReservation.findMany({
      where: {
        ...(supplierId ? { supplierId } : {}),
        weekStart: {
          gte: new Date(`${month}-01T00:00:00`),
          lt: new Date(`${month}-31T23:59:59`)
        }
      },
      include: { supplier: true }
    }),
    prisma.oneOffAction.findMany({
      where: {
        ...(supplierId ? { supplierId } : {}),
        date: {
          gte: new Date(`${month}-01T00:00:00`),
          lt: new Date(`${month}-31T23:59:59`)
        }
      },
      include: { supplier: true }
    })
  ]);

  const days = buildMonthDays(month);

  return (
    <div style={{ padding: 32, fontFamily: "Arial, sans-serif", color: "#0f172a" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Planner Fornecedores 2026</h1>
      <p style={{ fontSize: 12, marginBottom: 24 }}>
        Calendário {month} - {scope === "team" ? "Visão da Equipe" : `Fornecedor ${supplierId}`}
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #cbd5f5", paddingBottom: 6 }}>Data</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #cbd5f5", paddingBottom: 6 }}>Agenda</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => {
            const iso = formatDate(day);
            const diaEntries = diaD.filter((item) => formatDate(item.date) === iso);
            const pixEntries = pix.filter((item) => formatDate(item.weekStart) <= iso && formatDate(item.weekEnd) >= iso);
            const oneOffEntries = oneOff.filter((item) => formatDate(item.date) === iso);

            return (
              <tr key={iso}>
                <td style={{ padding: "6px 0", fontSize: 12, width: 90 }}>{iso}</td>
                <td style={{ padding: "6px 0", fontSize: 12 }}>
                  {diaEntries.map((entry) => (
                    <div key={`d-${entry.id}`}>Dia D: {entry.supplier.name}</div>
                  ))}
                  {pixEntries.map((entry) => (
                    <div key={`p-${entry.id}`}>PIX: {entry.supplier.name}</div>
                  ))}
                  {oneOffEntries.map((entry) => (
                    <div key={`o-${entry.id}`}>Avulsa: {entry.supplier.name}</div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
