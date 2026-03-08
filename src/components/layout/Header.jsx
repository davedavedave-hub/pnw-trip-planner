import { Trees, DollarSign } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatCurrency } from '../../utils/priceUtils';
import styles from './Header.module.css';

export default function Header() {
  const { budget, dispatch } = useTrip();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <Trees size={28} className={styles.logoIcon} />
          <div>
            <div className={styles.title}>PNW Journey</div>
            <div className={styles.subtitle}>Pacific Northwest Trip Planner</div>
          </div>
        </div>
        <nav className={styles.nav}>
          <button
            className={styles.budgetPill}
            onClick={() => dispatch({ type: 'TOGGLE_BUDGET_BREAKDOWN' })}
          >
            <DollarSign size={14} />
            {formatCurrency(budget.total)}
          </button>
        </nav>
      </div>
    </header>
  );
}
