const jwt = require('jsonwebtoken');

// La même clé secrète que dans authController.js
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  // Le token est attendu dans l'en-tête Authorization sous la forme "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrait le token

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
    // On stocke les infos du user dans req.user pour les routes protégées
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
