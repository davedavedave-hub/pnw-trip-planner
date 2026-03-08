import { useTrip } from '../../context/TripContext';
import { formatCurrency } from '../../utils/priceUtils';
import styles from './BudgetTracker.module.css';

export default function BudgetTracker() {
  const { budget, selectedCount, dispatch } = useTrip();

  return (
    <div className={styles.tracker}>
      <div className={styles.inner}>
        <div className={styles.segments}>
          <div className={styles.segment}>
            <span className={styles.segmentLabel}>Lodging</span>
            <span className={styles.segmentValue}>{formatCurrency(budget.lodging, true)}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.segment}>
            <span className={styles.segmentLabel}>Dining</span>
            <span className={styles.segmentValue}>{formatCurrency(budget.dining, true)}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.segment}>
            <span className={styles.segmentLabel}>Activities</span>
            <span className={styles.segmentValue}>{formatCurrency(budget.activities, true)}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.segment}>
            <span className={styles.segmentLabel}>Fixed</span>
            <span className={styles.segmentValue}>{formatCurrency(budget.fixed, true)}</span>
          </div>
          <div className={styles.divider} />
          <div className={`${styles.segment} ${styles.totalSegment}`}>
            <span className={styles.segmentLabel}>Trip Total</span>
            <span className={`${styles.segmentValue} ${styles.segmentValueHighlight}`}>
              {formatCurrency(budget.total)}
            </span>
          </div>
        </div>

        <button
          className={styles.detailsBtn}
          onClick={() => dispatch({ type: 'TOGGLE_BUDGET_BREAKDOWN' })}
        >
          {selectedCount} Items Selected — View Details
        </button>
      </div>
    </div>
  );
}
