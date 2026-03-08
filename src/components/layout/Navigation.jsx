import { tripData } from '../../data/tripData';
import { useTrip } from '../../context/TripContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { activeDay } = useTrip();

  const scrollToDay = (dayNumber) => {
    const el = document.getElementById(`day-${dayNumber}`);
    if (el) {
      const offset = 140;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {tripData.map((day, i) => (
          <span key={day.dayNumber} style={{ display: 'contents' }}>
            <button
              className={`${styles.dayNode} ${activeDay === day.dayNumber ? styles.dayNodeActive : ''}`}
              onClick={() => scrollToDay(day.dayNumber)}
            >
              {day.theme === 'twin-peaks' && <span className={styles.themeIcon}>🦉</span>}
              {day.theme === 'twilight' && <span className={styles.themeIcon}>🌲</span>}
              <span className={styles.dayNum}>Day {day.dayNumber}</span>
              <span className={styles.dayLocation}>{day.location.split(' / ')[0]}</span>
            </button>
            {i < tripData.length - 1 && <span className={styles.connector} />}
          </span>
        ))}
      </div>
    </nav>
  );
}
