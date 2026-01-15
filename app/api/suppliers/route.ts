import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  const suppliers = await prisma.supplier.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { code: { contains: query, mode: "insensitive" } }
          ]
        }
      : undefined,
    orderBy: { name: "asc" }
  });

  return NextResponse.json(suppliers);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supplier = await prisma.supplier.create({
    data: {
      code: body.code,
      name: body.name,
      group: body.group
    }
  });
  return NextResponse.json(supplier, { status: 201 });
}
