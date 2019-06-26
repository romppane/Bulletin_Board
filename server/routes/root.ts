import express = require('express');
const router = express.Router();

// Basic message to see that the connection works
router.get('/', function (req, res) {
  res.status(200).send('Bulletin_Board');
});
module.exports = router;
