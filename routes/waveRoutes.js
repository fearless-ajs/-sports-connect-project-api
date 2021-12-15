const express = require('express');
const WaveController = require('./../app/Http/Controllers/WaveController');
const Guard = require('./../app/Providers/GuardServiceProvider');

const router = express.Router();

router.route('/:receiverId')
    .post(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        WaveController.createWave
    )
    .get(
    Guard.authGuard,
    Guard.restrictToRoles(['agent', 'player', 'administrator']),
    WaveController.getMyWaves
);

router.route('/wave/:id')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        WaveController.getWave
    )
    .delete(
    Guard.authGuard,
    Guard.restrictToRoles(['agent', 'player', 'administrator']),
    WaveController.deleteWave
);

router.route('/received/all')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        WaveController.getReceivedWaves
    );
router.route('/received/unseen')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        WaveController.getUnseenReceivedWaves
    );
router.route('/received/seen')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        WaveController.getSeenReceivedWaves
    );

router.route('/sent/all')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        WaveController.getSentWaves
    );
router.route('/sent/unseen')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        WaveController.getUnseenSentWaves
    );
router.route('/sent/seen')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        WaveController.getSeenSentWaves
    );

module.exports = router;
