const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const typejobRoutes = require('./routes/typejob.routes');
const jobRoutes = require('./routes/job.routes');
const logRoutes = require('./routes/log.routes');

const app = express();
dotenv.config();
connectDB();

const cors = require('cors');

// Cho phép frontend từ http://localhost (Nginx) và http://localhost:5173 (dev)
app.use(cors({
  origin: ['http://localhost', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/typejob', typejobRoutes);
app.use('/api/job', jobRoutes); 
app.use('/api/logs', logRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));