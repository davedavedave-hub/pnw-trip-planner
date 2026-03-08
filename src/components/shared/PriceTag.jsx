export default function PriceTag({ amount, hint, range, perNight = false }) {
  if (amount === 0 || hint === 'Free') {
    return (
      <span style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        color: 'var(--color-forest-green)',
      }}>
        Free
      </span>
    );
  }

  return (
    <span style={{
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      color: 'var(--color-timber-dark)',
    }}>
      {hint || (amount ? `$${amount}${perNight ? '/night' : ''}` : '')}
      {range && (
        <span style={{
          marginLeft: '6px',
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          color: 'var(--color-timber-light)',
        }}>
          {range}
        </span>
      )}
    </span>
  );
}
