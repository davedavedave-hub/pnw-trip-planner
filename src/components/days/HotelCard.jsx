import { useState } from 'react';
import { Check, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import StarRating from '../shared/StarRating';
import CategoryBadge from '../shared/CategoryBadge';
import ExternalLink from '../shared/ExternalLink';
import { buildGoogleHotelsUrl } from '../../utils/searchLinks';
import { useTrip } from '../../context/TripContext';
import { parseDateLocal, addDays, toISODate } from '../../utils/dateUtils';
import styles from './HotelCard.module.css';

export default function HotelCard({ hotel, dayNumber, isSelected, hotelNights }) {
  const { startDate, dispatch } = useTrip();
  const [livePrice, setLivePrice] = useState(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  const handleSelect = () => {
    dispatch({ type: 'SELECT_HOTEL', payload: { dayNumber, hotelId: hotel.id } });
  };

  const handleNightsChange = (e) => {
    e.stopPropagation();
    dispatch({ type: 'SET_HOTEL_NIGHTS', payload: { dayNumber, nights: parseInt(e.target.value) } });
  };

  const handleLivePrice = async (e) => {
    e.stopPropagation();
    setIsLoadingPrice(true);
    try {
      const start = parseDateLocal(startDate);
      const checkin = start ? toISODate(addDays(start, dayNumber - 1)) : null;
      const checkout = checkin ? toISODate(addDays(parseDateLocal(checkin), hotelNights || 1)) : null;

      let apiUrl = `/api/hotels?hotel=${encodeURIComponent(hotel.searchQuery || hotel.name)}`;
      if (checkin) apiUrl += `&checkin=${checkin}`;
      if (checkout) apiUrl += `&checkout=${checkout}`;

      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.success) {
        setLivePrice(data.priceParams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  const start = parseDateLocal(startDate);
  const checkin = start ? toISODate(addDays(start, dayNumber - 1)) : '';
  const checkout = start ? toISODate(addDays(start, dayNumber - 1 + (hotelNights || 1))) : '';

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={handleSelect}
    >
      {isSelected && (
        <div className={styles.checkmark}>
          <Check size={14} strokeWidth={3} />
        </div>
      )}

      <div className={styles.imageWrap}>
        <img src={hotel.image} alt={hotel.name} className={styles.image} loading="lazy" />
        {hotel.estimatedCostPerNight > 0 && (
          <div className={styles.priceOverlay}>
            ${hotel.estimatedCostPerNight}
            <span className={styles.priceNight}>/night</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <h4 className={styles.name}>{hotel.name}</h4>
          <CategoryBadge category={hotel.category} small />
        </div>

        <StarRating
          rating={hotel.rating}
          reviews={hotel.reviews}
          source={hotel.reviewSource}
        />

        <p className={styles.description}>{hotel.description}</p>

        {isSelected && (
          <div className={styles.nightsRow}>
            <span className={styles.nightsLabel}>Nights:</span>
            <select
              className={styles.nightsSelect}
              value={hotelNights || 1}
              onChange={handleNightsChange}
              onClick={e => e.stopPropagation()}
            >
              {[1, 2, 3, 4].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {hotel.estimatedCostPerNight > 0 && (
              <span className={styles.nightsTotal}>
                ${hotel.estimatedCostPerNight * (hotelNights || 1)} est.
              </span>
            )}
          </div>
        )}

        {livePrice && (
          <div className={styles.livePriceBox}>
            <div className={styles.livePriceLabel}>Live Pricing</div>
            <div className={styles.livePriceAmount}>${livePrice.total}</div>
            <div className={styles.livePriceDetail}>
              {livePrice.nights} night{livePrice.nights > 1 ? 's' : ''} @ ${livePrice.basePricePerNight}/nt
            </div>
          </div>
        )}

        <button
          className={styles.liveButton}
          onClick={handleLivePrice}
          disabled={isLoadingPrice}
        >
          {isLoadingPrice ? 'Fetching...' : 'Get Live Price'}
          <ExternalLinkIcon size={13} />
        </button>

        <div className={styles.links}>
          <ExternalLink
            href={buildGoogleHotelsUrl(hotel.searchQuery || hotel.name, checkin, checkout)}
            label="Google Hotels"
            small
          />
        </div>

        {isSelected && hotel.coupleNote && (
          <div className={styles.coupleNote}>
            ♥ {hotel.coupleNote}
          </div>
        )}
      </div>
    </div>
  );
}
