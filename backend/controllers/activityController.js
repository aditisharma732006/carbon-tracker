const Activity = require('../models/activity');
const mongoose = require('mongoose');

// Emission factors (kg CO2 per unit) - PRESERVED EXACTLY AS ORIGINAL
const emissionFactors = {
  // Transport (kg CO2 per km)
  transport: {
    'None': 0,
    'Car': 0.21,
    'Bus': 0.09,
    'Train': 0.04,
    'Bike': 0,
    'Motorcycle': 0.11,
    'Electric Car': 0.05
  },
  
  // Electricity (kg CO2 per kWh)
  electricity: 0.5,
  
  // Cooking (kg CO2 per day - estimated daily usage)
  cooking: {
    'None': 0,
    'Gas': 2.0,
    'Electric': 1.2,
    'Induction': 0.4
  },
  
  // Food (kg CO2 per day - estimated daily consumption)
  food: {
    'None': 0,
    'Beef': 3.3, // Added Beef support if chosen, safe fallback
    'Chicken': 1.4,
    'Vegetarian': 0.8,
    'Vegan': 0.5,
    'Fish': 1.8,
    'Pork': 2.0
  },
  
  // Shopping (kg CO2 per item - weekly average)
  shopping: {
    'None': 0,
    'Clothes': 15.0,
    'Electronics': 50.0,
    'Furniture': 80.0,
    'Plastic': 2.0,
    'Groceries': 5.0
  }
};

/**
 * Generates 3 eco tips based on the calculated carbon footprint level.
 */
const getEcoTips = (carbonFootprint) => {
  let tips = [];
  
  if (carbonFootprint < 10) {
    tips = [
      "🌱 Excellent! Your carbon footprint is low. Keep up the sustainable habits!",
      "💚 Consider sharing your eco-friendly practices with friends and family",
      "🚶 Continue walking and cycling for short distances",
      "♻️ You're doing great! Maybe try composting food waste next",
      "🌞 Share your sustainable lifestyle tips on social media to inspire others",
      "💧 You're conserving well! Consider installing water-saving devices",
      "🚲 Maintain your bike-friendly lifestyle and encourage others",
      "🌳 Think about joining local environmental conservation groups"
    ];
  } else if (carbonFootprint >= 10 && carbonFootprint < 20) {
    tips = [
      "🚗 Try carpooling or using public transport 2-3 times per week",
      "💡 Switch to LED bulbs and unplug electronics when not in use",
      "🍽️ Reduce meat consumption by having 1-2 vegetarian days per week",
      "🚰 Fix any leaking taps and take shorter showers",
      "🛒 Buy local produce to reduce transportation emissions",
      "🌡️ Set your thermostat 1-2 degrees lower in winter and higher in summer",
      "♻️ Start recycling paper, plastic, and glass consistently",
      "☀️ Use natural light during daytime instead of artificial lighting"
    ];
  } else {
    tips = [
      "🚗 URGENT: Consider switching to public transport or electric vehicle",
      "💡 CRITICAL: Audit your home energy usage and reduce unnecessary consumption",
      "🍖 IMPORTANT: Shift to plant-based meals at least 3-4 days per week",
      "✈️ AVOID: Limit air travel and choose video conferences when possible",
      "🏠 ACTION: Improve home insulation and use smart thermostats",
      "🛒 PRIORITY: Reduce shopping for non-essential items significantly",
      "⚡ IMMEDIATE: Switch to renewable energy providers if available",
      "🚿 ESSENTIAL: Limit shower time to 5 minutes and use low-flow showerheads"
    ];
  }

  return tips.sort(() => 0.5 - Math.random()).slice(0, 3);
};

/**
 * Calculates the total carbon footprint based on activity data.
 */
const calculateCarbonFootprint = (activityData) => {
  let total = 0;

  // Transport calculation: Km * Factor
  const transportFactor = emissionFactors.transport[activityData.transportType] || 0;
  total += (activityData.transportUnitKm || 0) * transportFactor;
  
  // Electricity calculation: Kwh * Factor
  total += (activityData.electricityUnitKwh || 0) * emissionFactors.electricity;
  
  // Cooking calculation: Daily Factor
  total += emissionFactors.cooking[activityData.cookingType] || 0;
  
  // Food calculation: Daily Factor
  total += emissionFactors.food[activityData.foodType] || 0;
  
  // Shopping calculation: Factor
  total += emissionFactors.shopping[activityData.shopping] || 0;

  return Math.round(total * 100) / 100;
};

