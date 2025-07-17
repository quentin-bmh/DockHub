const express = require('express');
const router = express.Router();
const authController = require('../../controller/authController');
const authenticateToken = require('../../middleware/authMiddleware');

// Route inscription
router.post('/signup', authController.signup);

// Route connexion
router.post('/login', authController.login);

// Route protégée exemple : info utilisateur connecté
router.get('/profile', authenticateToken, authController.profile);

module.exports = router;
