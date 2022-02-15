const express = require('express');
const BookingController = require('./../app/Http/Controllers/BookingController');
const Guard = require('./../app/Providers/GuardServiceProvider');
const router = express.Router();

router.route('/')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        BookingController.getAllBookings
    )

router.route('/:receiverId')
    .post(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'administrator']),
        BookingController.createBooking
    )
    .get(
    Guard.authGuard,
    Guard.restrictToRoles(['agent', 'player', 'administrator']),
    BookingController.getMyBooking
);

router.route('/booking/:id')
    .delete(
    Guard.authGuard,
    Guard.restrictToRoles(['agent', 'player', 'administrator']),
    BookingController.deleteBooking
);


module.exports = router;
