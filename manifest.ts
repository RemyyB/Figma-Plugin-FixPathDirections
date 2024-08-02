// https://www.figma.com/plugin-docs/manifest/

export default {
  name: "FixPathDirections",
  id: "1400535304101549529",
  api: "1.0.0",
  main: "./main.js",
  ui: "./plugin.html",
  documentAccess: "dynamic-page",
  editorType: ["figma"],
  networkAccess: {
    allowedDomains: ["none"],
  },
};
