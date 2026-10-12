import type { City } from '@/shared/types';

export interface CitiesFilterProps {
  cities: City[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  visibleCount?: number;
}
