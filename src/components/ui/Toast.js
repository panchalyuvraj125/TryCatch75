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
    success: 'color: var(--success)',
    error: 'color: var(--danger)',
    warning: 'color: var(--warning)',
    info: 'color: var(--accent)',
  };

  toast.innerHTML = `
    <span style="${colors[type] || colors.info}; font-weight: 600; font-size: 16px;">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}
