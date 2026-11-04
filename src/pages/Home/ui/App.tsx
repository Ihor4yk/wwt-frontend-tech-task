import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { getFilterItems } from '@/shared/api/filter'
import { useFilterStore } from '@/shared/store/filterStore'

import { FilterModal } from './FilterModal'

export const App = () => {
	const { t } = useTranslation('filter')
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

	const selectedFilters = useFilterStore(state => state.selectedFilters)

	const {
		data: filterItems = [],
		isPending,
		isError
	} = useQuery({
		queryKey: ['filterItems'],
		queryFn: getFilterItems
	})

	if (isPending) {
		return <div>{t('loadingFilters')}</div>
	}

	if (isError) {
		return <div>{t('failedToLoadFilters')}</div>
	}

	return (
		<main className="min-h-dvh p-8">
			<h1 className="mb-6 text-3xl font-bold">{t('pageTitle')}</h1>
			<button
				type="button"
				onClick={() => setIsFilterModalOpen(true)}
				className="mb-6 rounded-lg bg-[#FF5F00] px-4 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31393C]"
			>
				{t('openFilterModal')}
			</button>

			<section className="mb-8">
				<h2 className="mb-3 text-xl font-semibold">{t('availableFilters')}</h2>

				<pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
					{JSON.stringify(filterItems, null, 2)}
				</pre>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-semibold">{t('selectedFilters')}</h2>

				<pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
					{JSON.stringify(selectedFilters, null, 2)}
				</pre>
			</section>

			<FilterModal
				isOpen={isFilterModalOpen}
				filterItems={filterItems}
				selectedFilters={selectedFilters}
				onClose={() => setIsFilterModalOpen(false)}
				onApply={() => undefined}
			/>
		</main>
	)
}
