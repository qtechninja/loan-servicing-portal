require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'loan-servicing-portal-api', env: process.env.NODE_ENV });
});

// Routes
app.use('/api/v1/loans', require('./routes/loans'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/auth', require('./routes/auth'));

app.listen(PORT, () => {
  console.log(`Loan Servicing API running on port ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = app;
