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
			return
		}

		const scrollPosition = window.scrollY
		const previousBodyOverflow = document.body.style.overflow
		const previousDocumentOverflow = document.documentElement.style.overflow

		document.body.style.overflow = 'hidden'
		document.documentElement.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = previousBodyOverflow
			document.documentElement.style.overflow = previousDocumentOverflow
			window.scrollTo(0, scrollPosition)
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

	const handleClearAll = () => {
		setDraft({})
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
			onKeyDown={event => {
				if (event.key === 'Escape') {
					event.preventDefault()
					onClose()
				}
			}}
			className="fixed inset-0 m-0 h-dvh w-full max-h-none max-w-none overflow-x-hidden overflow-y-auto overscroll-contain border-0 bg-transparent p-0 text-[#31393C] [scrollbar-gutter:stable_both-edges] [&::backdrop]:bg-[rgba(27,27,27,0.3)] [&::backdrop]:backdrop-blur-[12.5px]"
		>
			<div className="mx-auto mt-4 mb-4 w-[calc(100vw-2rem)] max-w-[1280px] rounded-2xl bg-white @container/modal xl:mt-20 xl:mb-20 xl:w-[calc(100vw-160px)]">
				<header className="mx-4 grid h-20 grid-cols-[1fr_auto_1fr] items-center border-b-2 border-[#B4B4B4] sm:mx-8 sm:h-[113px]">
					<h2
						id={titleId}
						className="col-start-2 row-start-1 whitespace-nowrap font-[Inter] text-[32px] leading-10 font-medium text-[#31393C] sm:text-[40px] sm:leading-[48px]"
					>
						{t('filterModalTitle')}
					</h2>
					<button
						type="button"
						aria-label={t('closeFilterModal')}
						onClick={onClose}
						className="col-start-3 row-start-1 m-0 flex size-6 shrink-0 cursor-pointer items-center justify-center justify-self-end self-center rounded-full p-0 text-[#31393C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5F00]"
					>
						<svg
							aria-hidden="true"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<path
								d="M1 1l18 18M19 1 1 19"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</header>
				<div className="px-4 py-8 sm:px-8">
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
				<footer className="mx-4 flex justify-center border-t-2 border-[#B4B4B4] py-4 sm:mx-8 sm:box-border sm:h-[136px] sm:pt-[32px] sm:pb-10 @max-[556px]/modal:h-auto @max-[556px]/modal:min-h-[136px]">
					<div className="grid w-full grid-cols-[minmax(0,1fr)_184px_minmax(0,1fr)] items-center gap-x-4 @max-[556px]/modal:grid-cols-1 @max-[556px]/modal:gap-y-3">
						<button
							type="button"
							onClick={handleApply}
							className="col-start-2 row-start-1 h-16 w-[184px] justify-self-center cursor-pointer rounded-2xl bg-[#FF5F00] font-[Inter] text-base leading-[19px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31393C] @max-[556px]/modal:col-start-1 @max-[556px]/modal:row-start-1"
						>
							{t('applyFilters')}
						</button>
						<button
							type="button"
							onClick={handleClearAll}
							className="col-start-3 row-start-1 justify-self-end cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 text-center font-[Inter] text-base leading-none font-medium text-[#078691] underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#078691] @max-[556px]/modal:col-start-1 @max-[556px]/modal:row-start-2"
						>
							{t('clearAllParameters')}
						</button>
					</div>
				</footer>
			</div>
		</dialog>
	)
}
