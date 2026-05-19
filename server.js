const { create } = require('@open-wa/wa-automate');
const express = require('express');

const app = express();
app.use(express.json());

create({
  sessionId: 'barber-session',
  multiDevice: true,
  headless: false, // muestra el navegador para escanear QR
}).then(client => {
  console.log('WhatsApp conectado');

  app.post('/send-message', async (req, res) => {
    try {
      const { to, message } = req.body;

      if (!to || !message) {
        return res.status(400).json({
          success: false,
          error: 'Faltan datos',
        });
      }

      // Formato requerido por WhatsApp
      const chatId = `${to}@c.us`;

      await client.sendText(chatId, message);

      res.json({
        success: true,
        sent_to: to,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
  });
});