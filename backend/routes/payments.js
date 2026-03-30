const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Payments endpoint — TODO' }));

module.exports = router;
