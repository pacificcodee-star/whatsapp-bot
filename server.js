const { create } = require('@open-wa/wa-automate');
const express = require('express');

const app = express();
app.use(express.json());

// Render asigna el puerto mediante la variable PORT
const PORT = process.env.PORT || 3000;

create({
  sessionId: 'barber-session',
  multiDevice: true,
  headless: true,
  useChrome: false,
  qrTimeout: 0,
}).then((client) => {
  console.log('WhatsApp conectado');

  app.get('/', (req, res) => {
    res.send('WhatsApp Bot activo');
  });

  app.post('/send-message', async (req, res) => {
    try {
      const { to, message } = req.body;

      if (!to || !message) {
        return res.status(400).json({
          success: false,
          error: 'Faltan datos',
        });
      }

      await client.sendText(`${to}@c.us`, message);

      return res.json({
        success: true,
        sent_to: to,
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
  });
}).catch((error) => {
  console.error('Error iniciando WhatsApp:', error);
  process.exit(1);
});