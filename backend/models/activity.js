const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
 transportType: {
  type: String,
  enum: ['None', 'Car', 'Bus', 'Train', 'Bike', 'Motorcycle', 'Electric Car'],
  default: 'None',
    required: [true, 'Transport type is required.'],
 },
 transportUnitKm: {
  type: Number,
  default: 0,
  min: [0, 'Distance cannot be negative.'],
    required: [true, 'Transport distance is required.'],
 },
 electricityUnitKwh: {
  type: Number,
  default: 0,
  min: [0, 'Electricity usage cannot be negative.'],
    required: [true, 'Electricity usage is required.'],
 },
 cookingType: {
  type: String,
  enum: ['None', 'Gas', 'Electric', 'Induction'],
  default: 'None',
    required: [true, 'Cooking type is required.'],
 },
 foodType: {
  type: String,
  enum: ['None', 'Beef', 'Chicken', 'Vegetarian', 'Vegan', 'Fish', 'Pork'],
  default: 'None',
    required: [true, 'Food type is required.'],
 },
 shopping: {
  type: String,
  enum: ['None', 'Clothes', 'Electronics', 'Furniture', 'Plastic', 'Groceries'],
  default: 'None',
    required: [true, 'Shopping category is required.'],
 },
 carbonFootprint: {
  type: Number,
  required: true
 },
 date: {
  type: Date,
  default: Date.now
 }
}, {
 timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Activity', activitySchema);
