// Simple in-memory cache to prevent exhausting Google API limits
let cachedReviews = null;
let cachedStats = null;
let lastFetchTime = 0;
// Cache duration: 24 hours (in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const getGoogleReviews = async (req, res, next) => {
  try {
    const now = Date.now();
    
    // Serve from cache if valid
    if (cachedReviews && (now - lastFetchTime < CACHE_DURATION)) {
      return res.json({ success: true, source: 'cache', data: cachedReviews, stats: cachedStats });
    }

    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
      return res.status(500).json({ success: false, message: 'Google API credentials not configured.' });
    }

    // Include rating + user_ratings_total to power the trust badge
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return res.status(500).json({ success: false, message: `Google API Error: ${data.status}` });
    }

    const rawReviews = data.result.reviews || [];

    // Map and filter reviews (only 4 and 5 stars)
    const formattedReviews = rawReviews
      .filter(review => review.rating >= 4)
      .map(review => ({
        id: review.author_url || review.time,
        name: review.author_name,
        profession: 'Google Reviewer', // Fallback title
        rating: review.rating,
        comment: review.text,
        imageUrl: review.profile_photo_url,
        time: review.time,
        isGoogle: true
      }));

    // Aggregate stats from Google Places
    const stats = {
      averageRating: data.result.rating || null,
      totalRatings: data.result.user_ratings_total || null,
    };

    // Update cache
    cachedReviews = formattedReviews;
    cachedStats = stats;
    lastFetchTime = now;

    res.json({ success: true, source: 'api', data: formattedReviews, stats });
  } catch (error) {
    console.error('Error fetching Google Reviews:', error.message);
    // If API fails, try to return stale cache if available, otherwise return error
    if (cachedReviews) {
      return res.json({ success: true, source: 'stale_cache', data: cachedReviews, stats: cachedStats });
    }
    next(error);
  }
};

module.exports = {
  getGoogleReviews
};

