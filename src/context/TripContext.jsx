import { createContext, useContext, useReducer, useMemo } from 'react';
import { tripData } from '../data/tripData';
import { fixedCostDefaults } from '../data/budgetDefaults';
import { getDefaultStartDate, toISODate } from '../utils/dateUtils';

const TripContext = createContext(null);

function buildInitialSelections() {
  const selections = {};
  tripData.forEach(day => {
    const mustDoActivities = day.activities
      .filter(a => a.category === 'must-do')
      .map(a => a.id);
    const defaultActivities = mustDoActivities.length > 0
      ? mustDoActivities
      : day.activities.length > 0 ? [day.activities[0].id] : [];

    selections[day.dayNumber] = {
      activities: defaultActivities,
      hotel: day.hotels.length > 0 ? day.hotels[0].id : null,
      hotelNights: 1,
      restaurants: []
    };
  });
  return selections;
}

function buildInitialFixedCosts() {
  const costs = {};
  Object.entries(fixedCostDefaults).forEach(([key, val]) => {
    costs[key] = val.default;
  });
  return costs;
}

const initialState = {
  startDate: toISODate(getDefaultStartDate()),
  selections: buildInitialSelections(),
  fixedCosts: buildInitialFixedCosts(),
  showBudgetBreakdown: false,
  activeDay: null
};

function tripReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_ACTIVITY': {
      const { dayNumber, activityId } = action.payload;
      const daySelection = state.selections[dayNumber];
      const activities = daySelection.activities.includes(activityId)
        ? daySelection.activities.filter(id => id !== activityId)
        : [...daySelection.activities, activityId];
      return {
        ...state,
        selections: {
          ...state.selections,
          [dayNumber]: { ...daySelection, activities }
        }
      };
    }

    case 'SELECT_HOTEL': {
      const { dayNumber, hotelId } = action.payload;
      const daySelection = state.selections[dayNumber];
      return {
        ...state,
        selections: {
          ...state.selections,
          [dayNumber]: {
            ...daySelection,
            hotel: daySelection.hotel === hotelId ? null : hotelId,
            hotelNights: 1
          }
        }
      };
    }

    case 'SET_HOTEL_NIGHTS': {
      const { dayNumber, nights } = action.payload;
      const daySelection = state.selections[dayNumber];
      return {
        ...state,
        selections: {
          ...state.selections,
          [dayNumber]: { ...daySelection, hotelNights: nights }
        }
      };
    }

    case 'TOGGLE_RESTAURANT': {
      const { dayNumber, restaurantId } = action.payload;
      const daySelection = state.selections[dayNumber];
      const restaurants = daySelection.restaurants.includes(restaurantId)
        ? daySelection.restaurants.filter(id => id !== restaurantId)
        : [...daySelection.restaurants, restaurantId];
      return {
        ...state,
        selections: {
          ...state.selections,
          [dayNumber]: { ...daySelection, restaurants }
        }
      };
    }

    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };

    case 'UPDATE_FIXED_COST': {
      const { key, value } = action.payload;
      return {
        ...state,
        fixedCosts: { ...state.fixedCosts, [key]: value }
      };
    }

    case 'TOGGLE_BUDGET_BREAKDOWN':
      return { ...state, showBudgetBreakdown: !state.showBudgetBreakdown };

    case 'SET_ACTIVE_DAY':
      return { ...state, activeDay: action.payload };

    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  const budget = useMemo(() => {
    let lodging = 0;
    let dining = 0;
    let activities = 0;

    Object.entries(state.selections).forEach(([dayNum, daySel]) => {
      const dayData = tripData.find(d => d.dayNumber === parseInt(dayNum));
      if (!dayData) return;

      if (daySel.hotel) {
        const hotel = dayData.hotels.find(h => h.id === daySel.hotel);
        if (hotel) lodging += (hotel.estimatedCostPerNight || 0) * (daySel.hotelNights || 1);
      }

      daySel.activities.forEach(actId => {
        const activity = dayData.activities.find(a => a.id === actId);
        if (activity) activities += (activity.estimatedCost || 0) * 2;
      });

      daySel.restaurants.forEach(restId => {
        const restaurant = dayData.restaurants?.find(r => r.id === restId);
        if (restaurant) dining += (restaurant.estimatedCostPerPerson || 0) * 2;
      });
    });

    const fixed = Object.values(state.fixedCosts).reduce((sum, v) => sum + (v || 0), 0);

    return { lodging, dining, activities, fixed, total: lodging + dining + activities + fixed };
  }, [state.selections, state.fixedCosts]);

  const selectedCount = useMemo(() => {
    let count = 0;
    Object.values(state.selections).forEach(daySel => {
      count += daySel.activities.length;
      if (daySel.hotel) count += 1;
      count += daySel.restaurants.length;
    });
    return count;
  }, [state.selections]);

  const value = useMemo(() => ({
    ...state,
    budget,
    selectedCount,
    dispatch
  }), [state, budget, selectedCount]);

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
