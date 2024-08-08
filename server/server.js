const express = require('express');
const cors = require('cors')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Inventory Management' });
    
});


//Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;