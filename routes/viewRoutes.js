const express = require('express');
const viewsController = require('./../app/Http/Controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.homepage);


module.exports = router;
