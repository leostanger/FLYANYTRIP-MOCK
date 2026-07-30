const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');
const { flightSearchLimiter } = require('../middlewares/rateLimiter');

// GET and POST /api/flights/search
router.route('/search')
  .get(flightSearchLimiter, flightController.searchFlights)
  .post(flightSearchLimiter, flightController.searchFlights);
router.post('/search/multicity', flightSearchLimiter, flightController.searchMultiCityFlights);
router.get('/locations', flightController.searchLocations);
router.get('/calendar-fare', flightController.getCalendarFare);
router.get('/calendar-fare-day', flightController.updateCalendarFareOfDay);
router.post('/fare-rule', flightController.getFareRule);
router.post('/fare-quote', flightController.getFareQuote);
router.post('/ssr', flightController.getFlightSSR);

module.exports = router;