/**
 * Helper to compute category breakdown for a single activity
 */
const getCategoryBreakdown = (activity) => {
  const transport = (activity.transportUnitKm || 0) * (emissionFactors.transport[activity.transportType] || 0);
  const electricity = (activity.electricityUnitKwh || 0) * emissionFactors.electricity;
  const cooking = emissionFactors.cooking[activity.cookingType] || 0;
  const food = emissionFactors.food[activity.foodType] || 0;
  const shopping = emissionFactors.shopping[activity.shopping] || 0;

  return {
    transport: Math.round(transport * 100) / 100,
    electricity: Math.round(electricity * 100) / 100,
    cooking: Math.round(cooking * 100) / 100,
    food: Math.round(food * 100) / 100,
    shopping: Math.round(shopping * 100) / 100
  };
};

// @desc   Create a new activity for authenticated user
// @route  POST /api/activities
// @access Private
const createActivity = async (req, res) => {
  try {
    const {
      transportType,
      transportUnitKm,
      electricityUnitKwh,
      cookingType,
      foodType,
      shopping,
      date
    } = req.body;

    if (!transportType || !cookingType || !foodType || !shopping) {
      return res.status(400).json({
        success: false,
        message: 'All categorical fields are required: transportType, cookingType, foodType, shopping'
      });
    }

    if (transportUnitKm === undefined || electricityUnitKwh === undefined) {
      return res.status(400).json({
        success: false,
        message: 'transportUnitKm and electricityUnitKwh are required'
      });
    }

    const activityData = {
      transportType,
      transportUnitKm: parseFloat(transportUnitKm) || 0,
      electricityUnitKwh: parseFloat(electricityUnitKwh) || 0,
      cookingType,
      foodType,
      shopping,
      date: date ? new Date(date) : new Date(),
      userId: req.user._id
    };

    const carbonFootprint = calculateCarbonFootprint(activityData);

    const activity = await Activity.create({
      ...activityData,
      carbonFootprint
    });

    const tips = getEcoTips(carbonFootprint);

    let level, levelColor;
    if (carbonFootprint < 10) {
      level = "Low";
      levelColor = "green";
    } else if (carbonFootprint >= 10 && carbonFootprint < 20) {
      level = "Moderate";
      levelColor = "orange";
    } else {
      level = "High";
      levelColor = "red";
    }

    res.status(201).json({
      success: true,
      data: {
        activity,
        result: {
          carbonFootprint,
          message: `Your carbon footprint is ${carbonFootprint} kg CO₂`,
          level,
          levelColor,
          tips
        }
      },
      message: 'Activity recorded successfully!'
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating activity'
    });
  }
};

// @desc   Get activities history with search, filter, sort, and pagination
// @route  GET /api/activities
// @access Private
const getActivities = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = 'All',
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const query = { userId: req.user._id };

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Category filter
    if (category && category !== 'All') {
      if (category === 'Transport') query.transportType = { $ne: 'None' };
      else if (category === 'Electricity') query.electricityUnitKwh = { $gt: 0 };
      else if (category === 'Cooking') query.cookingType = { $ne: 'None' };
      else if (category === 'Food') query.foodType = { $ne: 'None' };
      else if (category === 'Shopping') query.shopping = { $ne: 'None' };
    }

    // Search query on type names
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { transportType: regex },
        { cookingType: regex },
        { foodType: regex },
        { shopping: regex }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [activities, totalCount] = await Promise.all([
      Activity.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Activity.countDocuments(query)
    ]);

    // Calculate total emissions for all activities matching the filter (or all user's)
    const allFiltered = await Activity.find(query);
    const totalFootprint = allFiltered.reduce((sum, act) => sum + (act.carbonFootprint || 0), 0);
    const averageFootprint = allFiltered.length > 0 ? totalFootprint / allFiltered.length : 0;

    res.status(200).json({
      success: true,
      count: activities.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      statistics: {
        totalFootprint: Math.round(totalFootprint * 100) / 100,
        averageFootprint: Math.round(averageFootprint * 100) / 100
      },
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activities'
    });
  }
};

