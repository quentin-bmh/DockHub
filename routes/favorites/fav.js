const express = require('express');
const router = express.Router();

const favController = require('../../controllers/favController');

// exemple : GET /
router.get('/', favController.getFavorites);
// POST /:projectId
// router.post('/:projectId', favController.addFavorite);
// DELETE /:projectId
// router.delete('/:projectId', favController.removeFavorite);
router.get('/', (req, res) => {
  res.json({ message: 'Route favorites OK !' });
});
module.exports = router;
