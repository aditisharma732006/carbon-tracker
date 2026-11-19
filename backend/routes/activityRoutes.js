const express = require('express');
const router = express.Router();
const {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  getResultAndTips,
  deleteActivity,
  getAnalytics,
  getPersonalizedRecommendations
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

// All activity endpoints are private and user-scoped
router.use(protect);

router.post('/', createActivity);
router.get('/', getActivities);
router.get('/analytics', getAnalytics);
router.get('/recommendations', getPersonalizedRecommendations);
router.get('/result', getResultAndTips);
router.get('/:id', getActivityById);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
