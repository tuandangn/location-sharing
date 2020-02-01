const express = require('express');
const router = express.Router();
const controller = require('../controllers/regionController');

router.route('/regions')
    .get((req, res) => controller.getAll(req, res))
    .post((req, res) => controller.create(req, res));

router.route('/regions/:id')
    .get((req, res) => controller.getById(req, res))
    .delete((req, res) => controller.delete(req, res));

module.exports = router;