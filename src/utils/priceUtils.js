export function formatCurrency(amount, showFreeAsZero = false) {
  if (amount == null || amount === 0) return showFreeAsZero ? '$0' : 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPriceRange(range) {
  const labels = { '$': 'Budget', '$$': 'Moderate', '$$$': 'Upscale', '$$$$': 'Luxury' };
  return labels[range] || range;
}
