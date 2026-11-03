import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { getFilterItems } from '@/shared/api/filter'

export const App = () => {
	const { t } = useTranslation('filter')

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

			<pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
				{JSON.stringify(filterItems, null, 2)}
			</pre>
		</main>
	)
}
