import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDate, isBlockedDiaD, isWithinRange } from "@/lib/date-rules";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");
  const month = searchParams.get("month");

  const reservations = await prisma.diaDReservation.findMany({
    where: {
      ...(supplierId ? { supplierId: Number(supplierId) } : {}),
      ...(month
        ? {
            date: {
              gte: new Date(`${month}-01T00:00:00`),
              lt: new Date(`${month}-31T23:59:59`)
            }
          }
        : {})
    },
    include: { supplier: true },
    orderBy: { date: "asc" }
  });

  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const date = new Date(body.date);

  if (!isWithinRange(date)) {
    return NextResponse.json({ error: "Data fora do período permitido." }, { status: 400 });
  }

  if (await isBlockedDiaD(date)) {
    return NextResponse.json({ error: "Data inválida para Dia D (feriado ou dia não permitido)." }, { status: 400 });
  }

  try {
    const reservation = await prisma.diaDReservation.create({
      data: {
        supplierId: Number(body.supplierId),
        date,
        type: body.type,
        note: body.note,
        invest: body.invest ? Number(body.invest) : null
      },
      include: { supplier: true }
    });
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    const existing = await prisma.diaDReservation.findUnique({
      where: { date },
      include: { supplier: true }
    });
    if (existing) {
      return NextResponse.json(
        { error: `Data já reservada por ${existing.supplier.name}.`, owner: existing.supplier.name, date: formatDate(date) },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Não foi possível reservar." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }
  await prisma.diaDReservation.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
