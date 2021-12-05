const express = require('express');
const PlayerController = require('./../app/Http/Controllers/PlayerController');
const Guard = require('./../app/Providers/GuardServiceProvider');

const router = express.Router();

router.route('/')
    .post(
        Guard.authGuard,
        Guard.restrictToRoles(['new-user']),
        PlayerController.signUp
    )

module.exports = router;
