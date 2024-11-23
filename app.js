const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/schoolRoutes'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// API Routes
app.use('/api', schoolRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
