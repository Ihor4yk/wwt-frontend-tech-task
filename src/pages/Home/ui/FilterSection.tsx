import { type CSSProperties, useId } from 'react'

import type { FilterItem } from '@/shared/api/types/Filter'

import { FilterOption } from './FilterOption'

interface FilterSectionProps {
	filter: FilterItem
	selectedOptionIds: string[]
	onOptionChange: (optionId: string, checked: boolean) => void
}

const formatFilterName = (name: string) => name.replace(/,\s+(and\b)/i, ' $1')

export const FilterSection = ({
	filter,
	selectedOptionIds,
	onOptionChange
}: FilterSectionProps) => {
	const headingId = useId()
	const gridStyle: CSSProperties & {
		'--mobile-rows': number
		'--tablet-rows': number
		'--desktop-rows': number
	} = {
		'--mobile-rows': Math.max(1, filter.options.length),
		'--tablet-rows': Math.max(1, Math.ceil(filter.options.length / 2)),
		'--desktop-rows': Math.max(1, Math.ceil(filter.options.length / 3))
	}

	return (
		<section
			aria-labelledby={headingId}
			className="flex flex-col gap-6 border-b-2 border-[#B4B4B4] py-8 last:border-b-0"
		>
			<h3
				id={headingId}
				className="font-[Inter] text-2xl leading-[29px] font-medium text-[#31393C]"
			>
				{formatFilterName(filter.name)}
			</h3>
			<div
				style={gridStyle}
				className="grid grid-flow-col grid-cols-1 grid-rows-[repeat(var(--mobile-rows),minmax(24px,auto))] gap-x-8 gap-y-4 md:grid-cols-2 md:grid-rows-[repeat(var(--tablet-rows),minmax(24px,auto))] xl:grid-cols-3 xl:grid-rows-[repeat(var(--desktop-rows),minmax(24px,auto))]"
			>
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
