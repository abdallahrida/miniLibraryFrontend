import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './appButton.css'

type AppButtonVariant = 'primary' | 'secondary' | 'success' | 'danger'

type AppButtonProps = {
  variant?: AppButtonVariant
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function AppButton({
  variant = 'secondary',
  children,
  className,
  ...buttonProps
}: AppButtonProps) {
  const resolvedClassName = ['app-button', `app-button--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button {...buttonProps} className={resolvedClassName}>
      {children}
    </button>
  )
}
