import { useState, useCallback, useRef } from 'react';

const cache = new Map();

export function useLivePrice() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState({});
  const abortRef = useRef({});

  const fetchPrice = useCallback(async (hotelName, searchQuery, checkin, checkout) => {
    const key = `${searchQuery || hotelName}-${checkin}-${checkout}`;

    if (cache.has(key)) {
      setPrices(prev => ({ ...prev, [key]: cache.get(key) }));
      return cache.get(key);
    }

    if (abortRef.current[key]) {
      abortRef.current[key].abort();
    }
    const controller = new AbortController();
    abortRef.current[key] = controller;

    setLoading(prev => ({ ...prev, [key]: true }));

    try {
      let apiUrl = `/api/hotels?hotel=${encodeURIComponent(searchQuery || hotelName)}`;
      if (checkin) apiUrl += `&checkin=${checkin}`;
      if (checkout) apiUrl += `&checkout=${checkout}`;

      const res = await fetch(apiUrl, { signal: controller.signal });
      const data = await res.json();

      if (data.success) {
        cache.set(key, data.priceParams);
        setPrices(prev => ({ ...prev, [key]: data.priceParams }));
        return data.priceParams;
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Live price fetch error:', err);
      }
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
      delete abortRef.current[key];
    }
    return null;
  }, []);

  const getPrice = useCallback((searchQuery, checkin, checkout) => {
    const key = `${searchQuery}-${checkin}-${checkout}`;
    return prices[key] || null;
  }, [prices]);

  const isLoading = useCallback((searchQuery, checkin, checkout) => {
    const key = `${searchQuery}-${checkin}-${checkout}`;
    return loading[key] || false;
  }, [loading]);

  return { fetchPrice, getPrice, isLoading };
}
