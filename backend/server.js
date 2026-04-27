const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

console.log("==========================================");
console.log("SERVER BOOTED AT:", new Date().toISOString());
console.log("==========================================");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') console.log('Body:', req.body);
    next();
});

// Routes
const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interview', interviewRoutes);

app.get('/', (req, res) => {
    res.send('Interview Pressure Simulator API is running...');
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            family: 4 // Force IPv4
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('💡 TIP: Check if your IP is whitelisted in MongoDB Atlas (Network Access).');
        console.log('💡 TIP: If you are on a restricted network, the SRV protocol might be blocked. Try the "Standard Connection String" from Atlas.');
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
