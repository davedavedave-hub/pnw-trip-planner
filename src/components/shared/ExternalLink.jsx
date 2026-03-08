import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

export default function ExternalLink({ href, label, icon, small = false }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: small ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: small ? '0.7rem' : 'var(--text-xs)',
        fontWeight: 500,
        color: 'var(--color-mountain-blue)',
        background: 'rgba(74, 111, 165, 0.08)',
        textDecoration: 'none',
        transition: 'all var(--transition-fast)',
        whiteSpace: 'nowrap'
      }}
    >
      {icon && <span style={{ fontSize: small ? '10px' : '12px' }}>{icon}</span>}
      {label}
      <ExternalLinkIcon size={small ? 9 : 11} />
    </a>
  );
}
