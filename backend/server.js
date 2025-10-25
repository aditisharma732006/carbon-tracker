// --- 1. Imports ---
require('dotenv').config(); // Loads .env variables *first*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const activityRoutes = require('./routes/activityRoutes');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors()); 
app.use(express.json()); 

//Database Connection
mongoose.connect(process.env.MONGO_URI)
 .then(() => {
 console.log('Successfully connected to MongoDB!');
 

 app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
 });
 })
 .catch((err) => {
 console.error('Error connecting to MongoDB. Check MONGO_URI in .env:', err.message);
});


app.use('/api/activities', activityRoutes);


// A simple root route to test if the server is up
app.get('/', (req, res) => {
 res.send('Carbon Tracker API is running!');
});
