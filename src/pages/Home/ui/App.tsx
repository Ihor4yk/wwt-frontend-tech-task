import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { getFilterItems } from '@/shared/api/filter'
import { useFilterStore } from '@/shared/store/filterStore'

export const App = () => {
	const { t } = useTranslation('filter')

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
		</main>
	)
}
