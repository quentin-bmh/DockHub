require('dotenv').config();
const express = require('express');
const { upload } = require('./config/multerConfig');
const nodemailer = require('nodemailer');
const authRoutes = require('./routes/auth/auth');
const favoritesRouter = require('./routes/favorites/fav');
const fs = require('fs');
const app = express();
app.use(express.static('public'));
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/api/favorites', favoritesRouter);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIS_PWD
  }
});

app.post('/send-suggestion', upload.single('attachment'), async (req, res) => {
  try {
    const { message, projectId } = req.body;
    if (!message || !projectId) {
      return res.status(400).json({ success: false, message: 'Message ou ID du projet manquant.' });
    }

    const mailOptions = {
      from: 'dockhubbot@gmail.com',
      to: process.env.MAIL_USER,
      subject: `Suggestion DockHub ➤ ${projectId}`,
      text: message,
      attachments: req.file ? [{
        filename: req.file.originalname,
        path: req.file.path
      }] : []
    };

    await transporter.sendMail(mailOptions);

    if (req.file) fs.unlinkSync(req.file.path);
    res.json({ success: true, message: 'Mail envoyé ! Merci pour votre suggestion.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur port ${PORT}`));
