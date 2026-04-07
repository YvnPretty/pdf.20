const { PDFDocument } = require('pdf-lib');
const libre = require('libreoffice-convert');
const { promisify } = require('util');
const path = require('path');
libre.convertAsync = promisify(libre.convert);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file) {
  let ext = path.extname(file.originalname).toLowerCase();
  const validExtensions = ['.png', '.jpeg', '.jpg', '.txt', '.doc', '.docx', '.xls', '.xlsx'];
  
  // Fallback si no tiene punto (ej. archivo nombrado literalmente "xlsx")
  if (!ext && validExtensions.includes('.' + file.originalname.toLowerCase())) {
     ext = '.' + file.originalname.toLowerCase();
  }

  const isValidMime = [
    'image/png', 'image/jpeg', 'image/jpg', 'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword', 
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream', 'application/zip'
  ].includes(file.mimetype);

  // Fallback de extensión por MIME estricto si sigue sin extensión
  if (!ext && isValidMime) {
      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ext = '.xlsx';
      else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ext = '.docx';
  }

  if (!isValidMime && !validExtensions.includes(ext)) {
    return 'Formato no soportado. Procesamos imágenes (PNG, JPEG), Texto, Word (.docx) y Excel (.xlsx) con máxima fidelidad.';
  }
  
  if (!validExtensions.includes(ext)) {
     return 'Extensión de archivo desconocida. Por favor, sube un formato válido de Imagen, Texto, Word o Excel.';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'El archivo supera el tamaño máximo permitido de 10MB.';
  }
  return null;
}

async function processFileToPDF(file) {
  const { buffer, originalname } = file;
  let ext = path.extname(originalname).toLowerCase();
  if (!ext) {
     const validExtensions = ['.png', '.jpeg', '.jpg', '.txt', '.doc', '.docx', '.xls', '.xlsx'];
     if (validExtensions.includes('.' + originalname.toLowerCase())) ext = '.' + originalname.toLowerCase();
     else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ext = '.xlsx';
     else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ext = '.docx';
  }
  
  if (['.png', '.jpeg', '.jpg'].includes(ext)) {
    return convertImageToPDF(ext, buffer);
  } else if (ext === '.txt') {
    return convertTextToPDF(buffer.toString('utf8'));
  } else if (ext === '.docx' || ext === '.doc' || ext === '.xls' || ext === '.xlsx') {
    return await convertOfficeToPDF(buffer);
  }
  
  throw new Error('Tipo de archivo no listado para conversión');
}

async function convertOfficeToPDF(buffer) {
  // convert(document, format, filter)
  return await libre.convertAsync(buffer, '.pdf', undefined);
}

async function convertImageToPDF(ext, imageBuffer) {
  const pdfDoc = await PDFDocument.create();
  let image;
  if (ext === '.png') {
    image = await pdfDoc.embedPng(imageBuffer);
  } else {
    image = await pdfDoc.embedJpg(imageBuffer);
  }

  const { width, height } = image.scale(1);
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });
  return pdfDoc.save();
}

async function convertTextToPDF(text) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 40;

  const lines = text.split('\n');
  let y = height - margin;
  
  for (const line of lines) {
    if (y < margin) {
       page = pdfDoc.addPage();
       y = height - margin;
    }
    page.drawText(line, { x: margin, y, size: fontSize });
    y -= fontSize + 4;
  }

  return pdfDoc.save();
}

module.exports = { validateFile, processFileToPDF };
