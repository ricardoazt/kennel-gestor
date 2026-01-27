const express = require('express');
const router = express.Router();
const BreedController = require('../controllers/BreedController');

// Get all breeds (with optional ?active=true filter)
router.get('/', BreedController.findAll);

// Get single breed
router.get('/:id', BreedController.findOne);

// Create new breed
router.post('/', BreedController.create);

// Update breed
router.put('/:id', BreedController.update);

// Toggle active status
router.patch('/:id/toggle', BreedController.toggleActive);

// Delete breed
router.delete('/:id', BreedController.delete);

module.exports = router;
