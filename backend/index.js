const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { processFileToPDF, validateFile } = require('./pdfConverter');

const app = express();
app.use(cors());

// Ruta simple para el hack de "Ping" que evite que Render se duerma
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/convert', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se subió ningún archivo.' });
    }

    // Validation Module
    for (const file of req.files) {
      const validationError = validateFile(file);
      if (validationError) {
        return res.status(400).json({ error: `Error en ${file.originalname}: ${validationError}` });
      }
    }

    // Conversion Module
    const pdfBytes = await processFileToPDF(req.files);

    res.setHeader('Content-Type', 'application/pdf');
    const baseName = req.files[0].originalname.split('.')[0];
    const finalName = req.files.length > 1 ? `${baseName}_multipage` : baseName;
    res.setHeader('Content-Disposition', `attachment; filename="${finalName}.pdf"`);
    res.send(Buffer.from(pdfBytes));

  } catch (err) {
    console.error('Error durante la conversión:', err);
    res.status(500).json({ error: 'Error del servidor al intentar convertir el archivo. Asegúrese de que no esté corrupto.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend de conversión corriendo en http://localhost:${PORT}`);
});
