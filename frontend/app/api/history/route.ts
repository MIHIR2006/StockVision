import { NextResponse } from "next/server";

type HistoryPoint = { date: string; close: number };

const FMP_BASE = "https://financialmodelingprep.com/api/v3";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") || "AAPL").toUpperCase();
  const range = searchParams.get("range") || "1y"; // 1m, 3m, 1y, 5y

  const apikey = process.env.FMP_API_KEY;

  // Fallback mock history
  function fallback(): HistoryPoint[] {
    const days = range === "1m" ? 22 : range === "3m" ? 66 : range === "5y" ? 252 * 5 : 252;
    const data: HistoryPoint[] = [];
    let price = 150;
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      price = Math.max(1, price + (Math.random() - 0.5) * 2);
      data.push({ date: d.toISOString().slice(0, 10), close: Number(price.toFixed(2)) });
    }
    return data;
  }

  if (!apikey) {
    return NextResponse.json({ symbol, data: fallback() });
  }

  // Use FMP historical-price-full for robust history
  const url = `${FMP_BASE}/historical-price-full/${encodeURIComponent(symbol)}?serietype=line&timeseries=1000&apikey=${apikey}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return NextResponse.json({ symbol, data: fallback() });
    const json = await res.json();
    const hist = Array.isArray(json?.historical) ? json.historical : [];
    const mapped: HistoryPoint[] = hist
      .map((p: any) => ({ date: p.date, close: Number(p.close) }))
      .filter((p: HistoryPoint) => Number.isFinite(p.close));
    return NextResponse.json({ symbol, data: mapped });
  } catch {
    return NextResponse.json({ symbol, data: fallback() });
  }
}


