const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Activity = require('../models/activity');
const Goal = require('../models/goal');

// Helper to sign JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_carbon_tracker_2026_secure',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: emailNormalized,
      password: hashedPassword,
      location: location ? location.trim() : '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailNormalized });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get user profile with personal statistics
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate user-specific lifetime statistics
    const activities = await Activity.find({ userId: req.user._id });
    const totalActivities = activities.length;
    const totalEmissions = activities.reduce((sum, act) => sum + (act.carbonFootprint || 0), 0);
    const roundedTotal = Math.round(totalEmissions * 100) / 100;

    // Average daily emissions (based on unique active days or total / count)
    const averagePerActivity = totalActivities > 0 ? Math.round((roundedTotal / totalActivities) * 100) / 100 : 0;

    // Current month goal
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-11"
    const currentGoal = await Goal.findOne({ userId: req.user._id, monthYear: currentMonth });

    // Calculate emissions for current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
    
    const monthlyActivities = await Activity.find({
      userId: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const currentMonthEmissions = Math.round(
      monthlyActivities.reduce((sum, act) => sum + (act.carbonFootprint || 0), 0) * 100
    ) / 100;

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      stats: {
        totalActivities,
        totalEmissions: roundedTotal,
        averagePerActivity,
        currentMonthEmissions,
        currentGoal: currentGoal ? {
          targetEmissions: currentGoal.targetEmissions,
          monthYear: currentGoal.monthYear,
          remaining: Math.max(0, Math.round((currentGoal.targetEmissions - currentMonthEmissions) * 100) / 100),
          percentAchieved: currentGoal.targetEmissions > 0 
            ? Math.min(100, Math.round((currentMonthEmissions / currentGoal.targetEmissions) * 100))
            : 0,
        } : null,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.location !== undefined) user.location = req.body.location.trim();
    if (req.body.profileImage !== undefined) user.profileImage = req.body.profileImage;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        location: updatedUser.location,
        profileImage: updatedUser.profileImage,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating profile',
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while changing password',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
};
