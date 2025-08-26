'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// This is a placeholder for the actual API key
const API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

interface Stock {
  symbol: string;
  companyName: string;
  marketCap: number | null;
  pe: number | null;
  sector: string | null;
}

export function Screener() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    marketCap: '',
    peRatio: '',
    sector: '',
  });

  useEffect(() => {
    fetchStocks();
  }, [filters]);

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    // Construct the API URL with filters
    let url = `https://financialmodelingprep.com/api/v3/stock-screener?apikey=${API_KEY}`;
    if (filters.marketCap) {
      url += `&marketCapMoreThan=${filters.marketCap}`;
    }
    if (filters.peRatio) {
      url += `&priceEarningsRatioMoreThan=${filters.peRatio}`;
    }
    if (filters.sector) {
      url += `&sector=${filters.sector}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }
      setStocks(data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStocks([]);
    }
    setLoading(false);
  };

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Stock Screener</CardTitle>
          <CardDescription>Filter and analyze stocks based on key metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Input
              placeholder="Market Cap (min)"
              onChange={(e) => handleFilterChange('marketCap', e.target.value)}
            />
            <Input
              placeholder="P/E Ratio (min)"
              onChange={(e) => handleFilterChange('peRatio', e.target.value)}
            />
            <Select onValueChange={(value) => handleFilterChange('sector', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Industrials">Industrials</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                {/* Add more sectors as needed */}
              </SelectContent>
            </Select>
            <Button onClick={fetchStocks}>Apply Filters</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>P/E Ratio</TableHead>
                <TableHead>Sector</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : (
                error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-destructive">{error}</TableCell>
                  </TableRow>
                ) : stocks.length > 0 ? (
                  stocks.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell>{stock.symbol}</TableCell>
                      <TableCell>{stock.companyName}</TableCell>
                      <TableCell>{stock.marketCap?.toLocaleString()}</TableCell>
                      <TableCell>{stock.pe}</TableCell>
                      <TableCell>{stock.sector}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center">No stocks found matching your criteria.</TableCell></TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}