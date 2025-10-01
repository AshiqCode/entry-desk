import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'newest' | 'oldest' | 'alphabetical';
  onSortChange: (value: 'newest' | 'oldest' | 'alphabetical') => void;
}

const SearchFilters = ({ searchQuery, onSearchChange, sortOrder, onSortChange }: SearchFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by class name or date..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card"
        />
      </div>
      
      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[200px] bg-card">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="alphabetical">A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchFilters;
