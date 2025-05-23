// Only use dotenv-flow in local development (not in Docker)
if (process.env.NODE_ENV !== 'production' && process.env.IN_DOCKER !== 'true') {
  require('dotenv-flow').config();
}

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan'); // HTTP request logger
const cron = require('node-cron');
const plaidController = require('./controllers/plaidController');
const config = require('./config/config'); // Importing config
const budgetRoutes = require('./routes/budgetRoutes');
const challengeRoutes = require('./routes/challengeRoutes');

// Debug logs
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`FRONTEND_BASE_URL: ${process.env.FRONTEND_BASE_URL}`);

// Import Routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const plaidRoutes = require('./routes/plaidRoutes');
const aiInsightsRoutes = require('./routes/aiInsightRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import Middleware
const errorHandler = require('./middleware/errorHandler'); // Centralized error handling

// Middleware Configuration
const allowedOrigins = [
  process.env.FRONTEND_BASE_URL || 'http://localhost:3000',
  'http://financeflow.icu',
  'https://financeflow.icu'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev')); // Logs all incoming requests in the 'dev' format

// Routes Configuration
app.use('/api/users', userRoutes);
app.use('/api/plaid', plaidRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ai-insights', aiInsightsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/challenges', challengeRoutes);

// Handle Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Centralized Error Handler
app.use(errorHandler);

// Health check 
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily transaction update...');
  try {
    await plaidController.updateTransactions();
    console.log('Daily transaction update completed.');
  } catch (error) {
    console.error('Error during daily transaction update:', error);
  }
});
