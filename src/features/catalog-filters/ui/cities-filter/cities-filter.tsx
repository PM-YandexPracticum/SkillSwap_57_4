import { useState } from 'react';
import { CheckboxItem } from '@/shared/ui/checkbox-item';
import { ExpandButton } from '@/shared/ui/expand-button';
import type { CitiesFilterProps } from './types';
import styles from './cities-filter.module.css';

export const CitiesFilter = ({
  cities,
  selectedIds,
  onChange,
  visibleCount = 5,
}: CitiesFilterProps) => {
  const [showAll, setShowAll] = useState(false);

  const visibleCities = showAll
    ? cities
    : cities.slice(0, visibleCount);

  const toggleCity = (id: string, checked: boolean) => {
    onChange(
      checked
        ? [...selectedIds, id]
        : selectedIds.filter((item) => item !== id),
    );
  };

  return (
    <div className={styles.filter}>
      <ul className={styles.list}>
        {visibleCities.map((city) => (
          <li key={city.id}>
            <CheckboxItem
              name="cities"
              label={city.name}
              state={
                selectedIds.includes(city.id)
                  ? 'checked'
                  : 'unchecked'
              }
              onChange={(event) =>
                toggleCity(city.id, event.currentTarget.checked)
              }
            />
          </li>
        ))}
      </ul>

      {cities.length > visibleCount && (
        <ExpandButton
          label="Все города"
          opened={showAll}
          onToggle={() => setShowAll((previous) => !previous)}
        />
      )}
    </div>
  );
};
