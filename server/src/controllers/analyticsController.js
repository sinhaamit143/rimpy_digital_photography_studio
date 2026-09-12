const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const propertyId = process.env.GA_PROPERTY_ID;

// Parse the private key from .env (handle potential string escaping)
let privateKey = process.env.GA_PRIVATE_KEY;
if (privateKey && privateKey.startsWith('"') && privateKey.endsWith('"')) {
  privateKey = privateKey.slice(1, -1).replace(/\\n/g, '\n');
}

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: privateKey,
  },
  fallback: true,
});

exports.getAnalytics = async (req, res) => {
  try {
    if (!propertyId || !privateKey || !process.env.GA_CLIENT_EMAIL) {
      return res.status(500).json({ error: 'Google Analytics credentials missing' });
    }

    // 1. Fetch overall stats for the last 30 days
    const [responseStats] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
      ],
    });

    // 2. Fetch daily views for chart (last 30 days)
    const [responseChart] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'date' }
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
      orderBys: [
        {
          dimension: { dimensionName: 'date' },
          desc: false
        }
      ]
    });

    let totalUsers = 0;
    let totalViews = 0;
    if (responseStats.rows && responseStats.rows.length > 0) {
      totalUsers = parseInt(responseStats.rows[0].metricValues[0].value, 10);
      totalViews = parseInt(responseStats.rows[0].metricValues[1].value, 10);
    }

    const chartData = (responseChart.rows || []).map(row => {
      // date comes as YYYYMMDD
      const dateStr = row.dimensionValues[0].value;
      const formattedDate = `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
      return {
        date: formattedDate,
        views: parseInt(row.metricValues[0].value, 10)
      };
    });

    // Return additional metrics if requested via query params
    const response = {
      totalUsers,
      totalViews,
      chartData,
      // placeholders – will be populated by specific endpoints
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data', details: error.message });
  }
};

// New endpoint: Device breakdown (mobile/desktop/tablet)
exports.getDeviceBreakdown = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'screenPageViews' }],
    });
    const data = (response.rows || []).map(row => ({
      device: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value, 10)
    }));
    res.json(data);
  } catch (e) {
    console.error('Device breakdown error:', e);
    res.status(500).json({ error: e.message });
  }
};

// New endpoint: Top performing pages
exports.getTopPages = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 20, // Fetch more so we can filter client side
    });
    
    const data = (response.rows || [])
      .map(row => ({
        page: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value, 10)
      }))
      .filter(item => !item.page.startsWith('/admin')) // Filter out admin pages
      .slice(0, 5); // Take top 5
      
    res.json(data);
  } catch (e) {
    console.error('Top pages error:', e);
    res.status(500).json({ error: e.message });
  }
};

// New endpoint: Traffic sources
exports.getTrafficSources = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
    });
    const data = (response.rows || []).map(row => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value, 10)
    }));
    res.json(data);
  } catch (e) {
    console.error('Traffic sources error:', e);
    res.status(500).json({ error: e.message });
  }
};

// Optional: Age group distribution
exports.getAgeDistribution = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'userAgeBracket' }],
      metrics: [{ name: 'sessions' }],
    });
    const data = (response.rows || []).map(row => ({
      ageBracket: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value, 10)
    }));
    res.json(data);
  } catch (e) {
    console.error('Age distribution error:', e);
    res.status(500).json({ error: e.message });
  }
};

// Optional: Country distribution
exports.getCountryDistribution = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'sessions' }],
    });
    const data = (response.rows || []).map(row => ({
      country: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value, 10)
    }));
    res.json(data);
  } catch (e) {
    console.error('Country distribution error:', e);
    res.status(500).json({ error: e.message });
  }
};

// Optional: State / province distribution
exports.getStateDistribution = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'region' }],
      metrics: [{ name: 'sessions' }],
    });
    const data = (response.rows || []).map(row => ({
      region: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value, 10)
    }));
    res.json(data);
  } catch (e) {
    console.error('State distribution error:', e);
    res.status(500).json({ error: e.message });
  }
};

