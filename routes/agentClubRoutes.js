const express = require('express');
const AgentClubController = require('./../app/Http/Controllers/AgentClubController');
const Guard = require('./../app/Providers/GuardServiceProvider');

const router = express.Router();

router.route('/')
    .post(
        Guard.authGuard,
        Guard.restrictToRoles(['agent']),
        AgentClubController.addClub
    )
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent']),
        AgentClubController.getAllMyClubs
    );

router.route('/:clubId')
    .patch(
        Guard.authGuard,
        Guard.restrictToRoles(['agent']),
        AgentClubController.updateMyAgentClub
    )
    .delete(
        Guard.authGuard,
        Guard.restrictToRoles(['agent']),
        AgentClubController.deleteMyAgentClub
    );

module.exports = router;
