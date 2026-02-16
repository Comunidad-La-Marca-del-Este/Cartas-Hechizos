# Generador de Tarjetas de Hechizos - La Marca del Este

Este proyecto permite generar tarjetas de hechizos personalizadas en formato PDF para juegos de rol de **La Marca del Este** y **Crónicas de La Marca**.

## Descripción

La herramienta permite al usuario seleccionar un sistema de juego, filtrar por clase de personaje o tipo de magia (ej. Clérigo, Mago, Ilusionista), y seleccionar los hechizos específicos que desea incluir en su hoja de personaje. Finalmente, genera un archivo PDF listo para imprimir con las tarjetas de los hechizos seleccionados.

## Características

- **Soporte para Múltiples Juegos**:
  - *Aventuras en La Marca del Este*
  - *Crónicas de La Marca*
- **Filtrado Inteligente**: Selección de hechizos por clase y nivel.
- **Selección Individual**: Permite escoger exactamente qué hechizos incluir.
- **Generación de PDF**: Utiliza plantillas PDF predefinidas para rellenar los datos de los hechizos.

## Estructura del Proyecto

- `TarjetasHechizos.html`: Punto de entrada principal de la aplicación.
- `javascript/`:
  - `TH_sistemas.js`: Lógica general del sistema.
  - `TH_aelmde.js`: Lógica específica para *Aventuras en La Marca del Este*.
  - `TH_cdlm.js`: Lógica específica para *Crónicas de La Marca*.
  - `pdfform.minipdf.dist.js`: Librería para manipulación de PDFs.
- `json/`: Datos de los hechizos en formato JSON.
- `pdf/`: Plantillas PDF base utilisées para generar las tarjetas.
- `docker-compose.yml`: Configuración para desplegar la aplicación con Docker.

## Uso

### Ejecución Local
Puedes abrir directamente el archivo `TarjetasHechizos.html` en tu navegador web. No requiere servidor web para funcionalidades básicas, aunque algunas características de seguridad del navegador podrían limitar la carga de archivos locales.

### Ejecución con Docker (Recomendado)
Para evitar problemas con CORS o políticas de seguridad locales al cargar los archivos JSON y PDF, se recomienda usar el servidor web incluido con Docker.

1. Asegúrate de tener instalado Docker y Docker Compose.
2. En la raíz del proyecto, ejecuta:
   ```bash
   docker-compose up -d
   ```
3. Abre tu navegador y visita:
   [http://localhost:8080/TarjetasHechizos.html](http://localhost:8080/TarjetasHechizos.html)

## Tecnologías Utilizadas
- **HTML5 & Vanilla JavaScript**: Sin frameworks pesados.
- **W3.CSS**: Framework CSS ligero para el diseño.
- **Librerías JS**:
  - `pdfform.js`: Relleno de formularios PDF.
  - `FileSaver.js`: Guardado de archivos en el cliente.
  - `math.js`: Cálculos matemáticos.

## Licencia
Este proyecto se distribuye bajo la licencia especificada en el archivo `LICENSE`.
