const express = require('express');
const PostController = require('./../app/Http/Controllers/PostController');
const Guard = require('./../app/Providers/GuardServiceProvider');

const router = express.Router();

router.route('/')
    .post(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        PostController.uploadMedia,
        PostController.setUpMedia,
        PostController.createPost
    )
    .get(
    Guard.authGuard,
    Guard.restrictToRoles(['agent', 'player', 'administrator']),
    PostController.getAppPosts
);
router.route('/users/user-posts')
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        PostController.getMyPosts
    );

router.route('/:id')
    .patch(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        PostController.uploadMedia,
        PostController.setUpMedia,
        PostController.updatePost
    )
    .get(
        Guard.authGuard,
        Guard.restrictToRoles(['agent', 'player', 'administrator']),
        PostController.getPost
    )
    .delete(
    Guard.authGuard,
    Guard.restrictToRoles(['agent', 'player', 'administrator']),
    PostController.deletePost
);

module.exports = router;
