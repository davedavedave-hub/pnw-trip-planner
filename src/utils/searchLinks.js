export function buildGoogleHotelsUrl(query, checkin, checkout) {
  const params = new URLSearchParams({ q: query });
  if (checkin) params.set('checkin', checkin);
  if (checkout) params.set('checkout', checkout);
  return `https://www.google.com/travel/hotels?${params}`;
}

export function buildYelpUrl(query, location) {
  return `https://www.yelp.com/search?find_desc=${encodeURIComponent(query)}&find_loc=${encodeURIComponent(location || '')}`;
}

export function buildTripAdvisorUrl(query) {
  return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(query)}`;
}

export function buildGoogleFlightsUrl(from, to, date) {
  return `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(from)}+to+${encodeURIComponent(to)}${date ? '+' + date : ''}`;
}

export function buildGoogleMapsUrl(query) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}
