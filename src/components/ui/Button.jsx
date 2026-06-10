import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-[var(--accent-cyan)] text-[#0a0a0f] hover:shadow-glow-cyan font-semibold',
  secondary:
    'bg-[var(--accent-purple)] text-white hover:shadow-glow-purple font-semibold',
  danger:
    'bg-[var(--accent-red)] text-white hover:shadow-glow-red font-semibold',
  success:
    'bg-[var(--accent-green)] text-[#0a0a0f] hover:shadow-glow-green font-semibold',
  ghost:
    'bg-transparent border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card)]',
  outline:
    'bg-transparent border border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[#0a0a0f]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      icon: Icon,
      iconRight: IconRight,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        className={`
          inline-flex items-center justify-center gap-2
          transition-all duration-200 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${className}
        `}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : Icon ? (
          <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        ) : null}
        {children}
        {IconRight && !loading && (
          <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
