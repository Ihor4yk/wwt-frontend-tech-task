import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { FilterItem } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

import { FilterSection } from './FilterSection'

interface FilterModalProps {
	isOpen: boolean
	filterItems: FilterItem[]
	selectedFilters: SearchRequestFilter
	onClose: () => void
	onApply: (filters: SearchRequestFilter) => void
}

export const FilterModal = ({
	isOpen,
	filterItems,
	selectedFilters,
	onClose,
	onApply
}: FilterModalProps) => {
	const { t } = useTranslation('filter')
	const [draft, setDraft] = useState<Record<string, string[]>>({})
	const dialogRef = useRef<HTMLDialogElement>(null)
	const titleId = useId()

	useLayoutEffect(() => {
		const dialog = dialogRef.current

		if (!dialog) {
			return
		}

		if (isOpen && !dialog.open) {
			dialog.showModal()
		} else if (!isOpen && dialog.open) {
			dialog.close()
		}
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) {
			setDraft({})
			return
		}

		const filtersById = new Map(filterItems.map(filter => [filter.id, filter]))
		const restoredDraft = selectedFilters.reduce<Record<string, string[]>>(
			(accumulator, selectedFilter) => {
				const filter = filtersById.get(selectedFilter.id)

				if (filter) {
					const availableOptionIds = new Set(
						filter.options.map(option => option.id)
					)
					accumulator[selectedFilter.id] = selectedFilter.optionsIds.filter(
						optionId => availableOptionIds.has(optionId)
					)
				}

				return accumulator
			},
			{}
		)

		setDraft(restoredDraft)
	}, [filterItems, isOpen, selectedFilters])

	const handleOptionChange = (
		filterId: string,
		optionId: string,
		checked: boolean
	) => {
		setDraft(currentDraft => {
			const selectedOptionIds = currentDraft[filterId] ?? []

			return {
				...currentDraft,
				[filterId]: checked
					? selectedOptionIds.includes(optionId)
						? selectedOptionIds
						: [...selectedOptionIds, optionId]
					: selectedOptionIds.filter(id => id !== optionId)
			}
		})
	}

	const handleApply = () => {
		const filters = filterItems.flatMap(filter => {
			const selectedOptionIds = new Set(draft[filter.id] ?? [])
			const optionsIds = filter.options
				.filter(option => selectedOptionIds.has(option.id))
				.map(option => option.id)

			return optionsIds.length > 0
				? [{ id: filter.id, type: filter.type, optionsIds }]
				: []
		})

		onApply(filters)
	}

	return (
		<dialog
			ref={dialogRef}
			aria-modal="true"
			aria-labelledby={titleId}
			onCancel={event => {
				event.preventDefault()
				onClose()
			}}
			className={`fixed inset-0 m-auto flex h-dvh w-full max-h-dvh flex-col overflow-hidden rounded-none border-0 bg-white p-0 text-[#31393C] sm:h-auto sm:max-h-[calc(100dvh_-_2rem)] sm:w-[calc(100vw_-_2rem)] sm:max-w-7xl sm:rounded-2xl [&::backdrop]:bg-[rgba(27,27,27,0.3)] [&::backdrop]:backdrop-blur-[12.5px] ${isOpen ? 'flex' : 'hidden'}`}
		>
			<header className="relative flex shrink-0 items-center justify-center border-b border-[#B4B4B4] px-4 py-4 sm:px-8 sm:py-6">
				<h2
					id={titleId}
					className="font-[Inter] text-[40px] leading-[48px] font-medium text-[#31393C]"
				>
					{t('filterModalTitle')}
				</h2>
				<button
					type="button"
					aria-label={t('closeFilterModal')}
					onClick={onClose}
					className="absolute right-4 flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5F00] sm:right-8"
				>
					<svg
						aria-hidden="true"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M6 6l12 12M18 6 6 18"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
				</button>
			</header>
			<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-6 sm:px-8">
				<div className="flex flex-col">
					{filterItems.map(filter => (
						<FilterSection
							key={filter.id}
							filter={filter}
							selectedOptionIds={draft[filter.id] ?? []}
							onOptionChange={(optionId, checked) =>
								handleOptionChange(filter.id, optionId, checked)
							}
						/>
					))}
				</div>
			</div>
			<footer className="flex shrink-0 justify-center border-t border-[#B4B4B4] px-4 py-4 sm:px-8 sm:py-6">
				<button
					type="button"
					onClick={handleApply}
					className="w-full rounded-2xl bg-[#FF5F00] px-6 py-[26px] font-[Inter] text-base leading-5 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31393C] sm:w-[184px] sm:px-[70px]"
				>
					{t('applyFilters')}
				</button>
			</footer>
		</dialog>
	)
}
