"use client";

import { useEffect, useState } from "react";
import { CAMPAIGN_MONTHS } from "@/lib/constants";

interface Supplier {
  id: number;
  name: string;
  code: string;
  group: string;
}

interface CalendarData {
  diaD: Array<{ id: number; date: string; supplier: Supplier; type: string }>;
  pix: Array<{ id: number; weekStart: string; supplier: Supplier }>;
  bimesters: Array<{ id: number; bimesterKey: string; supplier: Supplier; participates: boolean; invest?: number }>;
  monthly: Array<{ id: number; monthKey: string; action: string; supplier: Supplier }>;
  oneOff: Array<{ id: number; date: string; action: string; supplier: Supplier }>;
}

interface Holiday {
  id: number;
  date: string;
  name: string;
}

export default function AdminPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState<string>("");
  const [month, setMonth] = useState<string>(CAMPAIGN_MONTHS[0]);
  const [group, setGroup] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidayDate, setHolidayDate] = useState<string>("");
  const [holidayName, setHolidayName] = useState<string>("");

  useEffect(() => {
    fetch("/api/suppliers")
      .then((response) => response.json())
      .then((data) => setSuppliers(data));
  }, []);

  const loadCalendar = async () => {
    const params = new URLSearchParams({ month });
    if (supplierId) params.set("supplierId", supplierId);
    if (group) params.set("group", group);
    if (type) params.set("type", type);
    if (search) params.set("search", search);
    const response = await fetch(`/api/team/calendar?${params.toString()}`);
    setCalendar(await response.json());
  };

  useEffect(() => {
    loadCalendar();
  }, [month, supplierId, group, type, search]);

  const loadHolidays = async () => {
    const response = await fetch("/api/municipal-holidays");
    setHolidays(await response.json());
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  const addHoliday = async () => {
    const response = await fetch("/api/municipal-holidays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: holidayDate, name: holidayName })
    });
    if (response.ok) {
      setHolidayDate("");
      setHolidayName("");
      loadHolidays();
    }
  };

  const deleteHoliday = async (id: number) => {
    await fetch(`/api/municipal-holidays?id=${id}`, { method: "DELETE" });
    loadHolidays();
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold">Visão da Equipe</h2>
        <p className="text-sm text-slate-500">Filtre o calendário geral por fornecedor, grupo e tipo.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          <select value={month} onChange={(event) => setMonth(event.target.value)}>
            {CAMPAIGN_MONTHS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={supplierId} onChange={(event) => setSupplierId(event.target.value)}>
            <option value="">Todos fornecedores</option>
            {suppliers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} - {item.name}
              </option>
            ))}
          </select>
          <select value={group} onChange={(event) => setGroup(event.target.value)}>
            <option value="">Todos grupos</option>
            <option>Grupo 1</option>
            <option>Grupo 2</option>
            <option>Grupo 3</option>
          </select>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">Todos tipos</option>
            <option value="Dia D">Dia D</option>
            <option value="PIX">PIX</option>
            <option value="Bimestral">Bimestral</option>
            <option value="Mensal">Mensal</option>
            <option value="Avulsa">Avulsa</option>
          </select>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar texto" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600"
            href={`/api/pdf?month=${month}&scope=team`}
          >
            Gerar PDF do mês
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold">Agenda do mês</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            {calendar?.diaD.map((item) => (
              <div key={`d-${item.id}`}>Dia D {item.date} — {item.supplier.name}</div>
            ))}
            {calendar?.pix.map((item) => (
              <div key={`p-${item.id}`}>PIX {item.weekStart} — {item.supplier.name}</div>
            ))}
            {calendar?.monthly.map((item) => (
              <div key={`m-${item.id}`}>Mensal {item.monthKey} — {item.supplier.name}</div>
            ))}
            {calendar?.oneOff.map((item) => (
              <div key={`o-${item.id}`}>Avulsa {item.date} — {item.supplier.name}</div>
            ))}
            {calendar?.bimesters.map((item) => (
              <div key={`b-${item.id}`}>Bimestral {item.bimesterKey} — {item.supplier.name}</div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold">Feriados municipais</h3>
          <div className="mt-4 grid gap-3">
            <input type="date" value={holidayDate} onChange={(event) => setHolidayDate(event.target.value)} />
            <input value={holidayName} onChange={(event) => setHolidayName(event.target.value)} placeholder="Nome do feriado" />
            <button onClick={addHoliday} disabled={!holidayDate || !holidayName}>
              Adicionar feriado
            </button>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between">
                <span>{holiday.date} — {holiday.name}</span>
                <button className="bg-red-500 hover:bg-red-600" onClick={() => deleteHoliday(holiday.id)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
