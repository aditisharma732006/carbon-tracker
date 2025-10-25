const express = require('express');
const router = express.Router();
const {
 createActivity,
 getActivities,
 getResultAndTips,
 deleteActivity
} = require('../controllers/activityController');

// --- Standard RESTful API routes for the 'activities' collection ---
// The full path will be: /api/activities

// @route   POST /api/activities
// @desc    Create a new activity and get result with tips
router.post('/', createActivity); 

// @route   GET /api/activities
// @desc    Get all activities history and statistics
router.get('/', getActivities);

// @route   GET /api/activities/result
// @desc    Get latest result and eco tips
router.get('/result', getResultAndTips);

router.delete('/:id', deleteActivity);

module.exports = router;
