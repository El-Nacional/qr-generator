(() => {
  const defaults = {
    data: "https://example.com",
    size: 360,
    foreground: "#111827",
    background: "#ffffff",
    errorCorrection: "H",
    dotStyle: "square"
  };

  const elements = {
    form: document.querySelector("#qr-form"),

    data: document.querySelector("#qr-data"),

    size: document.querySelector("#qr-size"),
    sizeOutput: document.querySelector("#qr-size-output"),

    errorCorrection:
      document.querySelector("#error-correction"),

    foreground:
      document.querySelector("#foreground-color"),

    foregroundHex:
      document.querySelector("#foreground-hex"),

    background:
      document.querySelector("#background-color"),

    backgroundHex:
      document.querySelector("#background-hex"),

    dotStyle:
      document.querySelector("#dot-style"),

    logoFile:
      document.querySelector("#logo-file"),

    removeLogo:
      document.querySelector("#remove-logo"),

    downloadPng:
      document.querySelector("#download-png"),

    downloadSvg:
      document.querySelector("#download-svg"),

    reset:
      document.querySelector("#reset-form"),

    preview:
      document.querySelector("#qr-preview"),

    status:
      document.querySelector("#status")
  };

  let qrCode;
  let logoDataUrl = "";

  function setStatus(message) {
    elements.status.textContent = message;
  }

  function isHexColor(value) {
    return /^#[0-9a-f]{6}$/i.test(value.trim());
  }

  function getOptions() {
    const size = Number(elements.size.value);
    const data = elements.data.value.trim() || " ";

    return {
      width: size,
      height: size,

      type: "svg",

      data,

      image: logoDataUrl || undefined,

      margin:
        Math.max(
          8,
          Math.round(size * 0.035)
        ),

      qrOptions: {
        errorCorrectionLevel:
          elements.errorCorrection.value
      },

      imageOptions: {
        crossOrigin: "anonymous",

        margin:
          Math.max(
            3,
            Math.round(size * 0.012)
          ),

        imageSize: 0.32,
        hideBackgroundDots: true
      },

      dotsOptions: {
        color: elements.foreground.value,
        type: elements.dotStyle.value
      },

      cornersSquareOptions: {
        color: elements.foreground.value,
        type: "square"
      },

      cornersDotOptions: {
        color: elements.foreground.value,
        type: "square"
      },

      backgroundOptions: {
        color: elements.background.value
      }
    };
  }

  function render() {
    if (!window.QRCodeStyling) {
      setStatus("QR library unavailable");
      return;
    }

    const options = getOptions();

    elements.sizeOutput.value =
      `${options.width} px`;

    if (!qrCode) {
      qrCode =
        new QRCodeStyling(options);

      qrCode.append(elements.preview);
    } else {
      qrCode.update(options);
    }

    setStatus(
      elements.data.value.trim()
        ? "Ready"
        : "Enter content"
    );
  }

  function syncColor(
    colorInput,
    textInput,
    source
  ) {
    if (source === "picker") {
      textInput.value =
        colorInput.value.toLowerCase();

      render();
      return;
    }

    const normalized =
      textInput.value.trim();

    if (isHexColor(normalized)) {
      colorInput.value = normalized;

      textInput.setCustomValidity("");

      render();
    } else {
      textInput.setCustomValidity(
        "Use a six-digit hex color, for example #111827."
      );
    }
  }

  function download(extension) {
    if (
      !qrCode ||
      !elements.data.value.trim()
    ) {
      setStatus("Enter content first");
      elements.data.focus();

      return;
    }

    qrCode.download({
      name: "qr-code",
      extension
    });

    setStatus(
      `${extension.toUpperCase()} downloaded`
    );
  }

  elements.form.addEventListener(
    "submit",
    event => event.preventDefault()
  );

  elements.data.addEventListener(
    "input",
    render
  );

  elements.size.addEventListener(
    "input",
    render
  );

  elements.errorCorrection.addEventListener(
    "change",
    render
  );

  elements.dotStyle.addEventListener(
    "change",
    render
  );

  elements.foreground.addEventListener(
    "input",
    () =>
      syncColor(
        elements.foreground,
        elements.foregroundHex,
        "picker"
      )
  );

  elements.foregroundHex.addEventListener(
    "input",
    () =>
      syncColor(
        elements.foreground,
        elements.foregroundHex,
        "text"
      )
  );

  elements.background.addEventListener(
    "input",
    () =>
      syncColor(
        elements.background,
        elements.backgroundHex,
        "picker"
      )
  );

  elements.backgroundHex.addEventListener(
    "input",
    () =>
      syncColor(
        elements.background,
        elements.backgroundHex,
        "text"
      )
  );

  elements.logoFile.addEventListener(
    "change",
    event => {
      const [file] =
        event.target.files;

      if (!file) {
        return;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        logoDataUrl =
          String(reader.result || "");

        elements.removeLogo.disabled =
          false;

        render();

        setStatus("Logo added");
      };

      reader.readAsDataURL(file);
    }
  );

  elements.removeLogo.addEventListener(
    "click",
    () => {
      logoDataUrl = "";

      elements.logoFile.value = "";

      elements.removeLogo.disabled =
        true;

      render();

      setStatus("Logo removed");
    }
  );

  elements.downloadPng.addEventListener(
    "click",
    () => download("png")
  );

  elements.downloadSvg.addEventListener(
    "click",
    () => download("svg")
  );

  elements.reset.addEventListener(
    "click",
    () => {
      elements.data.value =
        defaults.data;

      elements.size.value =
        defaults.size;

      elements.foreground.value =
        defaults.foreground;

      elements.foregroundHex.value =
        defaults.foreground;

      elements.background.value =
        defaults.background;

      elements.backgroundHex.value =
        defaults.background;

      elements.errorCorrection.value =
        defaults.errorCorrection;

      elements.dotStyle.value =
        defaults.dotStyle;

      elements.logoFile.value = "";

      logoDataUrl = "";

      elements.removeLogo.disabled =
        true;

      render();

      setStatus("Reset");
    }
  );

  window.addEventListener(
    "DOMContentLoaded",
    render
  );
})();
