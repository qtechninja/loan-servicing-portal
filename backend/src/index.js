require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'loan-servicing-api', env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
});

app.get('/api/v1/status', (req, res) => {
  res.json({ message: 'Loan Servicing API is running', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Loan Servicing API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
