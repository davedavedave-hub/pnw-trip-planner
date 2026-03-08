import { Compass, Bed, UtensilsCrossed, MapPin, Car, Calendar } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { parseDateLocal, addDays, formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/priceUtils';
import ActivityCard from './ActivityCard';
import HotelCard from './HotelCard';
import RestaurantCard from './RestaurantCard';
import styles from './DayCard.module.css';

export default function DayCard({ day }) {
  const { startDate, selections, dispatch } = useTrip();

  const daySel = selections[day.dayNumber] || { activities: [], hotel: null, hotelNights: 1, restaurants: [] };

  const start = parseDateLocal(startDate);
  const dayDate = start ? addDays(start, day.dayNumber - 1) : null;

  const dayEstimate = (() => {
    let total = 0;
    daySel.activities.forEach(actId => {
      const a = day.activities.find(x => x.id === actId);
      if (a) total += (a.estimatedCost || 0) * 2;
    });
    if (daySel.hotel) {
      const h = day.hotels.find(x => x.id === daySel.hotel);
      if (h) total += (h.estimatedCostPerNight || 0) * (daySel.hotelNights || 1);
    }
    daySel.restaurants.forEach(rId => {
      const r = day.restaurants?.find(x => x.id === rId);
      if (r) total += (r.estimatedCostPerPerson || 0) * 2;
    });
    return total;
  })();

  return (
    <div id={`day-${day.dayNumber}`} className={styles.day}>
      <div className={styles.banner}>
        <img src={day.heroImage} alt={day.title} className={styles.bannerImage} loading="lazy" />
        <div className={styles.bannerOverlay}>
          <div className={styles.dayBadge}>Day {day.dayNumber}</div>
          <h2 className={styles.dayTitle}>{day.title}</h2>
          <p className={styles.daySubtitle}>{day.subtitle}</p>
          <div className={styles.dayMeta}>
            <span className={styles.metaPill}>
              <MapPin size={12} /> {day.location}
            </span>
            {dayDate && (
              <span className={styles.metaPill}>
                <Calendar size={12} /> {formatDate(dayDate)}
              </span>
            )}
            {day.driveInfo && (
              <span className={styles.metaPill}>
                <Car size={12} /> {day.driveInfo.duration} from {day.driveInfo.from}
              </span>
            )}
            {day.theme === 'twin-peaks' && (
              <span className={`${styles.themeBadge} ${styles.themeTwinPeaks}`}>
                🦉 Twin Peaks
              </span>
            )}
            {day.theme === 'twilight' && (
              <span className={`${styles.themeBadge} ${styles.themeTwilight}`}>
                🌲 Twilight Territory
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Activities */}
        <h3 className={styles.sectionTitle}>
          <Compass size={20} className={styles.sectionIcon} />
          What to Do
          <span className={styles.sectionSubtitle}>Select all that interest you</span>
        </h3>
        <div className={`${styles.grid} ${day.activities.length >= 3 ? styles.gridThree : ''}`}>
          {day.activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isSelected={daySel.activities.includes(activity.id)}
              onToggle={() => dispatch({
                type: 'TOGGLE_ACTIVITY',
                payload: { dayNumber: day.dayNumber, activityId: activity.id }
              })}
            />
          ))}
        </div>

        {/* Hotels */}
        {day.hotels.length > 0 && (
          <>
            <div className={styles.sectionDivider} />
            <h3 className={styles.sectionTitle}>
              <Bed size={20} className={styles.sectionIcon} />
              Where to Stay
              <span className={styles.sectionSubtitle}>Select one</span>
            </h3>
            <div className={`${styles.grid} ${day.hotels.length >= 3 ? styles.gridThree : ''}`}>
              {day.hotels.map(hotel => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  dayNumber={day.dayNumber}
                  isSelected={daySel.hotel === hotel.id}
                  hotelNights={daySel.hotelNights}
                />
              ))}
            </div>
          </>
        )}

        {/* Restaurants */}
        {day.restaurants && day.restaurants.length > 0 && (
          <>
            <div className={styles.sectionDivider} />
            <h3 className={styles.sectionTitle}>
              <UtensilsCrossed size={20} className={styles.sectionIcon} />
              Where to Eat
              <span className={styles.sectionSubtitle}>Select any that sound good</span>
            </h3>
            <div className={styles.restaurantGrid}>
              {day.restaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  location={day.location}
                  isSelected={daySel.restaurants.includes(restaurant.id)}
                  onToggle={() => dispatch({
                    type: 'TOGGLE_RESTAURANT',
                    payload: { dayNumber: day.dayNumber, restaurantId: restaurant.id }
                  })}
                />
              ))}
            </div>
          </>
        )}

        {/* Day Summary */}
        <div className={styles.daySummary}>
          <span className={styles.summaryLabel}>
            Day {day.dayNumber} Estimated Cost
          </span>
          <span className={styles.summaryValue}>
            {formatCurrency(dayEstimate)}
          </span>
        </div>
      </div>
    </div>
  );
}
