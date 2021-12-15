const express = require('express');
const ContactController = require('./../app/Http/Controllers/ContactController');
const Guard = require('./../app/Providers/GuardServiceProvider');

const router = express.Router();

router.route('/')
    .post(
        ContactController.createContact
    )
    .get(
    Guard.authGuard,
    Guard.restrictToRoles(['administrator']),
    ContactController.getAllContacts
);

router.route('/:id')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['administrator']),
        ContactController.getContact
    )
    .delete(
        Guard.authGuard,
        Guard.restrictToRoles(['administrator']),
        ContactController.deleteContact
);

module.exports = router;
