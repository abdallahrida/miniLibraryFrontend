import type { InputHTMLAttributes } from 'react'

import './appSearchInput.css'

type AppSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>

export default function AppSearchInput({
  value,
  onChange,
  placeholder = 'Search books…',
  className,
  ...inputProps
}: AppSearchInputProps) {
  return (
    <input
      type="search"
      className={['app-search-input', className].filter(Boolean).join(' ')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search books"
      {...inputProps}
    />
  )
}
