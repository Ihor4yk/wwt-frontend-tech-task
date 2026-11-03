import { create } from 'zustand'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterStore {
	selectedFilters: SearchRequestFilter[]
	setSelectedFilters: (filters: SearchRequestFilter[]) => void
	clearSelectedFilters: () => void
}

export const useFilterStore = create<FilterStore>(set => ({
	selectedFilters: [],

	setSelectedFilters: filters => {
		set({ selectedFilters: filters })
	},

	clearSelectedFilters: () => {
		set({ selectedFilters: [] })
	}
}))
