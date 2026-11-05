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
		className={`flex w-full min-w-0 items-center gap-4 font-inter text-base leading-[19px] text-text-primary ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
	>
		<span className="relative flex size-6 shrink-0 items-center justify-center">
			<input
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={event => onChange(option.id, event.currentTarget.checked)}
				className="peer absolute inset-0 z-10 size-6 appearance-none cursor-pointer rounded-[2px] border-2 border-text-primary bg-white checked:bg-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute z-20 hidden size-3 peer-checked:block"
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 12 12"
					fill="none"
					className="size-full text-white"
				>
					<path
						d="m2 6 2.5 2.5L10 3"
						stroke="currentColor"
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
