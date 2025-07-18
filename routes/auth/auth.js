const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const verifyToken = require('../../middleware/authMiddleware');


// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

// Récupérer le profil (protégé)
router.get('/profile',verifyToken, authController.getProfile);

module.exports = router;
