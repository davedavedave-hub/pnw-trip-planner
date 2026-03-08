const categoryStyles = {
  'must-do': { bg: '#d16b3f', color: '#fff', label: 'Must-Do' },
  'recommended': { bg: '#29503d', color: '#fff', label: 'Recommended' },
  'optional': { bg: '#4a6fa5', color: '#fff', label: 'Optional' },
  'romantic': { bg: '#c75b5b', color: '#fff', label: 'Romantic' }
};

export default function CategoryBadge({ category, small = false }) {
  const style = categoryStyles[category];
  if (!style) return null;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: small ? '1px 8px' : '2px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: small ? '0.65rem' : 'var(--text-xs)',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      backgroundColor: style.bg,
      color: style.color,
      lineHeight: small ? '1.4' : '1.6'
    }}>
      {category === 'romantic' && '♥ '}
      {style.label}
    </span>
  );
}
