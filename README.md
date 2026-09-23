# Generador de códigos QR — El Nacional

Herramienta web estática para crear códigos QR con la identidad visual de **El Nacional**. Está diseñada para publicarse con GitHub Pages y funciona completamente en el navegador, sin backend ni base de datos.

## Funciones

- URL o texto libre.
- Contactos en formato **vCard 3.0**.
- Credenciales de redes **Wi‑Fi**.
- Tamaño configurable.
- Colores de primer plano y fondo.
- Color predeterminado de El Nacional: `#002992`.
- Nivel de corrección de errores configurable; el valor predeterminado es **Bajo (L)**.
- Diferentes estilos para los módulos del QR.
- Logotipo opcional dentro del código QR.
- Descarga en PNG o SVG.
- Interfaz responsive en español.

## Estructura

```text
qr-generator/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Identidad de El Nacional

La interfaz utiliza el logotipo oficial indicado en:

```text
https://www.elnacional.com/wp-content/themes/elnacional/src/assets/images/Logo_El_Nacional_white.svg
```

El encabezado lo usa como una máscara CSS y aplica el color `#002992`. De esta manera se conserva la forma del SVG original y se muestra en azul.

> Nota: lo ideal para producción es guardar una copia local del SVG dentro del repositorio. El entorno usado para preparar esta versión no pudo recuperar directamente el contenido SVG desde ese endpoint, por lo que esta revisión referencia el archivo original remotamente.

## Tipos de QR

### URL o texto

Codifica directamente una URL o una cadena de texto.

### vCard

Genera una vCard 3.0 con campos para nombre, apellido, organización, cargo, teléfono, correo electrónico, web y dirección. Al escanearla, los teléfonos compatibles pueden ofrecer guardar el contacto.

### Wi‑Fi

Genera una cadena compatible con lectores QR para redes WPA/WPA2/WPA3, WEP o redes sin contraseña, incluyendo soporte para redes ocultas.

## Corrección de errores

La herramienta permite seleccionar:

- **L — Baja**: valor predeterminado; menor densidad del QR.
- **M — Media**.
- **Q — Cuartil**.
- **H — Alta**: recomendable cuando se coloca un logotipo encima del código.

## Ejecutar localmente

Puedes abrir `index.html` directamente, aunque para desarrollo es preferible utilizar un servidor web local.

Con Python:

```bash
python3 -m http.server 8000
```

Después abre:

```text
http://localhost:8000
```

## Publicar con GitHub Pages

1. Crea un repositorio en GitHub.
2. Añade `index.html`, `styles.css`, `app.js` y `README.md` en la raíz.
3. Haz commit y push a `main`.
4. En GitHub abre **Settings → Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**.
6. Selecciona `main` y `/ (root)`.
7. Guarda la configuración.

La URL normalmente tendrá esta forma:

```text
https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/
```

## Dominio personalizado

GitHub Pages permite configurar un dominio propio, por ejemplo:

```text
qr.elnacional.com
```

Se configura en **Settings → Pages → Custom domain** y requiere los registros DNS correspondientes.

## Dependencia

La generación de códigos QR utiliza `qr-code-styling` 1.9.2 desde `unpkg`:

```html
<script defer src="https://unpkg.com/qr-code-styling@1.9.2/lib/qr-code-styling.js"></script>
```

Para una herramienta corporativa en producción conviene guardar también esta dependencia dentro del repositorio y eliminar la dependencia del CDN externo.

## Privacidad

Los datos introducidos se procesan en el navegador. Esta aplicación no incluye un backend y no envía intencionalmente el contenido de los QR, las credenciales Wi‑Fi ni las imágenes cargadas a un servidor propio.

## Antes de publicar un QR

1. Comprueba el QR con varios teléfonos.
2. Verifica el destino o los datos codificados.
3. Pruébalo al tamaño físico en que será impreso.
4. Mantén buen contraste entre el código y el fondo.
5. Si colocas un logotipo dentro del QR, usa una corrección de errores mayor y vuelve a probarlo.

## Otros tipos que se pueden añadir

Tipos útiles para una futura versión:

- correo electrónico (`mailto:`),
- llamada telefónica (`tel:`),
- SMS,
- WhatsApp,
- ubicación geográfica,
- eventos de calendario (`VEVENT` / iCalendar).

En la mayoría de los casos conviene añadirlos solo si El Nacional tiene un uso concreto para ellos, ya que URL, vCard y Wi‑Fi cubren gran parte de los casos generales.

## Identidad de El Nacional

El logotipo de El Nacional se incluye localmente en:

```text
assets/logo-el-nacional.svg
```

El SVG usa el color corporativo `#002992`, por lo que la cabecera no depende de cargar el logotipo desde un servidor externo.
