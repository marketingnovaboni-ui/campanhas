import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");

  const entries = await prisma.monthlyCampaign.findMany({
    where: supplierId ? { supplierId: Number(supplierId) } : undefined,
    include: { supplier: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const entry = await prisma.monthlyCampaign.create({
    data: {
      supplierId: Number(body.supplierId),
      monthKey: body.monthKey,
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
  await prisma.monthlyCampaign.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
