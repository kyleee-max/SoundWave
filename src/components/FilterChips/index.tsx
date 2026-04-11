'use client'
import clsx from 'clsx'

interface Props<T extends string> {
  items: { label: T; dot?: string; emoji?: string }[]
  value: T
  onChange: (v: T) => void
}

export function FilterChips<T extends string>({ items, value, onChange }: Props<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {items.map(({ label, dot, emoji }) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={clsx(
            'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[12.5px] font-[450] transition-all duration-150 whitespace-nowrap',
            value === label
              ? 'bg-[#ededed] text-black border-[#ededed] font-semibold'
              : 'bg-card border-white/[0.08] text-white/50 hover:border-white/[0.18] hover:text-[#ededed]'
          )}
        >
          {emoji && <span>{emoji}</span>}
          {dot && (
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: dot }}
            />
          )}
          {label}
        </button>
      ))}
    </div>
  )
}