// @desc   Get single activity by ID
// @route  GET /api/activities/:id
// @access Private
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    const breakdown = getCategoryBreakdown(activity);

    res.status(200).json({
      success: true,
      data: {
        ...activity.toObject(),
        breakdown
      }
    });
  } catch (error) {
    console.error('Error getting activity by id:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc   Update an existing activity
// @route  PUT /api/activities/:id
// @access Private
const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found or unauthorized'
      });
    }

    const {
      transportType,
      transportUnitKm,
      electricityUnitKwh,
      cookingType,
      foodType,
      shopping,
      date
    } = req.body;

    if (transportType !== undefined) activity.transportType = transportType;
    if (transportUnitKm !== undefined) activity.transportUnitKm = parseFloat(transportUnitKm) || 0;
    if (electricityUnitKwh !== undefined) activity.electricityUnitKwh = parseFloat(electricityUnitKwh) || 0;
    if (cookingType !== undefined) activity.cookingType = cookingType;
    if (foodType !== undefined) activity.foodType = foodType;
    if (shopping !== undefined) activity.shopping = shopping;
    if (date !== undefined) activity.date = new Date(date);

    // Recalculate carbon footprint
    activity.carbonFootprint = calculateCarbonFootprint(activity);

    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating activity'
    });
  }
};

// @desc   Get result and tips for latest entry of user
// @route  GET /api/activities/result
// @access Private
const getResultAndTips = async (req, res) => {
  try {
    const latestActivity = await Activity.findOne({ userId: req.user._id }).sort({ date: -1 });
    
    if (!latestActivity) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No activities found. Please add your first activity.'
      });
    }

    const carbonFootprint = latestActivity.carbonFootprint;
    const tips = getEcoTips(carbonFootprint);

    let level, levelColor;
    if (carbonFootprint < 10) {
      level = "Low";
      levelColor = "green";
    } else if (carbonFootprint >= 10 && carbonFootprint < 20) {
      level = "Moderate";
      levelColor = "orange";
    } else {
      level = "High";
      levelColor = "red";
    }

    res.status(200).json({
      success: true,
      data: {
        carbonFootprint,
        message: `Your carbon footprint is ${carbonFootprint} kg CO₂`,
        level,
        levelColor,
        tips,
        lastUpdated: latestActivity.date,
        latestActivity
      }
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching result'
    });
  }
};

