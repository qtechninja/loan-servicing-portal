const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Loans endpoint — TODO' }));

module.exports = router;
