const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Connexion à la base PostgreSQL
const pool = new Pool({
  host: process.env.HOST_BDD,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PWD,
  port: process.env.DATABASE_PORT,
});


// GET /api/favorites : récupère les favoris de l’utilisateur connecté
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const result = await pool.query(
//       'SELECT project_id FROM favorites WHERE user_id = $1',
//       [userId]
//     );

//     const favorites = result.rows.map(row => row.project_id);

//     res.json({ favorites });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // // POST /api/favorites/:projectId : ajoute un favori
// router.post('/:projectId', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { projectId } = req.params;

//     await pool.query(
//       'INSERT INTO favorites (user_id, project_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
//       [userId, projectId]
//     );

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // // DELETE /api/favorites/:projectId : supprime un favori
// router.delete('/:projectId', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { projectId } = req.params;

//     await pool.query(
//       'DELETE FROM favorites WHERE user_id = $1 AND project_id = $2',
//       [userId, projectId]
//     );

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });
// module.exports = router;

async function getFavorites(req, res) {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT project_id FROM favorites WHERE user_id = $1', [userId]);
    const favorites = result.rows.map(row => row.project_id);
    res.json({ favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  getFavorites,
};