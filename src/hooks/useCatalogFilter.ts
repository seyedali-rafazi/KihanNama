import { useMemo, useState } from 'react'

export type FilterPredicate<T> = (
  item: T,
  searchQuery: string,
  category: string,
  secondaryFilter: string,
) => boolean

export type SortComparator<T, S extends string> = (items: T[], sortOption: S) => T[]

type UseCatalogFilterOptions<T, S extends string> = {
  items: readonly T[] | T[]
  initialSort: S
  filterPredicate: FilterPredicate<T>
  sortComparator: SortComparator<T, S>
  initialCategory?: string
  initialSecondary?: string
}

export function useCatalogFilter<T, S extends string>({
  items,
  initialSort,
  filterPredicate,
  sortComparator,
  initialCategory = 'all',
  initialSecondary = 'all',
}: UseCatalogFilterOptions<T, S>) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [secondaryFilter, setSecondaryFilter] = useState(initialSecondary)
  const [sort, setSort] = useState<S>(initialSort)
  const [selected, setSelected] = useState<T | null>(null)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = items.filter((item) => filterPredicate(item, query, category, secondaryFilter))
    return sortComparator(filtered, sort)
  }, [items, search, category, secondaryFilter, sort, filterPredicate, sortComparator])

  const clearSelected = () => setSelected(null)

  return {
    search,
    setSearch,
    category,
    setCategory,
    secondaryFilter,
    setSecondaryFilter,
    sort,
    setSort,
    selected,
    setSelected,
    clearSelected,
    filteredItems,
    count: filteredItems.length,
  }
}
