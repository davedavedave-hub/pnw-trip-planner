import { ChevronDown, Calendar, Plane } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { parseDateLocal, addDays, formatDate, toISODate } from '../../utils/dateUtils';
import { buildGoogleFlightsUrl } from '../../utils/searchLinks';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const { startDate, dispatch } = useTrip();

  const start = parseDateLocal(startDate);
  const end = start ? addDays(start, 7) : null;

  return (
    <section className={styles.hero}>
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1600&q=80)' }}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.posterFrame}>
          <div className={styles.preTitle}>An 8-Day Adventure</div>
          <h1 className={styles.title}>Pacific Northwest</h1>
          <p className={styles.subtitle}>
            Mountains, rainforests, coastlines &amp; a little mystery
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>8</span>
              <span className={styles.statLabel}>Days</span>
            </div>
            <span className={styles.dividerLine} />
            <div className={styles.stat}>
              <span className={styles.statValue}>2</span>
              <span className={styles.statLabel}>National Parks</span>
            </div>
            <span className={styles.dividerLine} />
            <div className={styles.stat}>
              <span className={styles.statValue}>2</span>
              <span className={styles.statLabel}>Countries</span>
            </div>
            <span className={styles.dividerLine} />
            <div className={styles.stat}>
              <span className={styles.statValue}>1</span>
              <span className={styles.statLabel}>Epic Journey</span>
            </div>
          </div>

          <div className={styles.dateSection}>
            <Calendar size={16} style={{ color: 'var(--color-sunset-gold)', opacity: 0.8 }} />
            <span className={styles.dateLabel}>Start Date:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => dispatch({ type: 'SET_START_DATE', payload: e.target.value })}
              className={styles.dateInput}
            />
            {end && (
              <span className={styles.dateLabel}>
                — {formatDate(end)}
              </span>
            )}
          </div>

          <a
            href={buildGoogleFlightsUrl('Philadelphia PHL', 'Seattle SEA', startDate)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.flightLink}
          >
            <Plane size={14} />
            Search PHL → SEA Flights
          </a>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
