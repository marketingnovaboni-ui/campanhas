import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const supplierId = searchParams.get("supplierId");
  const group = searchParams.get("group");
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  const supplierFilter = {
    ...(supplierId ? { id: Number(supplierId) } : {}),
    ...(group ? { group } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {})
  };

  const dateFilter = month
    ? {
        gte: new Date(`${month}-01T00:00:00`),
        lt: new Date(`${month}-31T23:59:59`)
      }
    : undefined;

  const [diaD, pix, bimesters, monthly, oneOff] = await Promise.all([
    type && type !== "Dia D"
      ? []
      : prisma.diaDReservation.findMany({
          where: {
            ...(dateFilter ? { date: dateFilter } : {}),
            supplier: supplierFilter
          },
          include: { supplier: true }
        }),
    type && type !== "PIX"
      ? []
      : prisma.pixReservation.findMany({
          where: {
            ...(dateFilter ? { weekStart: dateFilter } : {}),
            supplier: supplierFilter
          },
          include: { supplier: true }
        }),
    type && type !== "Bimestral"
      ? []
      : prisma.bimesterParticipation.findMany({
          where: {
            supplier: supplierFilter,
            ...(search ? { bimesterKey: { contains: search, mode: "insensitive" } } : {})
          },
          include: { supplier: true }
        }),
    type && type !== "Mensal"
      ? []
      : prisma.monthlyCampaign.findMany({
          where: {
            supplier: supplierFilter,
            ...(month ? { monthKey: month } : {})
          },
          include: { supplier: true }
        }),
    type && type !== "Avulsa"
      ? []
      : prisma.oneOffAction.findMany({
          where: {
            ...(dateFilter ? { date: dateFilter } : {}),
            supplier: supplierFilter
          },
          include: { supplier: true }
        })
  ]);

  return NextResponse.json({ diaD, pix, bimesters, monthly, oneOff });
}
