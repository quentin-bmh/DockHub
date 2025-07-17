const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Configure ta connexion PostgreSQL (adapter selon ton config réelle)
const pool = new Pool({
  host: process.env.HOST_BDD,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,         // Remplace par ton user BDD
  password: process.env.DATABASE_PWD,      // Remplace par ton mdp BDD
  port: process.env.DATABASE_PORT,
});

// Clé secrète JWT (à stocker dans un .env dans un vrai projet)
const JWT_SECRET = process.env.JWT_SECRET;

// ----------- Fonction d'inscription -----------------
async function register(req, res) {
  try {
    const { email, password } = req.body;

    // Validation simple (à compléter selon besoin)
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Vérifier si l'email existe déjà
    const userCheck = await pool.query('SELECT id FROM "user" WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insérer l'utilisateur en base
    const result = await pool.query(
      'INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Retourner succès
    return res.status(201).json({ message: "Utilisateur créé", user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error("Erreur register:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// ----------- Fonction de connexion ------------------
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Trouver l'utilisateur en base
    const result = await pool.query('SELECT id, email, password FROM "user" WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer un token JWT (payload minimal)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error("Erreur login:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { register, login };
