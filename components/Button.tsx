import React from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'background' | 'text'
}

function Button({ variant = 'background', ...props }: ButtonProps) {
  if (variant === 'background') return <BackgroundButton {...props} />
  return <TextButton {...props} />
}

const BackgroundButton = ({
  children,
  className,
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    type={type}
    className={twMerge(
      `text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-500`,
      className
    )}
  >
    {children}
  </button>
)

const TextButton = ({
  children,
  className,
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    type={type}
    className={twMerge(
      `text-blue-700 hover:text-blue-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-500`,
      className
    )}
  >
    {children}
  </button>
)

export default Button
