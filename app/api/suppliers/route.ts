import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error:
            "DATABASE_URL não encontrado. Crie o arquivo .env com a conexão do banco e reinicie o servidor."
        },
        { status: 500 }
      );
    }
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
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
    return NextResponse.json(
      {
        error:
          "Não foi possível carregar fornecedores. Confira se o banco está ligado, se o arquivo .env existe e se o seed foi executado."
      },
      { status: 500 }
    );
  }
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
