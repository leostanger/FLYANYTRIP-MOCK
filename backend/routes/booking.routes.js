const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// POST /api/booking/revalidate
router.post('/revalidate', bookingController.revalidateBooking);

// POST /api/booking/confirm
router.post('/confirm', bookingController.confirmBooking);

// GET /api/booking/details/:id
router.get('/details/:id', bookingController.getBookingDetails);

// GET /api/booking/invoice/:id/download
router.get('/invoice/:id/download', bookingController.downloadInvoice);

// POST /api/booking/cancel-charges
router.post('/cancel-charges', bookingController.getCancellationCharges);

// POST /api/booking/cancel-request
router.post('/cancel-request', bookingController.requestCancellation);

// POST /api/booking/cancel-status
router.post('/cancel-status', bookingController.getCancellationStatus);

// POST /api/booking/send-invoice-email  ← NEW
router.post('/send-invoice-email', bookingController.sendInvoiceEmail);

// GET /api/booking/balance
router.get('/balance', bookingController.getWalletBalance);

// POST /api/booking/release-hold
router.post('/release-hold', bookingController.releaseHoldBooking);

// GET /api/booking/token/refresh
router.get('/token/refresh', bookingController.createManualToken);

module.exports = router;

