# Tarjetas de Hechizos - La Marca del Este

Aplicación web para generar tarjetas de hechizos en formato PDF para los sistemas de juego de rol **Aventuras en La Marca del Este** y **Crónicas de La Marca**.

## 📋 Descripción

Esta aplicación permite a los usuarios seleccionar hechizos de diferentes sistemas de juego y generar tarjetas personalizadas en formato PDF que pueden ser impresas y utilizadas durante las partidas de rol. Las tarjetas se generan automáticamente rellenando plantillas PDF con la información de los hechizos almacenada en archivos JSON.

## 🎯 Características

- **Múltiples sistemas de juego**: Soporte para "Aventuras en La Marca del Este" y "Crónicas de La Marca"
- **Filtrado inteligente**: Filtra hechizos por tipo y nivel según el sistema seleccionado
- **Generación de PDF**: Crea documentos PDF profesionales con las tarjetas de hechizos seleccionadas
- **Interfaz responsive**: Diseño adaptable para dispositivos móviles y escritorio
- **Selección flexible**: Genera PDFs con hechizos específicos o con todos los hechizos filtrados

## 🏗️ Arquitectura

La aplicación sigue una arquitectura modular y orientada a objetos con separación clara de responsabilidades:

### Estructura de archivos

```
Cartas-Hechizos/
├── TarjetasHechizos.html          # Interfaz de usuario principal
├── javascript/
│   ├── SpellCardApp.js            # Aplicación principal (controlador)
│   ├── PDFService.js              # Servicio de generación de PDFs
│   ├── TH_sistemas.js             # Gestor de sistemas de juego
│   ├── TH_sistemabase.js          # Clase base para sistemas
│   ├── TH_aelmde.js               # Sistema "Aventuras en La Marca del Este"
│   ├── TH_cdlm.js                 # Sistema "Crónicas de La Marca"
│   ├── TH_comun.js                # Utilidades comunes
│   └── pdfform.minipdf.dist.js    # Biblioteca PDF (legacy)
├── json/
│   ├── TH-Aventuras-en-LMdE.json  # Base de datos de hechizos AeLMdE
│   └── TH-Cronicas-de-La-Marca.json # Base de datos de hechizos CdLM
└── pdf/
    ├── TH_AeLMdE_Hechizos.pdf     # Plantilla de tarjeta AeLMdE
    └── TH_CdLM_Hechizos.pdf       # Plantilla de tarjeta CdLM
```

### Componentes principales

#### 1. **SpellCardApp** (`SpellCardApp.js`)
Clase principal que coordina toda la aplicación:
- Gestiona el estado de la aplicación
- Coordina la interacción entre UI y lógica de negocio
- Maneja la selección de sistemas y hechizos
- Orquesta la generación de PDFs

#### 2. **PDFService** (`PDFService.js`)
Servicio especializado en la generación de PDFs:
- Carga y procesa plantillas PDF
- Rellena formularios con datos de hechizos
- Fusiona múltiples páginas en un único documento
- Gestiona la descarga del PDF final

#### 3. **Sistema de clases de juego**
- **Sistemas** (`TH_sistemas.js`): Gestor de sistemas disponibles
- **SistemaBase** (`TH_sistemabase.js`): Clase base abstracta con lógica común
- **AeLMdE** (`TH_aelmde.js`): Implementación para "Aventuras en La Marca del Este"
- **CdLM** (`TH_cdlm.js`): Implementación para "Crónicas de La Marca"

Cada sistema maneja:
- Carga de datos desde JSON
- Filtrado y organización de hechizos
- Generación de interfaz específica
- Mapeo de datos para formularios PDF

## 🚀 Instalación y uso

### Requisitos previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Opción 1: Uso directo
1. Clona o descarga el repositorio
2. Abre `TarjetasHechizos.html` directamente en tu navegador

### Opción 2: Con servidor local (recomendado)

```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server -p 8000

# Usando Docker Compose
docker-compose up
```

Luego accede a `http://localhost:8000/TarjetasHechizos.html`

## 📖 Guía de uso

1. **Seleccionar sistema**: Elige entre "Aventuras en La Marca del Este" o "Crónicas de La Marca"
2. **Filtrar hechizos**: Utiliza los selectores que aparecen para filtrar por tipo y/o nivel
3. **Seleccionar hechizos**: Marca las casillas de los hechizos que deseas incluir en el PDF
   - Si no seleccionas ninguno, se generarán tarjetas para todos los hechizos filtrados
4. **Generar PDF**: Haz clic en el botón "Genera PDF" para crear y descargar el archivo

## 🔧 Tecnologías utilizadas

- **HTML5**: Estructura de la aplicación
- **CSS3** (W3.CSS): Estilos y diseño responsive
- **JavaScript (ES6+)**: Lógica de la aplicación con clases y async/await
- **pdf-lib**: Manipulación y generación de PDFs
- **FileSaver.js**: Descarga de archivos en el navegador
- **Math.js**: Operaciones matemáticas (para cálculos de hechizos)

## 📝 Formato de datos

Los hechizos se almacenan en archivos JSON con la siguiente estructura:

```json
{
  "nombre": "Nombre del hechizo",
  "tipo": "Arcano/Divino/etc",
  "nivel": "1-9",
  "escuela": "Evocación/Abjuración/etc",
  "tiempo": "1 acción/1 minuto/etc",
  "alcance": "Personal/Toque/30 pies/etc",
  "componentes": "V, S, M (materiales)",
  "duracion": "Instantáneo/Concentración/etc",
  "descripcion": "Descripción completa del hechizo"
}
```

## 🛠️ Desarrollo

### Estructura del código

La aplicación sigue principios de programación orientada a objetos:

- **Separación de responsabilidades**: Cada clase tiene una responsabilidad única
- **Herencia**: Las clases de sistema heredan de `SistemaBase`
- **Encapsulación**: Los métodos privados se prefijan con `_`
- **Compatibilidad**: Funciones proxy globales para mantener compatibilidad con HTML inline

### Añadir un nuevo sistema

1. Crea un nuevo archivo en `javascript/` (ej: `TH_nuevosistema.js`)
2. Extiende la clase `SistemaBase`
3. Implementa los métodos abstractos:
   - `cargaHechizos()`
   - `numeroHechizos()`
   - `nombrePDF()`
   - `nombretarjetaPDF()`
   - `rellenaPDF(hechizos)`
4. Añade los datos JSON en `json/`
5. Añade la plantilla PDF en `pdf/`
6. Registra el nuevo sistema en `TH_sistemas.js`
7. Añade la opción en el selector HTML

## 📄 Licencia

Este proyecto está bajo la licencia especificada en el archivo [LICENSE](LICENSE).

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas, sugerencias o reportar problemas, por favor abre un issue en el repositorio.

---

**Comunidad La Marca del Este** - Sistema de generación de tarjetas de hechizos