// @desc   Delete an activity
// @route  DELETE /api/activities/:id
// @access Private
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        msg: 'Activity not found or unauthorized'
      });
    }

    await activity.deleteOne();

    res.status(200).json({ 
      success: true, 
      msg: 'Activity removed successfully', 
      id: req.params.id 
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, msg: 'Activity not found' });
    }
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc   Get comprehensive analytics and metrics for dashboard
// @route  GET /api/activities/analytics
// @access Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // 1. Time boundary definitions
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Fetch user activities
    const allActivities = await Activity.find({ userId }).sort({ date: 1 });

    // Lifetime metrics
    const totalEmissions = allActivities.reduce((sum, a) => sum + (a.carbonFootprint || 0), 0);
    const totalCount = allActivities.length;

    // Today emissions
    const todayActivities = allActivities.filter(a => a.date >= startOfToday && a.date <= endOfToday);
    const todayEmissions = todayActivities.reduce((sum, a) => sum + (a.carbonFootprint || 0), 0);

    // Past 7 days emissions
    const weekActivities = allActivities.filter(a => a.date >= sevenDaysAgo && a.date <= endOfToday);
    const weeklyEmissions = weekActivities.reduce((sum, a) => sum + (a.carbonFootprint || 0), 0);

    // Current month emissions
    const currentMonthActivities = allActivities.filter(a => a.date >= startOfCurrentMonth);
    const currentMonthEmissions = currentMonthActivities.reduce((sum, a) => sum + (a.carbonFootprint || 0), 0);

    // Previous month emissions
    const prevMonthActivities = allActivities.filter(a => a.date >= startOfPrevMonth && a.date <= endOfPrevMonth);
    const prevMonthEmissions = prevMonthActivities.reduce((sum, a) => sum + (a.carbonFootprint || 0), 0);

    // Monthly comparison delta percentage
    let monthlyComparisonPercent = 0;
    if (prevMonthEmissions > 0) {
      monthlyComparisonPercent = Math.round(((currentMonthEmissions - prevMonthEmissions) / prevMonthEmissions) * 100);
    }

    // Average daily emissions (over active days or last 30 days)
    const uniqueDays = new Set(allActivities.map(a => new Date(a.date).toISOString().slice(0, 10)));
    const activeDaysCount = Math.max(1, uniqueDays.size);
    const averageDailyEmissions = Math.round((totalEmissions / activeDaysCount) * 100) / 100;

    // Category breakdown
    const categoryTotals = {
      Transportation: 0,
      Electricity: 0,
      Cooking: 0,
      Food: 0,
      Shopping: 0
    };

    allActivities.forEach(act => {
      const b = getCategoryBreakdown(act);
      categoryTotals.Transportation += b.transport;
      categoryTotals.Electricity += b.electricity;
      categoryTotals.Cooking += b.cooking;
      categoryTotals.Food += b.food;
      categoryTotals.Shopping += b.shopping;
    });

    Object.keys(categoryTotals).forEach(key => {
      categoryTotals[key] = Math.round(categoryTotals[key] * 100) / 100;
    });

    // Highest emission category
    let highestCategory = 'None';
    let highestValue = -1;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > highestValue && val > 0) {
        highestValue = val;
        highestCategory = cat;
      }
    });

    // Daily Trend over last 14 days (or all activities grouped by date)
    const dailyMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = {
        date: key,
        formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        emissions: 0,
        transport: 0,
        electricity: 0,
        cooking: 0,
        food: 0,
        shopping: 0
      };
    }

    allActivities.forEach(act => {
      const key = new Date(act.date).toISOString().slice(0, 10);
      if (dailyMap[key]) {
        const b = getCategoryBreakdown(act);
        dailyMap[key].emissions += act.carbonFootprint || 0;
        dailyMap[key].transport += b.transport;
        dailyMap[key].electricity += b.electricity;
        dailyMap[key].cooking += b.cooking;
        dailyMap[key].food += b.food;
        dailyMap[key].shopping += b.shopping;
      }
    });

    const dailyTrend = Object.values(dailyMap).map(item => ({
      ...item,
      emissions: Math.round(item.emissions * 100) / 100,
      transport: Math.round(item.transport * 100) / 100,
      electricity: Math.round(item.electricity * 100) / 100,
      cooking: Math.round(item.cooking * 100) / 100,
      food: Math.round(item.food * 100) / 100,
      shopping: Math.round(item.shopping * 100) / 100
    }));

    // Monthly aggregation for Bar Chart (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyDataMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyDataMap[key] = {
        monthKey: key,
        monthName: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`,
        emissions: 0,
        activitiesCount: 0
      };
    }

    allActivities.forEach(act => {
      const d = new Date(act.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyDataMap[key]) {
        monthlyDataMap[key].emissions += act.carbonFootprint || 0;
        monthlyDataMap[key].activitiesCount += 1;
      }
    });

    const monthlyComparison = Object.values(monthlyDataMap).map(m => ({
      ...m,
      emissions: Math.round(m.emissions * 100) / 100
    }));

    // Doughnut chart array format
    const categoryChartData = [
      { name: 'Transportation', value: categoryTotals.Transportation, color: '#10B981' },
      { name: 'Electricity', value: categoryTotals.Electricity, color: '#F59E0B' },
      { name: 'Cooking', value: categoryTotals.Cooking, color: '#EF4444' },
      { name: 'Food', value: categoryTotals.Food, color: '#3B82F6' },
      { name: 'Shopping', value: categoryTotals.Shopping, color: '#8B5CF6' }
    ].filter(item => item.value > 0);

    res.status(200).json({
      success: true,
      summary: {
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        totalActivities: totalCount,
        todayEmissions: Math.round(todayEmissions * 100) / 100,
        weeklyEmissions: Math.round(weeklyEmissions * 100) / 100,
        monthlyEmissions: Math.round(currentMonthEmissions * 100) / 100,
        prevMonthEmissions: Math.round(prevMonthEmissions * 100) / 100,
        monthlyComparisonPercent,
        averageDailyEmissions,
        highestCategory
      },
      categoryTotals,
      categoryChartData,
      dailyTrend,
      monthlyComparison
    });
  } catch (error) {
    console.error('Error calculating analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while calculating analytics'
    });
  }
};

// @desc   Get rule-based personalized eco recommendations based on user's highest emissions
// @route  GET /api/activities/recommendations
// @access Private
const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const activities = await Activity.find({ userId });

    if (activities.length === 0) {
      return res.status(200).json({
        success: true,
        hasData: false,
        message: 'Log your daily activities to unlock personalized eco recommendations!',
        recommendations: [
          {
            category: 'Getting Started',
            priority: 'Medium',
            title: 'Track Daily Commute & Utilities',
            description: 'Begin logging your travel distance, electricity usage, and dietary habits to identify your top emission sources.',
            impact: 'Est. 10-25% reduction with awareness'
          }
        ]
      });
    }

    // Tally up category totals
    let totals = {
      Transportation: 0,
      Electricity: 0,
      Food: 0,
      Shopping: 0,
      Cooking: 0
    };

    activities.forEach(act => {
      const b = getCategoryBreakdown(act);
      totals.Transportation += b.transport;
      totals.Electricity += b.electricity;
      totals.Cooking += b.cooking;
      totals.Food += b.food;
      totals.Shopping += b.shopping;
    });

    const totalEmissions = Object.values(totals).reduce((a, b) => a + b, 0);

    // Sort categories by highest contribution
    const sortedCategories = Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, val]) => ({
        category: cat,
        emissions: Math.round(val * 100) / 100,
        percentage: totalEmissions > 0 ? Math.round((val / totalEmissions) * 100) : 0
      }));

    const recommendations = [];

    // Rule-based engine prioritizing highest emission categories
    sortedCategories.forEach(item => {
      if (item.emissions === 0) return;

      if (item.category === 'Transportation') {
        recommendations.push({
          category: 'Transportation',
          priority: item.percentage > 35 ? 'High' : 'Medium',
          title: 'Shift 2–3 Weekly Commutes to Public Transit or Cycling',
          description: `Transportation generates ${item.percentage}% (${item.emissions} kg CO₂) of your total footprint. Replacing solo car trips with commuter trains, buses, or cycling can cut your travel footprint by over 50%.`,
          action: 'Try combining errands into single trips or carpooling with colleagues.',
          potentialSavings: `${Math.round(item.emissions * 0.35)} kg CO₂ / month`
        });
        recommendations.push({
          category: 'Transportation',
          priority: 'Medium',
          title: 'Eco-Driving & Electric Mobility Consideration',
          description: 'Maintaining steady speeds, proper tire inflation, and exploring hybrid or EV options drastically lowers fuel consumption.',
          action: 'Avoid rapid acceleration and excessive idling.',
          potentialSavings: '10–15% fuel efficiency improvement'
        });
      } else if (item.category === 'Electricity') {
        recommendations.push({
          category: 'Electricity',
          priority: item.percentage > 30 ? 'High' : 'Medium',
          title: 'Optimize Home Appliance Usage & Eliminate Phantom Loads',
          description: `Electricity contributes ${item.percentage}% (${item.emissions} kg CO₂) of your emissions. Unplugging idle adapters and setting air conditioning 2°C higher saves substantial power.`,
          action: 'Switch remaining incandescent bulbs to 5-star rated LEDs.',
          potentialSavings: `${Math.round(item.emissions * 0.25)} kg CO₂ / month`
        });
      } else if (item.category === 'Food') {
        recommendations.push({
          category: 'Food',
          priority: item.percentage > 25 ? 'High' : 'Medium',
          title: 'Adopt Plant-Forward Meal Choices 2–3 Days a Week',
          description: `Food consumption accounts for ${item.percentage}% (${item.emissions} kg CO₂). Plant-based and vegetarian meals have a carbon intensity up to 4× lower than meat-heavy diets.`,
          action: 'Incorporate seasonal local vegetables and reduce food waste.',
          potentialSavings: `${Math.round(item.emissions * 0.3)} kg CO₂ / month`
        });
      } else if (item.category === 'Shopping') {
        recommendations.push({
          category: 'Shopping',
          priority: 'Medium',
          title: 'Prioritize Durable, Circular & Second-Hand Goods',
          description: `Consumer purchases contribute ${item.percentage}% (${item.emissions} kg CO₂). Manufacturing clothes, furniture, and gadgets carries significant embodied carbon.`,
          action: 'Follow the 30-day rule before non-essential purchases and choose recycled materials.',
          potentialSavings: `${Math.round(item.emissions * 0.2)} kg CO₂ / month`
        });
      } else if (item.category === 'Cooking') {
        recommendations.push({
          category: 'Cooking',
          priority: 'Low',
          title: 'Transition to Induction Cookware & Cook in Batches',
          description: `Cooking represents ${item.percentage}% (${item.emissions} kg CO₂). Induction cooktops are up to 84% energy-efficient compared to 40% for gas burners.`,
          action: 'Use pressure cookers and covered pots to trap heat and reduce cook time.',
          potentialSavings: `${Math.round(item.emissions * 0.2)} kg CO₂ / month`
        });
      }
    });

    res.status(200).json({
      success: true,
      hasData: true,
      topContributor: sortedCategories[0]?.category || 'None',
      topContributorPercent: sortedCategories[0]?.percentage || 0,
      sortedCategories,
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating recommendations'
    });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  getResultAndTips,
  deleteActivity,
  getAnalytics,
  getPersonalizedRecommendations
};
