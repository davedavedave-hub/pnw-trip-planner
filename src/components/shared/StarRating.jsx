import { Star } from 'lucide-react';

export default function StarRating({ rating, reviews, source, size = 14 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: '1px' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.floor(rating) ? '#e8a838' : (i < rating ? '#e8a838' : 'none')}
            color="#e8a838"
            strokeWidth={i < Math.floor(rating) ? 0 : 1.5}
            style={i < rating && i >= Math.floor(rating) ? {
              clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`
            } : {}}
          />
        ))}
      </div>
      <span style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-timber-light)',
        fontWeight: 500
      }}>
        {rating}
      </span>
      {reviews > 0 && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-timber-muted)' }}>
          ({reviews.toLocaleString()}{source ? ` on ${source}` : ''})
        </span>
      )}
    </div>
  );
}
