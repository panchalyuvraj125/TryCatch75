/**
 * Toast notification system.
 * Uses safe DOM manipulation (no innerHTML — XSS safe).
 */
export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const colors = {
    success: 'var(--success)',
    error: 'var(--danger)',
    warning: 'var(--warning)',
    info: 'var(--accent)',
  };

  const iconSpan = document.createElement('span');
  iconSpan.style.color = colors[type] || colors.info;
  iconSpan.style.fontWeight = '600';
  iconSpan.style.fontSize = '16px';
  iconSpan.style.flexShrink = '0';
  iconSpan.textContent = icons[type] || icons.info;

  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}
