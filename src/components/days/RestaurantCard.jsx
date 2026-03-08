import { Check } from 'lucide-react';
import StarRating from '../shared/StarRating';
import ExternalLink from '../shared/ExternalLink';
import { buildYelpUrl } from '../../utils/searchLinks';
import styles from './RestaurantCard.module.css';

export default function RestaurantCard({ restaurant, location, isSelected, onToggle }) {
  const mealColors = {
    breakfast: '#e8a838',
    lunch: '#4a6fa5',
    dinner: '#c75b5b',
    any: '#8d6e63'
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onToggle}
    >
      <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}>
        {isSelected && <Check size={12} strokeWidth={3} />}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h5 className={styles.name}>{restaurant.name}</h5>
          <span
            className={styles.mealBadge}
            style={{ borderBottom: `2px solid ${mealColors[restaurant.meal] || mealColors.any}` }}
          >
            {restaurant.meal}
          </span>
        </div>

        <div className={styles.cuisine}>{restaurant.cuisine}</div>

        <StarRating
          rating={restaurant.rating}
          reviews={restaurant.reviews}
          source={restaurant.reviewSource}
          size={12}
        />

        <p className={styles.description}>{restaurant.description}</p>

        <div className={styles.meta}>
          <div className={styles.price}>
            ~${restaurant.estimatedCostPerPerson}/person
            <span className={styles.priceNote}> ({restaurant.priceRange})</span>
          </div>
          <ExternalLink
            href={buildYelpUrl(restaurant.name, location)}
            label="Yelp"
            icon="🔍"
            small
          />
        </div>

        {isSelected && restaurant.coupleNote && (
          <div className={styles.coupleNote}>
            ♥ {restaurant.coupleNote}
          </div>
        )}

        {isSelected && restaurant.twilightNote && (
          <div className={styles.themeNote}>
            🌲 {restaurant.twilightNote}
          </div>
        )}
      </div>
    </div>
  );
}
