const express = require('express');
const router = express.Router();
const {
  getCurrentGoal,
  getGoals,
  setGoal,
  deleteGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getGoals);
router.get('/current', getCurrentGoal);
router.post('/', setGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
