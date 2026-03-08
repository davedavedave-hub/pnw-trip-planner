import { X } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { tripData } from '../../data/tripData';
import { fixedCostDefaults } from '../../data/budgetDefaults';
import { formatCurrency } from '../../utils/priceUtils';
import styles from './BudgetBreakdown.module.css';

export default function BudgetBreakdown() {
  const { showBudgetBreakdown, budget, fixedCosts, selections, dispatch } = useTrip();

  if (!showBudgetBreakdown) return null;

  const categoryColors = {
    lodging: '#29503d',
    dining: '#d16b3f',
    activities: '#4a6fa5',
    fixed: '#8d6e63'
  };

  const total = budget.total || 1;

  const perDayBreakdown = tripData.map(day => {
    const daySel = selections[day.dayNumber];
    let dayTotal = 0;

    daySel.activities.forEach(actId => {
      const a = day.activities.find(x => x.id === actId);
      if (a) dayTotal += (a.estimatedCost || 0) * 2;
    });

    if (daySel.hotel) {
      const h = day.hotels.find(x => x.id === daySel.hotel);
      if (h) dayTotal += (h.estimatedCostPerNight || 0) * (daySel.hotelNights || 1);
    }

    daySel.restaurants.forEach(rId => {
      const r = day.restaurants?.find(x => x.id === rId);
      if (r) dayTotal += (r.estimatedCostPerPerson || 0) * 2;
    });

    return { dayNumber: day.dayNumber, title: day.title, location: day.location, total: dayTotal };
  });

  return (
    <div className={styles.overlay} onClick={() => dispatch({ type: 'TOGGLE_BUDGET_BREAKDOWN' })}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Budget Breakdown</span>
          <button className={styles.closeBtn} onClick={() => dispatch({ type: 'TOGGLE_BUDGET_BREAKDOWN' })}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.totalBox}>
          <div className={styles.totalLabel}>Estimated Trip Total</div>
          <div className={styles.totalAmount}>{formatCurrency(budget.total)}</div>
          <div className={styles.perDay}>~{formatCurrency(Math.round(budget.total / 8))}/day for 2 people</div>
        </div>

        <div className={styles.content}>
          {/* Category Bar */}
          <div className={styles.categoryBar}>
            <div className={styles.categoryBarSegment} style={{ flex: budget.lodging / total, background: categoryColors.lodging }} />
            <div className={styles.categoryBarSegment} style={{ flex: budget.dining / total, background: categoryColors.dining }} />
            <div className={styles.categoryBarSegment} style={{ flex: budget.activities / total, background: categoryColors.activities }} />
            <div className={styles.categoryBarSegment} style={{ flex: budget.fixed / total, background: categoryColors.fixed }} />
          </div>

          <div className={styles.categoryLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: categoryColors.lodging }} />
              Lodging {formatCurrency(budget.lodging)}
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: categoryColors.dining }} />
              Dining {formatCurrency(budget.dining)}
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: categoryColors.activities }} />
              Activities {formatCurrency(budget.activities)}
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: categoryColors.fixed }} />
              Fixed {formatCurrency(budget.fixed)}
            </div>
          </div>

          {/* Fixed Costs */}
          <div className={styles.sectionTitle}>Fixed Costs</div>
          {Object.entries(fixedCostDefaults).map(([key, config]) => (
            <div key={key} className={styles.fixedCostRow}>
              <span className={styles.fixedCostLabel}>{config.label}</span>
              <input
                type="number"
                className={styles.fixedCostInput}
                value={fixedCosts[key] || 0}
                onChange={(e) => dispatch({
                  type: 'UPDATE_FIXED_COST',
                  payload: { key, value: parseInt(e.target.value) || 0 }
                })}
              />
            </div>
          ))}

          {/* Per-Day Breakdown */}
          <div className={styles.sectionTitle}>Per-Day Breakdown</div>
          {perDayBreakdown.map(day => (
            <div key={day.dayNumber} className={styles.dayRow}>
              <span className={styles.dayRowLabel}>
                Day {day.dayNumber}: {day.location}
              </span>
              <span className={styles.dayRowAmount}>
                {formatCurrency(day.total)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
