import { useEffect, useRef } from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import { tripData } from './data/tripData';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import HeroSection from './components/hero/HeroSection';
import DayCard from './components/days/DayCard';
import TwinPeaksSection from './components/themed/TwinPeaksSection';
import TwilightSection from './components/themed/TwilightSection';
import BudgetTracker from './components/budget/BudgetTracker';
import BudgetBreakdown from './components/budget/BudgetBreakdown';

function AppContent() {
  const { dispatch } = useTrip();
  const dayRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const dayNum = parseInt(entry.target.id.replace('day-', ''));
            dispatch({ type: 'SET_ACTIVE_DAY', payload: dayNum });
          }
        });
      },
      { rootMargin: '-200px 0px -50% 0px', threshold: 0 }
    );

    tripData.forEach(day => {
      const el = document.getElementById(`day-${day.dayNumber}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [dispatch]);

  return (
    <div style={{ paddingBottom: 'var(--budget-bar-height)' }}>
      <Header />
      <HeroSection />
      <Navigation />

      <main className="container" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        {tripData.map(day => (
          <DayCard key={day.dayNumber} day={day} />
        ))}
      </main>

      <TwinPeaksSection />
      <TwilightSection />

      <Footer />
      <BudgetTracker />
      <BudgetBreakdown />
    </div>
  );
}

export default function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}
