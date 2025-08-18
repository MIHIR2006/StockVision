'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import * as Recharts from 'recharts'

type ScreenerRow = {
  symbol: string
  companyName?: string
  price?: number
  marketCap?: number
  sector?: string
  pe?: number
  roeTTM?: number | null
  debtToEquityTTM?: number | null
}

const sectors = [
  { label: 'All', value: 'all' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Communication Services', value: 'Communication Services' },
  { label: 'Consumer Discretionary', value: 'Consumer Discretionary' },
  { label: 'Financial Services', value: 'Financial Services' },
  { label: 'Energy', value: 'Energy' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Industrials', value: 'Industrials' },
  { label: 'Utilities', value: 'Utilities' },
]

const number = (n?: number | null, dash = '-') => (n === null || n === undefined ? dash : Intl.NumberFormat().format(n))
const currency = (n?: number | null) => (n === null || n === undefined ? '-' : Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n))
const marketCapPretty = (n?: number) => {
  if (!n || !Number.isFinite(n)) return '-'
  const units = [ '', 'K', 'M', 'B', 'T' ]
  let u = 0
  let v = n
  while (v >= 1000 && u < units.length - 1) { v /= 1000; u++ }
  return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)}${units[u]}`
}

export default function Screener() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<ScreenerRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('all')
  const [minMc, setMinMc] = useState<string>('')
  const [maxMc, setMaxMc] = useState<string>('')
  const [minPE, setMinPE] = useState<string>('')
  const [maxPE, setMaxPE] = useState<string>('')
  const [sortBy, setSortBy] = useState<'marketCap' | 'pe' | 'price' | 'symbol'>('marketCap')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [history, setHistory] = useState<{ date: string, close: number }[]>([])
  const [presetName, setPresetName] = useState('')
  const [presets, setPresets] = useState<{ name: string; data: any }[]>([])

  const query = useMemo(() => {
    const sp = new URLSearchParams()
    sp.set('page', String(page))
    sp.set('pageSize', String(pageSize))
    if (search) sp.set('search', search)
    if (sector && sector !== 'all') sp.set('sector', sector)
    if (minMc) sp.set('minMarketCap', minMc)
    if (maxMc) sp.set('maxMarketCap', maxMc)
    if (minPE) sp.set('minPE', minPE)
    if (maxPE) sp.set('maxPE', maxPE)
    sp.set('sortBy', sortBy)
    sp.set('sortDir', sortDir)
    return sp.toString()
  }, [page, pageSize, search, sector, minMc, maxMc, minPE, maxPE, sortBy, sortDir])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/screener?${query}`)
      const json = await res.json()
      setRows(json.data || [])
      setTotal(json.total || 0)
    } catch (e) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => { load() }, [load])

  // Presets
  useEffect(() => {
    try {
      const raw = localStorage.getItem('screener_presets')
      if (raw) setPresets(JSON.parse(raw))
    } catch {}
  }, [])

  function savePreset() {
    if (!presetName.trim()) return
    const data = { search, sector, minMc, maxMc, minPE, maxPE, sortBy, sortDir, pageSize }
    const next = presets.filter(p => p.name !== presetName.trim()).concat([{ name: presetName.trim(), data }])
    setPresets(next)
    try { localStorage.setItem('screener_presets', JSON.stringify(next)) } catch {}
  }

  function applyPreset(name: string) {
    const p = presets.find(x => x.name === name)
    if (!p) return
    const d = p.data || {}
    setSearch(d.search || '')
    setSector(d.sector || 'all')
    setMinMc(d.minMc || '')
    setMaxMc(d.maxMc || '')
    setMinPE(d.minPE || '')
    setMaxPE(d.maxPE || '')
    setSortBy(d.sortBy || 'marketCap')
    setSortDir(d.sortDir || 'desc')
    setPageSize(Number(d.pageSize) || 10)
    setPage(1)
  }

  useEffect(() => {
    if (!selectedSymbol) return
    const controller = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(`/api/history?symbol=${selectedSymbol}&range=1y`, { signal: controller.signal })
        const json = await res.json()
        setHistory(json.data || [])
      } catch {}
    })()
    return () => controller.abort()
  }, [selectedSymbol])

  const pages = Math.max(1, Math.ceil(total / pageSize))

  function changeSort(col: 'marketCap' | 'pe' | 'price' | 'symbol') {
    if (sortBy === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <div className="w-full md:w-64">
          <label className="text-xs text-muted-foreground">Search (symbol/name)</label>
          <Input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} placeholder="AAPL, Microsoft..." />
        </div>
        <div className="w-full md:w-48">
          <label className="text-xs text-muted-foreground">Sector</label>
          <Select value={sector} onValueChange={(v) => { setPage(1); setSector(v) }}>
            <SelectTrigger>
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(s => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-40">
          <label className="text-xs text-muted-foreground">Min Market Cap ($)</label>
          <Input type="number" inputMode="numeric" value={minMc} onChange={(e) => { setPage(1); setMinMc(e.target.value) }} placeholder="1,000,000,000" />
        </div>
        <div className="w-full md:w-40">
          <label className="text-xs text-muted-foreground">Max Market Cap ($)</label>
          <Input type="number" inputMode="numeric" value={maxMc} onChange={(e) => { setPage(1); setMaxMc(e.target.value) }} placeholder="10,000,000,000" />
        </div>
        <div className="w-full md:w-32">
          <label className="text-xs text-muted-foreground">Min P/E</label>
          <Input type="number" inputMode="decimal" value={minPE} onChange={(e) => { setPage(1); setMinPE(e.target.value) }} placeholder="10" />
        </div>
        <div className="w-full md:w-32">
          <label className="text-xs text-muted-foreground">Max P/E</label>
          <Input type="number" inputMode="decimal" value={maxPE} onChange={(e) => { setPage(1); setMaxPE(e.target.value) }} placeholder="40" />
        </div>
        <div className="flex items-end gap-2">
          <Button type="button" variant="secondary" onClick={() => load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-3">
        <div className="w-full md:w-64">
          <label className="text-xs text-muted-foreground">Save preset as</label>
          <Input value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="My growth filter" />
        </div>
        <div className="flex items-end gap-2">
          <Button type="button" onClick={savePreset} disabled={!presetName.trim()}>Save Preset</Button>
          <Select onValueChange={(v) => applyPreset(v)}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Load preset" />
            </SelectTrigger>
            <SelectContent>
              {presets.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => changeSort('symbol')}>Symbol</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="cursor-pointer" onClick={() => changeSort('price')}>Price</TableHead>
              <TableHead className="cursor-pointer" onClick={() => changeSort('marketCap')}>Market Cap</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead className="cursor-pointer" onClick={() => changeSort('pe')}>P/E</TableHead>
              <TableHead>ROE (TTM)</TableHead>
              <TableHead>Debt/Equity (TTM)</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.symbol}>
                <TableCell className="font-semibold">{r.symbol}</TableCell>
                <TableCell>{r.companyName || '-'}</TableCell>
                <TableCell>{currency(r.price)}</TableCell>
                <TableCell>{marketCapPretty(r.marketCap)}</TableCell>
                <TableCell>{r.sector || '-'}</TableCell>
                <TableCell>{number(r.pe)}</TableCell>
                <TableCell>{r.roeTTM === null || r.roeTTM === undefined ? '-' : `${(r.roeTTM * 100).toFixed(1)}%`}</TableCell>
                <TableCell>{r.debtToEquityTTM === null || r.debtToEquityTTM === undefined ? '-' : r.debtToEquityTTM.toFixed(2)}</TableCell>
                <TableCell>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setSelectedSymbol(r.symbol)}>Chart</Button>
                </TableCell>
              </TableRow>
            ))}
            {!rows.length && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">No results</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Page {page} of {pages} • {total} results</div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}><ChevronLeft className="h-4 w-4" /></Button>
          <Button type="button" variant="outline" size="icon" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}><ChevronRight className="h-4 w-4" /></Button>
          <Select value={String(pageSize)} onValueChange={(v) => { setPage(1); setPageSize(Number(v)) }}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map(n => <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedSymbol && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{selectedSymbol} • 1Y Price</h3>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedSymbol(null)}>Close</Button>
          </div>
          <ChartContainer
            config={{ price: { label: 'Price', color: 'hsl(var(--primary))' } }}
            className="w-full h-64"
          >
            <Recharts.AreaChart data={history}>
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis dataKey="date" hide tick={{ fontSize: 12 }} />
              <Recharts.YAxis tick={{ fontSize: 12 }} width={60} />
              <Recharts.Tooltip content={<ChartTooltipContent />} />
              <Recharts.Area type="monotone" dataKey="close" stroke="var(--color-price)" fill="var(--color-price)" fillOpacity={0.15} />
            </Recharts.AreaChart>
          </ChartContainer>
        </div>
      )}
    </div>
  )
}


