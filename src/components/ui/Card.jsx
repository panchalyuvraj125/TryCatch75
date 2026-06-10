import { motion } from 'framer-motion';

const statusStyles = {
  default: '',
  safe: 'cyber-card--safe',
  danger: 'cyber-card--danger',
  critical: 'cyber-card--critical',
};

export default function Card({
  children,
  variant = 'default',
  glow = false,
  hoverable = true,
  className = '',
  onClick,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { y: -2 } : {}}
      className={`
        cyber-card
        ${statusStyles[variant] || ''}
        ${glow ? 'shadow-glow-cyan' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
