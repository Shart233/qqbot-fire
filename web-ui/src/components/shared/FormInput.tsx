import { forwardRef } from 'react'

const FormInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    const { className = '', ...rest } = props
    return (
      <input
        ref={ref}
        {...rest}
        className={`w-full bg-input-bg border border-border-theme text-text-primary rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-all duration-200 ${className}`}
      />
    )
  }
)

FormInput.displayName = 'FormInput'
export default FormInput
