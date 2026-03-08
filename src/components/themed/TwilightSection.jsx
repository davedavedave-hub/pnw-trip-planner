import { twilightLocations } from '../../data/twilight';
import { useTrip } from '../../context/TripContext';
import styles from './TwilightSection.module.css';

export default function TwilightSection() {
  const { selections } = useTrip();

  const isInItinerary = (location) => {
    if (location.activityId) {
      return Object.values(selections).some(
        daySel => daySel.activities.includes(location.activityId)
      );
    }
    if (location.restaurantId) {
      return Object.values(selections).some(
        daySel => daySel.restaurants.includes(location.restaurantId)
      );
    }
    return false;
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.icon}>🌲</span>
          <h2 className={styles.title}>Twilight Locations</h2>
          <p className={styles.subtitle}>Where the Cullens roam and the wolves run</p>
        </div>

        <div className={styles.locations}>
          {twilightLocations.map(location => {
            const inTrip = isInItinerary(location);
            return (
              <div key={location.id} className={styles.locationCard}>
                <div className={styles.locationTop}>
                  <div className={styles.locationName}>{location.name}</div>
                  <span className={`${styles.inTripBadge} ${inTrip ? styles.inTripBadgeActive : ''}`}>
                    {inTrip ? '✓ In Trip' : `Day ${location.dayNumber}`}
                  </span>
                </div>
                <div className={styles.movieRef}>{location.movieRef}</div>
                <div className={styles.description}>{location.description}</div>
                {location.highlights && (
                  <ul className={styles.highlights}>
                    {location.highlights.map((h, i) => (
                      <li key={i} className={styles.highlight}>{h}</li>
                    ))}
                  </ul>
                )}
                {location.visitTip && (
                  <div className={styles.tip}>Tip: {location.visitTip}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
