FROM node:20-bullseye-slim

# Instalar dependencias del sistema operativo (LibreOffice y fuentes básicas)
# Se usa --no-install-recommends para evitar paquetes innecesarios
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    fonts-liberation \
    fonts-noto \
    fonts-dejavu \
    && rm -rf /var/lib/apt/lists/*

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias de Node.js
COPY package*.json ./

# Instalar las dependencias de Node
RUN npm install --production

# Copiar el resto del código del backend
COPY . .

# Exponer el puerto que usará nuestro backend (Render y Docker recomiendan usar variables de entorno)
ENV PORT=3001
EXPOSE 3001

# Comando por defecto para iniciar la aplicación
CMD ["node", "index.js"]
