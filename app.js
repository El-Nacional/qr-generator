(() => {
  const defaults = {
    type: "text",
    data: "https://www.elnacional.com/",
    size: 360,
    foreground: "#002992",
    background: "#ffffff",
    errorCorrection: "L",
    dotStyle: "square"
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const elements = {
    form: $("#qr-form"), type: $("#qr-type"), data: $("#qr-data"), size: $("#qr-size"), sizeOutput: $("#qr-size-output"),
    errorCorrection: $("#error-correction"), foreground: $("#foreground-color"), foregroundHex: $("#foreground-hex"),
    background: $("#background-color"), backgroundHex: $("#background-hex"), dotStyle: $("#dot-style"), logoFile: $("#logo-file"),
    removeLogo: $("#remove-logo"), downloadPng: $("#download-png"), downloadSvg: $("#download-svg"), reset: $("#reset-form"),
    preview: $("#qr-preview"), status: $("#status"),
    vFirst: $("#vcard-first-name"), vLast: $("#vcard-last-name"), vOrg: $("#vcard-organization"), vTitle: $("#vcard-title"),
    vPhone: $("#vcard-phone"), vEmail: $("#vcard-email"), vUrl: $("#vcard-url"), vAddress: $("#vcard-address"),
    vCity: $("#vcard-city"), vRegion: $("#vcard-region"), vPostal: $("#vcard-postal"), vCountry: $("#vcard-country"),
    wifiSsid: $("#wifi-ssid"), wifiSecurity: $("#wifi-security"), wifiPassword: $("#wifi-password"), wifiHidden: $("#wifi-hidden")
  };

  let qrCode;
  let logoDataUrl = "";

  const setStatus = message => { elements.status.textContent = message; };
  const isHexColor = value => /^#[0-9a-f]{6}$/i.test(value.trim());
  const escapeWifi = value => String(value || "").replace(/([\\;,:\"])/g, "\\$1");
  const escapeVCard = value => String(value || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

  function buildVCard() {
    const first = escapeVCard(elements.vFirst.value.trim());
    const last = escapeVCard(elements.vLast.value.trim());
    const full = [elements.vFirst.value.trim(), elements.vLast.value.trim()].filter(Boolean).join(" ");
    const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${last};${first};;;`, `FN:${escapeVCard(full)}`];
    if (elements.vOrg.value.trim()) lines.push(`ORG:${escapeVCard(elements.vOrg.value.trim())}`);
    if (elements.vTitle.value.trim()) lines.push(`TITLE:${escapeVCard(elements.vTitle.value.trim())}`);
    if (elements.vPhone.value.trim()) lines.push(`TEL;TYPE=CELL:${escapeVCard(elements.vPhone.value.trim())}`);
    if (elements.vEmail.value.trim()) lines.push(`EMAIL:${escapeVCard(elements.vEmail.value.trim())}`);
    if (elements.vUrl.value.trim()) lines.push(`URL:${escapeVCard(elements.vUrl.value.trim())}`);
    const addressParts = [elements.vAddress, elements.vCity, elements.vRegion, elements.vPostal, elements.vCountry].map(el => el.value.trim());
    if (addressParts.some(Boolean)) lines.push(`ADR;TYPE=WORK:;;${escapeVCard(addressParts[0])};${escapeVCard(addressParts[1])};${escapeVCard(addressParts[2])};${escapeVCard(addressParts[3])};${escapeVCard(addressParts[4])}`);
    lines.push("END:VCARD");
    return lines.join("\r\n");
  }

  function buildWifi() {
    const security = elements.wifiSecurity.value;
    const ssid = escapeWifi(elements.wifiSsid.value.trim());
    const password = security === "nopass" ? "" : escapeWifi(elements.wifiPassword.value);
    return `WIFI:T:${security};S:${ssid};P:${password};H:${elements.wifiHidden.checked ? "true" : "false"};;`;
  }

  function getEncodedData() {
    if (elements.type.value === "vcard") return buildVCard();
    if (elements.type.value === "wifi") return buildWifi();
    return elements.data.value.trim();
  }

  function getOptions() {
    const size = Number(elements.size.value);
    return {
      width: size, height: size, type: "svg", data: getEncodedData() || " ", image: logoDataUrl || undefined,
      margin: Math.max(8, Math.round(size * 0.035)),
      qrOptions: { errorCorrectionLevel: elements.errorCorrection.value },
      imageOptions: { crossOrigin: "anonymous", margin: Math.max(3, Math.round(size * 0.012)), imageSize: 0.32, hideBackgroundDots: true },
      dotsOptions: { color: elements.foreground.value, type: elements.dotStyle.value },
      cornersSquareOptions: { color: elements.foreground.value, type: "square" },
      cornersDotOptions: { color: elements.foreground.value, type: "square" },
      backgroundOptions: { color: elements.background.value }
    };
  }

  function hasMinimumContent() {
    if (elements.type.value === "wifi") return Boolean(elements.wifiSsid.value.trim());
    if (elements.type.value === "vcard") return Boolean(elements.vFirst.value.trim() || elements.vLast.value.trim() || elements.vOrg.value.trim());
    return Boolean(elements.data.value.trim());
  }

  function render() {
    if (!window.QRCodeStyling) { setStatus("No se pudo cargar la biblioteca QR"); return; }
    const options = getOptions();
    elements.sizeOutput.value = `${options.width} px`;
    if (!qrCode) { qrCode = new QRCodeStyling(options); qrCode.append(elements.preview); }
    else qrCode.update(options);
    setStatus(hasMinimumContent() ? "Listo" : "Completa los datos");
  }

  function updateType() {
    $$("[data-type-panel]").forEach(panel => { panel.hidden = panel.dataset.typePanel !== elements.type.value; });
    render();
  }

  function syncColor(colorInput, textInput, source) {
    if (source === "picker") { textInput.value = colorInput.value.toLowerCase(); render(); return; }
    const normalized = textInput.value.trim();
    if (isHexColor(normalized)) { colorInput.value = normalized; textInput.setCustomValidity(""); render(); }
    else textInput.setCustomValidity("Usa un color hexadecimal de seis dígitos, por ejemplo #002992.");
  }

  function download(extension) {
    if (!qrCode || !hasMinimumContent()) { setStatus("Completa los datos antes de descargar"); return; }
    qrCode.download({ name: `el-nacional-qr-${elements.type.value}`, extension });
    setStatus(`${extension.toUpperCase()} descargado`);
  }

  elements.form.addEventListener("submit", event => event.preventDefault());
  elements.type.addEventListener("change", updateType);
  elements.size.addEventListener("input", render);
  elements.errorCorrection.addEventListener("change", render);
  elements.dotStyle.addEventListener("change", render);
  $$("textarea, input, select").filter(el => ![elements.size, elements.errorCorrection, elements.dotStyle, elements.type, elements.foreground, elements.foregroundHex, elements.background, elements.backgroundHex, elements.logoFile].includes(el)).forEach(el => el.addEventListener("input", render));
  elements.wifiSecurity.addEventListener("change", () => { elements.wifiPassword.disabled = elements.wifiSecurity.value === "nopass"; render(); });
  elements.foreground.addEventListener("input", () => syncColor(elements.foreground, elements.foregroundHex, "picker"));
  elements.foregroundHex.addEventListener("input", () => syncColor(elements.foreground, elements.foregroundHex, "text"));
  elements.background.addEventListener("input", () => syncColor(elements.background, elements.backgroundHex, "picker"));
  elements.backgroundHex.addEventListener("input", () => syncColor(elements.background, elements.backgroundHex, "text"));

  elements.logoFile.addEventListener("change", event => {
    const [file] = event.target.files;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { logoDataUrl = String(reader.result || ""); elements.removeLogo.disabled = false; render(); setStatus("Logotipo añadido"); };
    reader.readAsDataURL(file);
  });
  elements.removeLogo.addEventListener("click", () => { logoDataUrl = ""; elements.logoFile.value = ""; elements.removeLogo.disabled = true; render(); setStatus("Logotipo eliminado"); });
  elements.downloadPng.addEventListener("click", () => download("png"));
  elements.downloadSvg.addEventListener("click", () => download("svg"));

  elements.reset.addEventListener("click", () => {
    elements.form.reset();
    elements.type.value = defaults.type;
    elements.data.value = defaults.data;
    elements.size.value = defaults.size;
    elements.foreground.value = defaults.foreground;
    elements.foregroundHex.value = defaults.foreground;
    elements.background.value = defaults.background;
    elements.backgroundHex.value = defaults.background;
    elements.errorCorrection.value = defaults.errorCorrection;
    elements.dotStyle.value = defaults.dotStyle;
    elements.vOrg.value = "El Nacional";
    elements.vUrl.value = "https://www.elnacional.com/";
    logoDataUrl = "";
    elements.removeLogo.disabled = true;
    updateType();
    setStatus("Restablecido");
  });

  window.addEventListener("DOMContentLoaded", updateType);
})();
