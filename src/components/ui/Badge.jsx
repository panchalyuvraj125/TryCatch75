const statusStyles = {
  safe: 'bg-[var(--accent-green)]/15 text-[var(--accent-green)] border-[var(--accent-green)]/30',
  danger: 'bg-[var(--accent-yellow)]/15 text-[var(--accent-yellow)] border-[var(--accent-yellow)]/30',
  critical: 'bg-[var(--accent-red)]/15 text-[var(--accent-red)] border-[var(--accent-red)]/30',
  info: 'bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)] border-[var(--accent-cyan)]/30',
  purple: 'bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] border-[var(--accent-purple)]/30',
};

export default function Badge({
  children,
  variant = 'info',
  size = 'sm',
  className = '',
  dot = false,
}) {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        font-mono tracking-wide
        ${statusStyles[variant] || statusStyles.info}
        ${sizeClasses[size] || sizeClasses.sm}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`}
        />
      )}
      {children}
    </span>
  );
}
