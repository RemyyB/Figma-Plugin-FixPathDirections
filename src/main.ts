// Load required libraries
import * as cheerio from "cheerio";
import { optimize } from "svgo";
import { getFixedSVGPathData } from "./util/getFixedSVGPathData";
import { exportTypeToFileExtension } from "./util/exportTypeToFileExtension";

// Define data structure for export
interface ExportableBytes {
  name: string;
  setting: ExportSettingsImage | ExportSettingsPDF | ExportSettingsSVG;
  bytes: Uint8Array;
  extension: string;
}

// Main function
async function main() {
  // Define variables
  const { selection } = figma.currentPage;
  const exportableBytes: ExportableBytes[] = [];

  // Get selected SVG data
  if (!selection || selection.length === 0) {
    return {
      message: "Nothing selected for export",
      code: 200,
    };
  }

  // Loop through all selected nodes
  for (const node of selection) {
    // Create an SVG from the selected node
    const nodeBytes = await node.exportAsync({
      format: "SVG_STRING",
    });

    // Load current selection from SVG data
    const virtualDOM = cheerio.load(nodeBytes);

    // Loop each SVG path and fix data
    virtualDOM("svg path").each((i: never, elem: never) => {
      // Save new path data to the virtual DOM
      elem.attribs.d = getFixedSVGPathData(elem);

      // Remove clip and fill rules since it is no longer needed
      virtualDOM(elem).attr("fill-rule", null);
      virtualDOM(elem).attr("clip-rule", null);
    });

    // Optimize SVG with SVGO
    const svgoOptimizedSVG = optimize(virtualDOM("svg").prop("outerHTML"), {
      multipass: true, // all other config fields are available here
    }).data;

    // Create temporary SVG node that can be used to export the SVG from Figma into every format
    const newSVGNode = figma.createNodeFromSvg(svgoOptimizedSVG);
    newSVGNode.name = "tmp-" + node.name;

    // @Todo Test newSVGNode.exportAsync before removing this way, or use this as a fallback (this only does support SVG export, not png etc.)
    //const bytes: Uint8Array = Uint8Array.from(Array.from(svgoOptimizedSVG).map((letter) => letter.charCodeAt(0)));

    // Set export settings. Defaults to SVG if no export setting is set
    let { exportSettings } = node;
    if (exportSettings.length === 0) exportSettings = [{ format: "SVG", suffix: "", contentsOnly: true }];

    // Loop through all export settings and put the data in a bytearray
    for (const setting of exportSettings) {
      // Export temporary svg node
      const bytes = await newSVGNode.exportAsync(setting);

      // Push data to bytearray for download
      exportableBytes.push({
        name: node.name,
        setting: setting,
        bytes: bytes,
        extension: exportTypeToFileExtension(setting.format),
      });
    }

    // Remove temporary made node from SVG
    newSVGNode.remove();
  }

  // Check duplicate values and warn the user about it
  const duplicateNames = exportableBytes.map((e) => e.name + e.extension);
  const duplicates = duplicateNames.filter((item, index) => duplicateNames.indexOf(item) !== index);
  if (duplicates.length > 0) {
    figma.notify(`Duplicates found! Data could be missing: ${duplicates.join(", ")}`, {
      timeout: 6000,
      error: true,
    });
  }

  // Show UI, which loads the scripts to download the files to a ZIP
  figma.showUI(__html__, { visible: false });
  figma.ui.postMessage({ exportableBytes });

  // Resolve promise and post message
  return new Promise((resolve) => {
    figma.ui.onmessage = (response) => {
      resolve({
        message: response.message,
        code: response.code,
      });
    };
  });
}

// Call main function and resolve
main().then((response) => {
  // Log messages
  console.log(response.code, response.message);

  // Notify
  figma.notify(response.message, {
    timeout: 3000,
    error: response.code > 299,
  });

  // Close the plugin
  figma.closePlugin();
});
