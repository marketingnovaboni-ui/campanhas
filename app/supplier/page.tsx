"use client";

import { useEffect, useMemo, useState } from "react";
import { BIMESTERS, CAMPAIGN_MONTHS, DIA_D_TYPES } from "@/lib/constants";

interface Supplier {
  id: number;
  name: string;
  code: string;
  group: string;
}

interface DiaDReservation {
  id: number;
  date: string;
  type: string;
  supplier: Supplier;
}

interface PixReservation {
  id: number;
  weekStart: string;
  weekEnd: string;
  supplier: Supplier;
}

interface MonthlyCampaign {
  id: number;
  monthKey: string;
  action: string;
  detail?: string;
  invest?: number;
}

interface OneOffAction {
  id: number;
  date: string;
  action: string;
  detail?: string;
  invest?: number;
}

interface BimesterParticipation {
  id: number;
  bimesterKey: string;
  participates: boolean;
  invest?: number;
}

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [diaDDate, setDiaDDate] = useState<string>("");
  const [diaDType, setDiaDType] = useState<string>(DIA_D_TYPES[0]);
  const [pixWeek, setPixWeek] = useState<string>("");
  const [pixTheme, setPixTheme] = useState<string>("");
  const [monthlyAction, setMonthlyAction] = useState<string>("");
  const [monthlyMonth, setMonthlyMonth] = useState<string>(CAMPAIGN_MONTHS[0]);
  const [monthlyDetail, setMonthlyDetail] = useState<string>("");
  const [oneOffDate, setOneOffDate] = useState<string>("");
  const [oneOffAction, setOneOffAction] = useState<string>("");
  const [oneOffDetail, setOneOffDetail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [diaDReservations, setDiaDReservations] = useState<DiaDReservation[]>([]);
  const [pixReservations, setPixReservations] = useState<PixReservation[]>([]);
  const [monthly, setMonthly] = useState<MonthlyCampaign[]>([]);
  const [oneOff, setOneOff] = useState<OneOffAction[]>([]);
  const [bimesters, setBimesters] = useState<BimesterParticipation[]>([]);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await fetch(`/api/suppliers?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          const text = await response.text();
          try {
            const errorMessage = text ? JSON.parse(text).error : "Não foi possível carregar fornecedores.";
            setMessage(errorMessage);
          } catch (parseError) {
            setMessage("Não foi possível carregar fornecedores.");
          }
          return;
        }
        const text = await response.text();
        const data = text ? (JSON.parse(text) as Supplier[]) : [];
        setSuppliers(data);
      } catch (error) {
        setMessage("Falha ao conectar com o servidor.");
      }
    };
    loadSuppliers();
  }, [query]);

  useEffect(() => {
    if (!supplierId) return;
    const loadData = async () => {
      const [diaDResponse, pixResponse, monthlyResponse, oneOffResponse] = await Promise.all([
        fetch(`/api/dia-d?supplierId=${supplierId}`),
        fetch(`/api/pix?supplierId=${supplierId}`),
        fetch(`/api/monthly?supplierId=${supplierId}`),
        fetch(`/api/oneoff?supplierId=${supplierId}`)
      ]);
      const bimesterResponse = await fetch(`/api/bimesters?supplierId=${supplierId}`);
      setDiaDReservations(await diaDResponse.json());
      setPixReservations(await pixResponse.json());
      setMonthly(await monthlyResponse.json());
      setOneOff(await oneOffResponse.json());
      setBimesters(await bimesterResponse.json());
    };
    loadData();
  }, [supplierId]);

  const supplier = suppliers.find((item) => item.id === Number(supplierId));

  const agendaItems = useMemo(() => {
    const items = [
      ...diaDReservations.map((item) => ({
        date: item.date,
        label: `Dia D - ${item.type}`
      })),
      ...pixReservations.map((item) => ({
        date: item.weekStart,
        label: `PIX - Semana de ${item.weekStart}`
      })),
      ...monthly.map((item) => ({
        date: item.monthKey + "-01",
        label: `Mensal - ${item.action}`
      })),
      ...oneOff.map((item) => ({
        date: item.date,
        label: `Avulsa - ${item.action}`
      })),
      ...bimesters.filter((item) => item.participates).map((item) => ({
        date: item.bimesterKey + "-01",
        label: `Bimestral - ${item.bimesterKey}`
      }))
    ];
    return items.sort((a, b) => a.date.localeCompare(b.date));
  }, [diaDReservations, pixReservations, monthly, oneOff, bimesters]);

  const exportData = (format: "json" | "csv") => {
    const payload = {
      supplier,
      diaDReservations,
      pixReservations,
      bimesters,
      monthly,
      oneOff
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fornecedor-${supplier?.code ?? "dados"}.json`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    const rows = [
      ["tipo", "data", "detalhe"],
      ...diaDReservations.map((item) => ["Dia D", item.date, item.type]),
      ...pixReservations.map((item) => ["PIX", item.weekStart, item.supplier.name]),
      ...bimesters.map((item) => ["Bimestral", item.bimesterKey, item.participates ? "Sim" : "Não"]),
      ...monthly.map((item) => ["Mensal", item.monthKey, item.action]),
      ...oneOff.map((item) => ["Avulsa", item.date, item.action])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fornecedor-${supplier?.code ?? "dados"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const createDiaD = async () => {
    setMessage("");
    const response = await fetch("/api/dia-d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, date: diaDDate, type: diaDType })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Erro ao reservar Dia D");
      return;
    }
    setDiaDReservations((prev) => [...prev, data]);
  };

  const createPix = async () => {
    setMessage("");
    const response = await fetch("/api/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, weekStart: pixWeek, theme: pixTheme })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Erro ao reservar Semana PIX");
      return;
    }
    setPixReservations((prev) => [...prev, data]);
  };

  const createMonthly = async () => {
    setMessage("");
    const response = await fetch("/api/monthly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, monthKey: monthlyMonth, action: monthlyAction, detail: monthlyDetail })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Erro ao salvar campanha mensal");
      return;
    }
    setMonthly((prev) => [...prev, data]);
  };

  const createOneOff = async () => {
    setMessage("");
    const response = await fetch("/api/oneoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, date: oneOffDate, action: oneOffAction, detail: oneOffDetail })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Erro ao salvar ação avulsa");
      return;
    }
    setOneOff((prev) => [...prev, data]);
  };

  const toggleBimester = async (bimesterKey: string, participates: boolean) => {
    setMessage("");
    const existing = bimesters.find((item) => item.bimesterKey === bimesterKey);
    if (existing) {
      const response = await fetch("/api/bimesters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: existing.id, participates })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? "Erro ao atualizar bimestre");
        return;
      }
      setBimesters((prev) => prev.map((item) => (item.id === existing.id ? data : item)));
      return;
    }
    const response = await fetch("/api/bimesters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, bimesterKey, participates })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Erro ao registrar bimestre");
      return;
    }
    setBimesters((prev) => [...prev, data]);
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold">Área do Fornecedor</h2>
        <p className="text-sm text-slate-500">Selecione seu fornecedor e faça suas reservas.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-500">Buscar fornecedor</label>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Digite nome ou código" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Selecionar fornecedor</label>
            <select value={supplierId} onChange={(event) => setSupplierId(event.target.value)}>
              <option value="">Selecione</option>
              {suppliers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} - {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {supplier && (
          <div className="mt-4 rounded-lg bg-slate-100 p-4 text-sm">
            <p className="font-semibold">{supplier.name}</p>
            <p>Grupo: {supplier.group}</p>
          </div>
        )}
        {message && <p className="mt-4 text-sm font-semibold text-red-600">{message}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold">Dia D</h3>
          <div className="grid gap-3">
            <input type="date" value={diaDDate} onChange={(event) => setDiaDDate(event.target.value)} />
            <select value={diaDType} onChange={(event) => setDiaDType(event.target.value)}>
              {DIA_D_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <button onClick={createDiaD} disabled={!supplierId || !diaDDate}>
              Reservar Dia D
            </button>
          </div>
          <div className="text-xs text-slate-600">
            {diaDReservations.map((item) => (
              <div key={item.id}>{item.date} — {item.type}</div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="text-lg font-semibold">Semana PIX</h3>
          <div className="grid gap-3">
            <input type="date" value={pixWeek} onChange={(event) => setPixWeek(event.target.value)} />
            <input value={pixTheme} onChange={(event) => setPixTheme(event.target.value)} placeholder="Tema" />
            <button onClick={createPix} disabled={!supplierId || !pixWeek}>
              Reservar Semana PIX
            </button>
          </div>
          <div className="text-xs text-slate-600">
            {pixReservations.map((item) => (
              <div key={item.id}>{item.weekStart} — {item.supplier.name}</div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="text-lg font-semibold">Campanhas Mensais</h3>
          <div className="grid gap-3">
            <select value={monthlyMonth} onChange={(event) => setMonthlyMonth(event.target.value)}>
              {CAMPAIGN_MONTHS.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
            <input value={monthlyAction} onChange={(event) => setMonthlyAction(event.target.value)} placeholder="Categoria" />
            <input value={monthlyDetail} onChange={(event) => setMonthlyDetail(event.target.value)} placeholder="Detalhe" />
            <button onClick={createMonthly} disabled={!supplierId || !monthlyAction}>
              Adicionar Mensal
            </button>
          </div>
          <div className="text-xs text-slate-600">
            {monthly.map((item) => (
              <div key={item.id}>{item.monthKey} — {item.action}</div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="text-lg font-semibold">Campanhas Bimestrais</h3>
          <div className="space-y-2 text-sm text-slate-600">
            {BIMESTERS.map((bimester) => {
              const active = bimesters.find((item) => item.bimesterKey === bimester.key)?.participates ?? false;
              return (
                <label key={bimester.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(event) => toggleBimester(bimester.key, event.target.checked)}
                  />
                  {bimester.label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="text-lg font-semibold">Ações Avulsas</h3>
          <div className="grid gap-3">
            <input type="date" value={oneOffDate} onChange={(event) => setOneOffDate(event.target.value)} />
            <input value={oneOffAction} onChange={(event) => setOneOffAction(event.target.value)} placeholder="Ação" />
            <input value={oneOffDetail} onChange={(event) => setOneOffDetail(event.target.value)} placeholder="Detalhe" />
            <button onClick={createOneOff} disabled={!supplierId || !oneOffDate || !oneOffAction}>
              Adicionar Avulsa
            </button>
          </div>
          <div className="text-xs text-slate-600">
            {oneOff.map((item) => (
              <div key={item.id}>{item.date} — {item.action}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold">Resumo mensal e exportação</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => exportData("json")} disabled={!supplierId}>
            Exportar JSON
          </button>
          <button onClick={() => exportData("csv")} disabled={!supplierId}>
            Exportar CSV
          </button>
          <a
            className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600"
            href={supplierId ? `/api/pdf?month=2026-03&scope=supplier&supplierId=${supplierId}` : "#"}
          >
            Gerar PDF (Mar/2026)
          </a>
        </div>
        <div className="mt-6 grid gap-3 text-sm text-slate-600">
          {agendaItems.map((item) => (
            <div key={`${item.date}-${item.label}`}>
              {item.date} — {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
