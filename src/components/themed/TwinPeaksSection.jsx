import { Check } from 'lucide-react';
import { twinPeaksLocations, twinPeaksQuotes } from '../../data/twinPeaks';
import { useTrip } from '../../context/TripContext';
import styles from './TwinPeaksSection.module.css';

export default function TwinPeaksSection() {
  const { selections } = useTrip();

  const isInItinerary = (location) => {
    if (location.activityId) {
      return Object.values(selections).some(
        daySel => daySel.activities.includes(location.activityId)
      );
    }
    if (location.hotelId) {
      return Object.values(selections).some(
        daySel => daySel.hotel === location.hotelId
      );
    }
    return false;
  };

  const randomQuote = twinPeaksQuotes[Math.floor(Math.random() * twinPeaksQuotes.length)];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.icon}>🦉</span>
          <h2 className={styles.title}>Twin Peaks Locations</h2>
          <p className={styles.subtitle}>The owls are not what they seem</p>
        </div>

        <div className={styles.locations}>
          {twinPeaksLocations.map(location => {
            const inTrip = isInItinerary(location);
            return (
              <div key={location.id} className={styles.locationCard}>
                <div className={`${styles.locationCheck} ${inTrip ? styles.locationCheckActive : ''}`}>
                  {inTrip && <Check size={12} strokeWidth={3} />}
                </div>
                <div className={styles.locationContent}>
                  <div className={styles.locationName}>{location.name}</div>
                  <div className={styles.locationTvName}>"{location.tvName}"</div>
                  <div className={styles.locationDesc}>{location.description}</div>
                  {location.visitTip && (
                    <div className={styles.locationTip}>Tip: {location.visitTip}</div>
                  )}
                  {location.dayNumber && (
                    <div className={styles.locationDay}>
                      {inTrip ? '✓ In your itinerary' : `Available on Day ${location.dayNumber}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.quote}>
          <div className={styles.quoteText}>"{randomQuote.quote}"</div>
          <div className={styles.quoteAuthor}>— {randomQuote.character}</div>
        </div>
      </div>
    </section>
  );
}
