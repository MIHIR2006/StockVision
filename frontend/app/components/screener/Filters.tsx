'use client';

import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function Filters({ filters, onFilterChange, onApplyFilters }) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <Input
        placeholder="Market Cap (min)"
        value={filters.marketCapMoreThan || ''}
        onChange={(e) => onFilterChange('marketCapMoreThan', e.target.value)}
      />
      <Input
        placeholder="Market Cap (max)"
        value={filters.marketCapLowerThan || ''}
        onChange={(e) => onFilterChange('marketCapLowerThan', e.target.value)}
      />
      <Input
        placeholder="P/E Ratio (min)"
        value={filters.priceEarningsRatioMoreThan || ''}
        onChange={(e) => onFilterChange('priceEarningsRatioMoreThan', e.target.value)}
      />
      <Input
        placeholder="P/E Ratio (max)"
        value={filters.priceEarningsRatioLowerThan || ''}
        onChange={(e) => onFilterChange('priceEarningsRatioLowerThan', e.target.value)}
      />
      <Select onValueChange={(value) => onFilterChange('sector', value)} value={filters.sector || ''}>
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
      <Button onClick={onApplyFilters}>Apply Filters</Button>
    </div>
  );
}
