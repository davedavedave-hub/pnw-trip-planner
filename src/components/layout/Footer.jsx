import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>PNW Journey</div>
        <div className={styles.tagline}>Through mountains, forests &amp; mystery</div>
        <div className={styles.divider} />
        <div className={styles.links}>
          <a href="https://www.nps.gov/mora" target="_blank" rel="noopener noreferrer" className={styles.link}>Mt. Rainier NPS</a>
          <a href="https://www.nps.gov/olym" target="_blank" rel="noopener noreferrer" className={styles.link}>Olympic NPS</a>
          <a href="https://visitseattle.org" target="_blank" rel="noopener noreferrer" className={styles.link}>Visit Seattle</a>
          <a href="https://www.tourismvancouver.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Tourism Vancouver</a>
        </div>
        <div className={styles.copyright}>&copy; {new Date().getFullYear()} PNW Journey Planner</div>
      </div>
    </footer>
  );
}
