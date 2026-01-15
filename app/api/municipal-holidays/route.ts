import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isWithinRange } from "@/lib/date-rules";

export async function GET() {
  const entries = await prisma.holidayMunicipal.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const date = new Date(body.date);
  if (!isWithinRange(date)) {
    return NextResponse.json({ error: "Data fora do período permitido." }, { status: 400 });
  }
  const entry = await prisma.holidayMunicipal.create({
    data: {
      date,
      name: body.name
    }
  });
  return NextResponse.json(entry, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }
  await prisma.holidayMunicipal.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
