import { Check } from 'lucide-react';
import StarRating from '../shared/StarRating';
import CategoryBadge from '../shared/CategoryBadge';
import PriceTag from '../shared/PriceTag';
import ExternalLink from '../shared/ExternalLink';
import { buildTripAdvisorUrl, buildGoogleMapsUrl } from '../../utils/searchLinks';
import styles from './ActivityCard.module.css';

export default function ActivityCard({ activity, isSelected, onToggle }) {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onToggle}
    >
      {isSelected && (
        <div className={styles.checkmark}>
          <Check size={14} strokeWidth={3} />
        </div>
      )}

      <div className={styles.imageWrap}>
        <img
          src={activity.image}
          alt={activity.name}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          {activity.duration && <span className={styles.duration}>{activity.duration}</span>}
          <CategoryBadge category={activity.category} small />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <h4 className={styles.name}>{activity.name}</h4>
        </div>

        <StarRating
          rating={activity.rating}
          reviews={activity.reviews}
          source={activity.reviewSource}
        />

        <p className={styles.description}>{activity.description}</p>

        <div className={styles.meta}>
          <PriceTag
            amount={activity.estimatedCost}
            hint={activity.priceHint}
          />
          <div className={styles.links}>
            <ExternalLink
              href={buildTripAdvisorUrl(activity.name + ' ' + (activity.searchQuery || ''))}
              label="TripAdvisor"
              small
            />
            <ExternalLink
              href={buildGoogleMapsUrl(activity.name)}
              label="Map"
              small
            />
          </div>
        </div>

        {isSelected && activity.coupleNote && (
          <div className={styles.coupleNote}>
            ♥ {activity.coupleNote}
          </div>
        )}

        {isSelected && activity.twinPeaksNote && (
          <div className={styles.themeNote}>
            🦉 {activity.twinPeaksNote}
          </div>
        )}

        {isSelected && activity.twilightNote && (
          <div className={`${styles.themeNote} ${styles.twilightThemeNote}`}>
            🌲 {activity.twilightNote}
          </div>
        )}
      </div>
    </div>
  );
}
