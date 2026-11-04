import { useId } from 'react'

import type { FilterItem } from '@/shared/api/types/Filter'

import { FilterOption } from './FilterOption'

interface FilterSectionProps {
	filter: FilterItem
	selectedOptionIds: string[]
	onOptionChange: (optionId: string, checked: boolean) => void
}

export const FilterSection = ({
	filter,
	selectedOptionIds,
	onOptionChange
}: FilterSectionProps) => {
	const headingId = useId()

	return (
		<section
			aria-labelledby={headingId}
			className="flex flex-col gap-6 border-b border-[#B4B4B4] pb-6"
		>
			<h3
				id={headingId}
				className="font-[Inter] text-2xl font-medium text-[#31393C]"
			>
				{filter.name}
			</h3>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{filter.options.map(option => (
					<FilterOption
						key={option.id}
						option={option}
						checked={selectedOptionIds.includes(option.id)}
						onChange={onOptionChange}
					/>
				))}
			</div>
		</section>
	)
}
