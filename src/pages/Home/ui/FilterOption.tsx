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
		className={`flex w-full min-w-0 items-center gap-4 font-[Inter] text-[16px] leading-[19px] text-[#31393C] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
	>
		<span className="relative flex size-6 shrink-0 items-center justify-center">
			<input
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={event => onChange(option.id, event.currentTarget.checked)}
				className="peer absolute inset-0 z-10 size-6 appearance-none cursor-pointer rounded-[2px] border-2 border-[#31393C] bg-white checked:bg-[#31393C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5F00] disabled:cursor-not-allowed"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute z-20 hidden size-3 peer-checked:block"
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 12 12"
					fill="none"
					className="size-full"
				>
					<path
						d="m2 6 2.5 2.5L10 3"
						stroke="white"
						strokeWidth="1.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
		</span>
		<span className="min-w-0 break-words">{option.name}</span>
	</label>
)
