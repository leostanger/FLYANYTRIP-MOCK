const NodeCache = require('node-cache');

// Standard cache for API responses (e.g., flight searches) to reduce load
// stdTTL: Default time-to-live is 5 minutes (300 seconds) since flight prices change often
// checkperiod: Delete expired keys every 60 seconds
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const generateCacheKey = (prefix, params) => {
  const sortObject = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortObject);
    return Object.keys(obj).sort().reduce((acc, key) => {
      acc[key] = sortObject(obj[key]);
      return acc;
    }, {});
  };
  const normalizedParams = sortObject(params);
  return `${prefix}_${Buffer.from(JSON.stringify(normalizedParams)).toString('base64')}`;
};

module.exports = {
  apiCache,
  generateCacheKey,
};
