import type { FilterChooseOption } from '@/shared/api/types/Filter'

interface FilterOptionProps {
	option: FilterChooseOption
	checked: boolean
	disabled?: boolean
	onChange: (optionId: string, checked: boolean) => void
}

export const FilterOption = ({
	option,
	checked,
	disabled = false,
	onChange
}: FilterOptionProps) => (
	<label
		className={`flex w-full min-w-0 items-center gap-4 font-[Inter] text-base text-[#31393C] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
	>
		<input
			type="checkbox"
			checked={checked}
			disabled={disabled}
			onChange={event => onChange(option.id, event.currentTarget.checked)}
			className="size-6 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5F00]"
		/>
		<span className="min-w-0 break-words">{option.name}</span>
	</label>
)
