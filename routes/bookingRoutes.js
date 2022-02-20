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


router.route('/is-player-booked/:talentId')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        BookingController.isPlayerBooked
    );


router.route('/booking/:id')
    .delete(
    Guard.authGuard,
    Guard.restrictToRoles(['agent', 'player', 'administrator']),
    BookingController.deleteBooking
);

router.route('/booking/update-status/:agentId')
    .patch(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        BookingController.attendToBooking
    );



module.exports = router;
