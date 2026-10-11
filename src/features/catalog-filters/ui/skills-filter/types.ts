import type { SkillCategory } from '@/shared/types';

export interface SkillsFilterProps {
  categories: SkillCategory[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  visibleCount?: number;
}
