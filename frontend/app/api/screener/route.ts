import { NextResponse } from "next/server";

type ScreenerItem = {
  symbol: string;
  companyName?: string;
  price?: number;
  marketCap?: number;
  sector?: string;
  pe?: number;
  roeTTM?: number | null;
  debtToEquityTTM?: number | null;
};

const FMP_BASE = "https://financialmodelingprep.com/api/v3";

function parseNumber(value: string | null, fallback: number | undefined = undefined) {
  if (value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Fallback data to ensure zero errors without API key
const FALLBACK_DATA: ScreenerItem[] = [
  { symbol: "AAPL", companyName: "Apple Inc.", price: 190.1, marketCap: 2_950_000_000_000, sector: "Technology", pe: 32.3, roeTTM: 0.77, debtToEquityTTM: 1.7 },
  { symbol: "MSFT", companyName: "Microsoft Corp.", price: 425.4, marketCap: 3_100_000_000_000, sector: "Technology", pe: 35.1, roeTTM: 0.44, debtToEquityTTM: 0.6 },
  { symbol: "GOOGL", companyName: "Alphabet Inc. Class A", price: 170.2, marketCap: 2_150_000_000_000, sector: "Communication Services", pe: 26.4, roeTTM: 0.29, debtToEquityTTM: 0.1 },
  { symbol: "AMZN", companyName: "Amazon.com, Inc.", price: 182.9, marketCap: 1_900_000_000_000, sector: "Consumer Discretionary", pe: 52.6, roeTTM: 0.22, debtToEquityTTM: 0.9 },
  { symbol: "META", companyName: "Meta Platforms, Inc.", price: 510.3, marketCap: 1_300_000_000_000, sector: "Communication Services", pe: 28.2, roeTTM: 0.32, debtToEquityTTM: 0.2 },
  { symbol: "TSLA", companyName: "Tesla, Inc.", price: 190.4, marketCap: 600_000_000_000, sector: "Consumer Discretionary", pe: 74.5, roeTTM: 0.17, debtToEquityTTM: 0.4 },
  { symbol: "NVDA", companyName: "NVIDIA Corporation", price: 120.3, marketCap: 2_900_000_000_000, sector: "Technology", pe: 70.1, roeTTM: 0.56, debtToEquityTTM: 0.9 },
  { symbol: "NFLX", companyName: "Netflix, Inc.", price: 640.2, marketCap: 280_000_000_000, sector: "Communication Services", pe: 45.3, roeTTM: 0.30, debtToEquityTTM: 0.8 },
  { symbol: "JPM", companyName: "JPMorgan Chase & Co.", price: 200.1, marketCap: 580_000_000_000, sector: "Financial Services", pe: 12.2, roeTTM: 0.16, debtToEquityTTM: 1.8 },
  { symbol: "XOM", companyName: "Exxon Mobil Corporation", price: 120.5, marketCap: 480_000_000_000, sector: "Energy", pe: 13.9, roeTTM: 0.19, debtToEquityTTM: 0.2 },
];

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseNumber(searchParams.get("page"), 1) || 1);
  const pageSize = Math.min(50, Math.max(5, parseNumber(searchParams.get("pageSize"), 10) || 10));
  const sector = searchParams.get("sector") || "";
  const minMarketCap = parseNumber(searchParams.get("minMarketCap"));
  const maxMarketCap = parseNumber(searchParams.get("maxMarketCap"));
  const minPE = parseNumber(searchParams.get("minPE"));
  const maxPE = parseNumber(searchParams.get("maxPE"));
  const search = (searchParams.get("search") || "").trim().toUpperCase();
  const sortBy = searchParams.get("sortBy") || "marketCap"; // symbol | companyName | price | marketCap | pe | roeTTM | debtToEquityTTM
  const sortDir = (searchParams.get("sortDir") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  const apikey = process.env.FMP_API_KEY;

  let items: ScreenerItem[] = [];

  if (apikey) {
    const params: string[] = [
      `limit=200`,
      `isActivelyTrading=true`,
    ];
    if (sector && sector !== "all") params.push(`sector=${encodeURIComponent(sector)}`);
    if (minMarketCap !== undefined) params.push(`marketCapMoreThan=${minMarketCap}`);
    if (maxMarketCap !== undefined) params.push(`marketCapLowerThan=${maxMarketCap}`);
    if (minPE !== undefined) params.push(`peMoreThan=${minPE}`);
    if (maxPE !== undefined) params.push(`peLowerThan=${maxPE}`);
    const screenerUrl = `${FMP_BASE}/stock-screener?${params.join("&")}&apikey=${apikey}`;
    const screener = await fetchJson<any[]>(screenerUrl);
    if (Array.isArray(screener)) {
      items = screener.map((it) => ({
        symbol: it.symbol,
        companyName: it.companyName || it.company_name || it.company || undefined,
        price: typeof it.price === "number" ? it.price : undefined,
        marketCap: typeof it.marketCap === "number" ? it.marketCap : undefined,
        sector: it.sector,
        pe: typeof it.pe === "number" ? it.pe : undefined,
        roeTTM: null,
        debtToEquityTTM: null,
      }));
    }
  }

  // Fallback to static data if API unavailable
  if (!items.length) {
    items = FALLBACK_DATA.slice();
  }

  // Search filter
  if (search) {
    items = items.filter((it) =>
      it.symbol.toUpperCase().includes(search) ||
      (it.companyName || "").toUpperCase().includes(search)
    );
  }

  // Client-side filter fallback (in case API couldn't filter)
  items = items.filter((it) => {
    const mcOk = (minMarketCap === undefined || (it.marketCap || 0) >= minMarketCap) &&
      (maxMarketCap === undefined || (it.marketCap || 0) <= maxMarketCap);
    const peOk = (minPE === undefined || (it.pe || 0) >= minPE) &&
      (maxPE === undefined || (it.pe || 0) <= maxPE);
    const secOk = !sector || sector === "all" || it.sector === sector;
    return mcOk && peOk && secOk;
  });

  // Sort
  const sortFactor = sortDir === "asc" ? 1 : -1;
  items.sort((a: any, b: any) => {
    const av = a[sortBy as keyof ScreenerItem];
    const bv = b[sortBy as keyof ScreenerItem];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * sortFactor;
    }
    return String(av).localeCompare(String(bv)) * sortFactor;
  });

  const total = items.length;

  // Pagination
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  // Enrich with TTM metrics for visible page only
  if (apikey && pageItems.length) {
    const enriched = await Promise.all(
      pageItems.map(async (it) => {
        const km = await fetchJson<any[]>(`${FMP_BASE}/key-metrics-ttm/${encodeURIComponent(it.symbol)}?apikey=${apikey}`);
        const first = Array.isArray(km) && km.length ? km[0] : null;
        return {
          ...it,
          roeTTM: first && typeof first.roeTTM === "number" ? first.roeTTM : null,
          debtToEquityTTM: first && typeof first.debtToEquityTTM === "number" ? first.debtToEquityTTM : null,
        } as ScreenerItem;
      })
    );
    return NextResponse.json({ total, page, pageSize, data: enriched });
  }

  return NextResponse.json({ total, page, pageSize, data: pageItems });
}


