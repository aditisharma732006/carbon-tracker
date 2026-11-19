const Goal = require('../models/goal');
const Activity = require('../models/activity');

// Helper to compute progress for a goal
const calculateGoalProgress = async (userId, goal) => {
  const [yearStr, monthStr] = goal.monthYear.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const activities = await Activity.find({
    userId,
    date: { $gte: startOfMonth, $lte: endOfMonth }
  });

  const actualEmissions = activities.reduce((sum, a) => sum + (a.carbonFootprint || 0), 0);
  const roundedActual = Math.round(actualEmissions * 100) / 100;
  const target = goal.targetEmissions;

  const percentUsed = target > 0 ? Math.round((roundedActual / target) * 100) : 0;
  const remainingAllowance = Math.round((target - roundedActual) * 100) / 100;

  let status = 'On Track';
  if (roundedActual > target) {
    status = 'Exceeded';
  } else if (percentUsed >= 85) {
    status = 'Near Limit';
  } else {
    status = 'Within Budget';
  }

  return {
    ...goal.toObject(),
    actualEmissions: roundedActual,
    remainingAllowance: Math.max(0, remainingAllowance),
    overage: remainingAllowance < 0 ? Math.abs(remainingAllowance) : 0,
    percentUsed,
    status,
    activitiesCount: activities.length
  };
};

// @desc   Get current month's active goal and its progress
// @route  GET /api/goals/current
// @access Private
const getCurrentGoal = async (req, res) => {
  try {
    const currentMonthYear = new Date().toISOString().slice(0, 7); // e.g. "2026-11"
    const goal = await Goal.findOne({
      userId: req.user._id,
      monthYear: currentMonthYear
    });

    if (!goal) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No goal set for the current month'
      });
    }

    const progressData = await calculateGoalProgress(req.user._id, goal);

    res.status(200).json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Error fetching current goal:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching current goal'
    });
  }
};

// @desc   Get all goals history for user
// @route  GET /api/goals
// @access Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ monthYear: -1 });

    const goalsWithProgress = await Promise.all(
      goals.map(g => calculateGoalProgress(req.user._id, g))
    );

    res.status(200).json({
      success: true,
      data: goalsWithProgress
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching goals'
    });
  }
};

// @desc   Create or update monthly goal
// @route  POST /api/goals
// @access Private
const setGoal = async (req, res) => {
  try {
    const { targetEmissions, monthYear, note } = req.body;

    if (!targetEmissions || isNaN(targetEmissions) || targetEmissions <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid target emissions greater than 0'
      });
    }

    const targetMonth = monthYear || new Date().toISOString().slice(0, 7);

    // Upsert goal for this month
    let goal = await Goal.findOne({
      userId: req.user._id,
      monthYear: targetMonth
    });

    if (goal) {
      goal.targetEmissions = parseFloat(targetEmissions);
      if (note !== undefined) goal.note = note;
      await goal.save();
    } else {
      const [yearStr, monthStr] = targetMonth.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;

      goal = await Goal.create({
        userId: req.user._id,
        targetEmissions: parseFloat(targetEmissions),
        monthYear: targetMonth,
        startDate: new Date(year, month, 1),
        endDate: new Date(year, month + 1, 0, 23, 59, 59, 999),
        note: note || ''
      });
    }

    const progressData = await calculateGoalProgress(req.user._id, goal);

    res.status(200).json({
      success: true,
      message: 'Monthly goal saved successfully',
      data: progressData
    });
  } catch (error) {
    console.error('Error setting goal:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while saving goal'
    });
  }
};

// @desc   Delete a goal
// @route  DELETE /api/goals/:id
// @access Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal removed successfully'
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting goal'
    });
  }
};

module.exports = {
  getCurrentGoal,
  getGoals,
  setGoal,
  deleteGoal
};
