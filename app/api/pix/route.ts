import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isWeekStartMonday, isWithinRange, weekBounds } from "@/lib/date-rules";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");
  const month = searchParams.get("month");

  const reservations = await prisma.pixReservation.findMany({
    where: {
      ...(supplierId ? { supplierId: Number(supplierId) } : {}),
      ...(month
        ? {
            weekStart: {
              gte: new Date(`${month}-01T00:00:00`),
              lt: new Date(`${month}-31T23:59:59`)
            }
          }
        : {})
    },
    include: { supplier: true },
    orderBy: { weekStart: "asc" }
  });

  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const weekStart = new Date(body.weekStart);

  if (!isWithinRange(weekStart)) {
    return NextResponse.json({ error: "Semana fora do período permitido." }, { status: 400 });
  }

  if (!isWeekStartMonday(weekStart)) {
    return NextResponse.json({ error: "Semana PIX deve iniciar em uma segunda-feira." }, { status: 400 });
  }

  const { weekEnd } = weekBounds(weekStart);

  const existingCount = await prisma.pixReservation.count({
    where: {
      weekStart
    }
  });

  if (existingCount >= 3) {
    const owners = await prisma.pixReservation.findMany({
      where: { weekStart },
      include: { supplier: true }
    });
    return NextResponse.json(
      {
        error: "Semana cheia: já tem 3 fornecedores.",
        owners: owners.map((owner) => owner.supplier.name)
      },
      { status: 409 }
    );
  }

  try {
    const reservation = await prisma.pixReservation.create({
      data: {
        supplierId: Number(body.supplierId),
        weekStart,
        weekEnd,
        theme: body.theme,
        note: body.note,
        invest: body.invest ? Number(body.invest) : null
      },
      include: { supplier: true }
    });
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível reservar." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }
  await prisma.pixReservation.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
