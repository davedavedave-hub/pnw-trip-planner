export default async function handler(req, res) {
  const { hotel, checkin, checkout } = req.query;

  if (!hotel) {
    return res.status(400).json({ error: 'Hotel name is required' });
  }

  let nights = 1;
  if (checkin && checkout) {
    const start = new Date(checkin);
    const end = new Date(checkout);
    nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  }

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 800));

    const seed = hotel.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockPricePerNight = 120 + (seed % 350);

    return res.status(200).json({
      success: true,
      source: 'mock',
      priceParams: {
        basePricePerNight: mockPricePerNight,
        nights: nights,
        total: mockPricePerNight * nights,
        currency: 'USD'
      },
      message: 'Mock data used. Add SERPAPI_KEY to Vercel Environment Variables for live data.'
    });
  }

  try {
    const searchParams = new URLSearchParams({
      engine: 'google_hotels',
      q: hotel,
      api_key: apiKey
    });

    if (checkin) searchParams.append('check_in', checkin);
    if (checkout) searchParams.append('check_out', checkout);

    const response = await fetch(`https://serpapi.com/search.json?${searchParams.toString()}`);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || 'Failed to fetch from SerpApi');
    }

    let pricePerNight = null;
    let total = null;

    if (data.properties && data.properties.length > 0) {
      const topHotel = data.properties[0];

      if (topHotel.total_rate) {
        if (typeof topHotel.total_rate.extracted_lowest === 'number') {
          total = topHotel.total_rate.extracted_lowest;
        } else if (topHotel.total_rate.lowest) {
          total = parseFloat(topHotel.total_rate.lowest.replace(/[^0-9.-]+/g, ""));
        }
      }

      if (topHotel.rate_per_night) {
        if (typeof topHotel.rate_per_night.extracted_lowest === 'number') {
          pricePerNight = topHotel.rate_per_night.extracted_lowest;
        } else if (topHotel.rate_per_night.lowest) {
          pricePerNight = parseFloat(topHotel.rate_per_night.lowest.replace(/[^0-9.-]+/g, ""));
        }
      }

      if (!pricePerNight && total && nights) {
        pricePerNight = Math.round(total / nights);
      }
    }

    return res.status(200).json({
      success: true,
      source: 'live',
      priceParams: {
        basePricePerNight: pricePerNight || 'Unavailable',
        nights: nights,
        total: total || 'Unavailable',
        currency: 'USD'
      },
      externalLink: data.search_metadata?.google_hotels_url || ''
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch live pricing.', details: error.message });
  }
}
