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
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['player']),
        PlayerController.getMyPlayerProfile
    )
    .patch(
        Guard.authGuard,
        Guard.restrictToRoles(['player']),
        PlayerController.updateMyPlayerProfile
    )
    .delete(
        Guard.authGuard,
        Guard.restrictToRoles(['player']),
        PlayerController.deleteMyPlayerProfile
    );

router.route('/:userId')
    .patch(
        Guard.authGuard,
        Guard.restrictToRoles(['player']),
        PlayerController.updatePlayerProfile
    )
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['player']),
        PlayerController.getPlayerProfile
    )
    .delete(
        Guard.authGuard,
        Guard.restrictToRoles(['player']),
        PlayerController.deletePlayerProfile
    )


// Other Player operations
router.route('/active/all')
    .get(
        Guard.authGuard,
        PlayerController.getAllPlayers
    )

router.route('/active/view/:id')
    .get(
        Guard.authGuard,
        PlayerController.getPlayerProfile
    )


module.exports = router;
