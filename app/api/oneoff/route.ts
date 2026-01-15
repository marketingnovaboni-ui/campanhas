import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isWithinRange } from "@/lib/date-rules";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");

  const entries = await prisma.oneOffAction.findMany({
    where: supplierId ? { supplierId: Number(supplierId) } : undefined,
    include: { supplier: true },
    orderBy: { date: "asc" }
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const date = new Date(body.date);

  if (!isWithinRange(date)) {
    return NextResponse.json({ error: "Data fora do período permitido." }, { status: 400 });
  }

  const entry = await prisma.oneOffAction.create({
    data: {
      supplierId: Number(body.supplierId),
      date,
      action: body.action,
      detail: body.detail,
      invest: body.invest ? Number(body.invest) : null
    },
    include: { supplier: true }
  });
  return NextResponse.json(entry, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }
  await prisma.oneOffAction.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
