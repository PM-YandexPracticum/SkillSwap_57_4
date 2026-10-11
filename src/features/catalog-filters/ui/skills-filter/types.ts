export interface SkillSubcategory {
  id: string;
  name: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  subcategories: SkillSubcategory[];
}

export interface SkillsFilterProps {
  categories: SkillCategory[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  visibleCount?: number;
}
