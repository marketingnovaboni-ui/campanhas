import { NextResponse } from "next/server";
import { chromium } from "playwright";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const month = searchParams.get("month");
  const scope = searchParams.get("scope") ?? "team";
  const supplierId = searchParams.get("supplierId");

  if (!month) {
    return NextResponse.json({ error: "Mês é obrigatório" }, { status: 400 });
  }

  const url = new URL("/print/calendar", origin);
  url.searchParams.set("month", month);
  url.searchParams.set("scope", scope);
  if (supplierId) url.searchParams.set("supplierId", supplierId);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url.toString(), { waitUntil: "networkidle" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=planner-${month}.pdf`
    }
  });
}
