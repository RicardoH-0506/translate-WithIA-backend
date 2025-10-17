# 🌐 Translate With IA - Backend

API REST de traducción impulsada por IA construida con Node.js, Express y Cohere AI.

## 📋 Descripción

Backend de servicio de traducción que expone endpoints HTTP para traducir texto entre múltiples idiomas utilizando el modelo especializado de traducción de Cohere AI (`command-a-translate-08-2025`). [1](#0-0) 

## ✨ Características

- 🤖 Traducción impulsada por IA usando Cohere
- 🔍 Detección automática de idioma de origen
- 🌍 Soporte para múltiples pares de idiomas
- ✅ Validación de solicitudes con Zod
- 🔒 Control CORS para seguridad
- ⚡ Optimización: retorna texto original si los idiomas son iguales [2](#0-1) 

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (versión recomendada: LTS)
- pnpm 10.17.1+
- Clave API de Cohere

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/RicardoH-0506/translate-WithIA-backend.git
cd translate-WithIA-backend
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
```bash
# Crea un archivo .env en la raíz del proyecto
COHERE_API_KEY=tu_clave_api_aqui
PORT=1234
```

4. Inicia el servidor:
```bash
# Modo producción
pnpm start

# Modo desarrollo (con watch)
pnpm run dev
```

El servidor estará disponible en `http://localhost:1234` [3](#0-2) 

## 📡 API Endpoints

### GET /

Retorna metadatos del servicio y endpoints disponibles. [4](#0-3) 

**Respuesta:**
```json
{
  "api_name": "AI-powered translation API",
  "version": "v1.0",
  "status": "online",
  "documentation": "Use the POST method on the /translate endpoint to send text and receive the translation.",
  "available_endpoints": {
    "translate": "POST /translate"
  }
}
```

### POST /translate

Traduce texto entre idiomas.

**Request Body:**
```json
{
  "text": "Hello world",
  "fromLang": "auto",
  "toLang": "Spanish"
}
```

**Respuesta exitosa:**
```json
{
  "translatedText": "Hola mundo"
}
```

**Respuesta de error (400):**
```json
{
  "errors": { ... },
  "message": "There were validation errors"
}
``` [5](#0-4) 

## 🛠️ Tecnologías

- **Express** 5.1.0 - Framework web
- **Cohere AI** 7.19.0 - Cliente de IA para traducción
- **Zod** 4.1.11 - Validación de esquemas
- **CORS** 2.8.5 - Control de acceso cross-origin
- **dotenv** 17.2.2 - Gestión de variables de entorno [6](#0-5) 

## 🔒 Seguridad

- CORS restringido a orígenes específicos (`localhost:5173` y `translate-with-ia.vercel.app`) [7](#0-6) 
- Header `X-Powered-By` deshabilitado [8](#0-7) 
- Validación de entrada antes del procesamiento

## 📁 Estructura del Proyecto

```
translate-WithIA-backend/
├── translate-ia.js          # Punto de entrada
├── app.js                   # Aplicación Express y rutas
├── few-shot.js             # Mensajes de ejemplo para IA
├── constants.js            # Mapeo de idiomas soportados
├── schemas/
│   └── translation.js      # Schema de validación (Zod)
├── package.json            # Dependencias y scripts
└── .env                    # Variables de entorno (no en repo)
```

## 📝 Licencia

[Especifica tu licencia aquí]

## 👤 Autor

Ricardo H - [@RicardoH-0506](https://github.com/RicardoH-0506)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.
```
