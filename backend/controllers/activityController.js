const Activity = require('../models/activity');

// Emission factors (kg CO2 per unit)
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
 * Generates 3 random eco tips based on the calculated carbon footprint level.
 * @param {number} carbonFootprint 
 * @returns {string[]} An array of three random tips.
 */
const getEcoTips = (carbonFootprint) => {
 let tips = [];
 
 if (carbonFootprint < 10) {
  // LOW footprint (0-10 kg CO2)
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
  // MODERATE footprint (10-20 kg CO2)
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
  // HIGH footprint (20+ kg CO2)
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

 // Return 3 random tips from the appropriate category
 return tips.sort(() => 0.5 - Math.random()).slice(0, 3);
};

/**
 * Calculates the total carbon footprint based on activity data.
 * @param {object} activityData 
 * @returns {number} The total carbon footprint in kg CO2.
 */
const calculateCarbonFootprint = (activityData) => {
 let total = 0;

 // Transport calculation: Km * Factor
 total += activityData.transportUnitKm * emissionFactors.transport[activityData.transportType];
 
 // Electricity calculation: Kwh * Factor
 total += activityData.electricityUnitKwh * emissionFactors.electricity;
 
 // Cooking calculation: Daily Factor
 total += emissionFactors.cooking[activityData.cookingType];
 
 // Food calculation: Daily Factor
 total += emissionFactors.food[activityData.foodType];
 
 // Shopping calculation: Weekly Average Factor
 total += emissionFactors.shopping[activityData.shopping];

 // Round to two decimal places
 return Math.round(total * 100) / 100;
};

// @desc  Create a new activity and get result with tips
// @route  POST /api/activities
// @access Public
const createActivity = async (req, res) => {
 try {
  const {
   transportType,
   transportUnitKm,
   electricityUnitKwh,
   cookingType,
   foodType,
   shopping
  } = req.body;

  // Validate required string fields
  if (!transportType || !cookingType || !foodType || !shopping) {
   return res.status(400).json({
    success: false,
    message: 'All categorical fields are required: transportType, cookingType, foodType, shopping'
   });
  }

  // Validate required numeric fields (check for presence, Mongoose will handle type/min later)
  if (transportUnitKm === undefined || electricityUnitKwh === undefined) {
   return res.status(400).json({
    success: false,
    message: 'transportUnitKm and electricityUnitKwh are required'
   });
  }

  // Prepare data: Use parseFloat with a fallback to 0 for safety
  const activityData = {
   transportType,
   transportUnitKm: parseFloat(transportUnitKm) || 0,
   electricityUnitKwh: parseFloat(electricityUnitKwh) || 0,
   cookingType,
   foodType,
   shopping
  };

  // Calculate carbon footprint
  const carbonFootprint = calculateCarbonFootprint(activityData);

  // Create activity in database
  const activity = await Activity.create({
   ...activityData,
   carbonFootprint
  });

  // Get eco tips based on carbon footprint
  const tips = getEcoTips(carbonFootprint);

  // Determine footprint level
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

    // Handles Mongoose validation errors (e.g., incorrect enum value)
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed. Check your data types and enum values.',
            errors: messages
        });
    }
    
  res.status(500).json({
   success: false,
   message: 'Server error while creating activity'
  });
 }
};

// @desc  Get all activities history
// @route  GET /api/activities
// @access Public
const getActivities = async (req, res) => {
 try {
  // Find all activities, sorted by most recent first
  const activities = await Activity.find().sort({ date: -1 });
  
  // Calculate total statistics
  const totalFootprint = activities.reduce((total, activity) => {
   return total + activity.carbonFootprint;
  }, 0);

  const averageFootprint = activities.length > 0 ? totalFootprint / activities.length : 0;

  res.status(200).json({
   success: true,
   count: activities.length,
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

// @desc  Get result and tips (latest entry)
// @route  GET /api/activities/result
// @access Public
const getResultAndTips = async (req, res) => {
 try {
  // Get the single most recent activity
  const latestActivity = await Activity.findOne().sort({ date: -1 });
  
  if (!latestActivity) {
   return res.status(404).json({
    success: false,
    message: 'No activities found. Please add your first activity.'
   });
  }

  const carbonFootprint = latestActivity.carbonFootprint;
  const tips = getEcoTips(carbonFootprint);

  // Determine footprint level
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
    lastUpdated: latestActivity.date
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



module.exports = {
 createActivity,
 getActivities,
 getResultAndTips
};
