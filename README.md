![Fix SVG Path Directions banner](figma-community-listing/banner.png)

# Figma Plugin - FixPathDirections

A very simple plugin to fix path directions in Figma.
You can use your existing export config, this plugin will export files to every format to a single ZIP file.
It will also warn if files are duplicated because they have the same name.

View the plugin in the [Figma Community Store](https://www.figma.com/community/plugin/1401164835210682874/svg-auto-fix-path-directions-fill-rule)


### How to use the plugin

1. Install the plugin, of course
2. Simply select your frames
3. (optional) If necessary set export settings in Figma
4. Open the plugin
5. Your exports will be downloaded in a zip to the selected folder

---

## This plugin is mainly built using:

- **[Fix-Path-Directions](https://github.com/herrstrietzel/fix-path-directions)** the brains of this plugin,
  thanks [@herrstrietzel](https://github.com/herrstrietzel)!
- **SVGO** for optimizing SVG's
- **Vite** for bundling the scripts to a single script file
- **Cheerio** for creating a virtual DOM to extract the data tags, this could be done via Regex, but I opted for
  flexibility
- **JSZip** for bundling the exports to a single ZIP file
