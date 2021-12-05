const express = require('express');
const AgentController = require('./../app/Http/Controllers/AgentController');
const Guard = require('./../app/Providers/GuardServiceProvider');

const router = express.Router();

router.route('/')
    .post(
        Guard.authGuard,
        Guard.restrictToRoles(['new-user']),
        AgentController.signUp
    )

module.exports = router;
