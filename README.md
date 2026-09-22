# QR Code Generator

A simple, client-side QR code generator designed to be hosted with GitHub Pages.

The application runs entirely in the browser. It does not require a backend or database.

## Features

- Generate QR codes from URLs or arbitrary text
- Adjust QR code size
- Choose foreground and background colors
- Select different QR dot styles
- Configure QR error correction
- Upload an optional logo
- Download QR codes as PNG
- Download QR codes as SVG
- Responsive interface
- No server-side processing

## Project Structure

```text
qr-generator/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## How It Works

The application uses HTML, CSS, and JavaScript.

QR codes are generated in the browser using the `qr-code-styling` JavaScript library.

The library is loaded from a CDN:

```html
<script
  defer
  src="https://unpkg.com/qr-code-styling@1.9.2/lib/qr-code-styling.js"
></script>
```

No QR code content or uploaded logo is sent to a backend operated by this project.

Note that because the QR library is loaded from a third-party CDN, the browser must be able to access that CDN for the generator to work.

## Running Locally

Because this is a static website, you can open `index.html` directly in a browser.

For development, it is usually preferable to run a simple local web server.

For example, using Python:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publishing with GitHub Pages

GitHub Pages can publish the website directly from the repository.

### 1. Create a GitHub Repository

Create a new repository, for example:

```text
qr-generator
```

### 2. Add the Project Files

Add these files to the root of the repository:

```text
index.html
styles.css
app.js
README.md
```

Commit and push the files to the `main` branch.

### 3. Enable GitHub Pages

In the GitHub repository:

1. Open **Settings**
2. Select **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Select the `main` branch
5. Select `/ (root)`
6. Click **Save**

GitHub will then publish the website.

The address will normally look like:

```text
https://YOUR-USERNAME.github.io/qr-generator/
```

## Using a Custom Domain

GitHub Pages also supports custom domains.

For example:

```text
qr.example.com
```

A custom domain can be configured under:

```text
Repository → Settings → Pages → Custom domain
```

You will also need to configure the appropriate DNS records with your DNS provider.

For a subdomain such as:

```text
qr.example.com
```

you would typically create a `CNAME` DNS record pointing to:

```text
YOUR-USERNAME.github.io
```

Refer to the current GitHub Pages documentation before changing production DNS settings.

## QR Error Correction

The generator supports the four standard QR error correction levels:

- **L** — Low
- **M** — Medium
- **Q** — Quartile
- **H** — High

Higher error correction makes QR codes more tolerant of missing or obscured areas but generally produces denser codes.

If a logo is placed in the center of the QR code, **High (H)** error correction is recommended.

## Logo Usage

The generator allows an image to be placed in the center of the QR code.

Supported browser image formats include:

- PNG
- JPEG
- WebP
- SVG

Large logos can make QR codes harder to scan.

Always test QR codes with multiple devices before publishing or printing them.

## PNG vs. SVG

### PNG

PNG is useful for:

- presentations
- websites
- email
- documents
- general digital use

### SVG

SVG is vector-based and is preferable for:

- professional printing
- large-format graphics
- signs
- marketing materials
- design software

SVG files can be scaled without losing quality.

## Production Recommendations

Before using a generated QR code publicly:

1. Scan-test it with multiple phones.
2. Verify the encoded destination.
3. Test the QR code at its intended physical size.
4. Maintain sufficient contrast between foreground and background.
5. Avoid placing critical artwork over the QR code.
6. Use high error correction when including a logo.
7. Test printed proofs before producing large quantities.

## Dependencies

This project currently uses:

```text
qr-code-styling
```

Project:

```text
https://github.com/kozakdenys/qr-code-styling
```

The browser version is loaded from `unpkg`.

For a production company tool, you may eventually want to vendor the JavaScript dependency into the repository instead of relying on a third-party CDN.

That would make the application self-contained and reduce reliance on an external service.

## Security and Privacy

The application does not require a backend.

QR code generation happens in the user's browser.

Uploaded logo images are read using the browser's `FileReader` API and used locally to generate the QR code.

The application itself does not intentionally transmit:

- QR code content
- uploaded logos
- generated QR codes

to a server.

However, the QR-generation JavaScript library is currently loaded from a third-party CDN. Organizations with stricter security or privacy requirements should consider hosting that dependency locally.

## License

Add the license appropriate for your organization before distributing or publishing the project.

Common options include:

- MIT
- Apache 2.0
- Proprietary / internal use

## Future Improvements

Possible additions include:

- Company branding
- Preset company colors
- Default company logo
- Saved QR presets
- Wi-Fi QR code generation
- vCard/contact QR codes
- Email QR codes
- Phone-number QR codes
- SMS QR codes
- UTM campaign builder
- Automatic URL validation
- QR scanability checks
- Branded file naming
- Local hosting of the QR-generation library
