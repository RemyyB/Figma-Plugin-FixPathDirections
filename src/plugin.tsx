// Source: https://github.com/brianlovin/figma-export-zip
import JSZip from "../node_modules/jszip/dist/jszip.min.js";

function typedArrayToBuffer(array) {
  return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
}

function exportTypeToBlobType(type: string) {
  switch (type) {
    case "PDF":
      return "application/pdf";
    case "SVG":
      return "image/svg+xml";
    case "PNG":
      return "image/png";
    case "JPG":
      return "image/jpeg";
    default:
      return "image/png";
  }
}

window.onmessage = async (event) => {
  if (!event.data.pluginMessage) return;

  const { exportableBytes } = event.data.pluginMessage;

  return new Promise((resolve) => {
    const zip = new JSZip();

    for (const data of exportableBytes) {
      const { bytes, name, setting, extension } = data;
      const cleanBytes = typedArrayToBuffer(bytes);
      const type = exportTypeToBlobType(setting.format);
      const blob = new Blob([cleanBytes], { type });
      zip.file(`${name}${setting.suffix}${extension}`, blob, { base64: true });
    }

    zip.generateAsync({ type: "blob" }).then((content: Blob) => {
      const blobURL = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.className = "button button--primary";
      link.href = blobURL;
      link.download = "export.zip";
      link.click();
      link.setAttribute("download", name + ".zip");
      resolve();
    });
  }).then(() => {
    window.parent.postMessage(
      {
        pluginMessage: {
          code: 200,
          message: "Export finished!",
        },
      },
      "*",
    );
  });
};
