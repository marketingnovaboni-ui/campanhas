import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");

  const entries = await prisma.bimesterParticipation.findMany({
    where: supplierId ? { supplierId: Number(supplierId) } : undefined,
    include: { supplier: true }
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const entry = await prisma.bimesterParticipation.create({
    data: {
      supplierId: Number(body.supplierId),
      bimesterKey: body.bimesterKey,
      participates: Boolean(body.participates),
      invest: body.invest ? Number(body.invest) : null
    },
    include: { supplier: true }
  });
  return NextResponse.json(entry, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const entry = await prisma.bimesterParticipation.update({
    where: { id: Number(body.id) },
    data: {
      participates: Boolean(body.participates),
      invest: body.invest ? Number(body.invest) : null
    },
    include: { supplier: true }
  });
  return NextResponse.json(entry);
}
