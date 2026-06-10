import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="font-mono text-8xl font-bold text-gradient mb-4">404</div>
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
          Lost in the Matrix
        </h1>
        <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
          This page doesn't exist. Maybe you bunked too many classes and ended up here.
        </p>
        <Link to="/dashboard">
          <Button icon={Home}>Back to Dashboard</Button>
        </Link>
      </motion.div>
    </div>
  );
}
