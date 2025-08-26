'use client';

import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export function StockTable({ stocks, loading, onSort, onSelectStock }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort('symbol')}>Symbol</TableHead>
          <TableHead onClick={() => onSort('companyName')}>Company Name</TableHead>
          <TableHead onClick={() => onSort('marketCap')}>Market Cap</TableHead>
          <TableHead onClick={() => onSort('pe')}>P/E Ratio</TableHead>
          <TableHead onClick={() => onSort('sector')}>Sector</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">Loading...</TableCell>
          </TableRow>
        ) : (
          stocks.map((stock) => (
            <TableRow key={stock.symbol} onClick={() => onSelectStock(stock.symbol)}>
              <TableCell>{stock.symbol}</TableCell>
              <TableCell>{stock.companyName}</TableCell>
              <TableCell>{stock.marketCap}</TableCell>
              <TableCell>{stock.pe}</TableCell>
              <TableCell>{stock.sector}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
