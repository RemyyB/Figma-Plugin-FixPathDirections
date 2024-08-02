// https://www.figma.com/plugin-docs/manifest/

export default {
  name: "FixPathDirections", // Insert your plugin name
  id: "1400535304101549529", // Insert your plugin id
  api: "1.0.0",
  main: "./main.js",
  ui: "./plugin.html",
  editorType: ["figma"],
  networkAccess: {
    allowedDomains: ["none"],
  },
};
