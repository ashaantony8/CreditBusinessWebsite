import { useMemo } from 'react';

export default function useCategoryCount(data) {
  // Memoize the count calculation
  const categoryCount = useMemo(() => {
    return data?.reduce((acc, item) => {
      if (item.category && item.category.trim() !== '') {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [data]);

  return categoryCount;
}
