import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = packageJson.version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: packageJson.displayName ?? packageJson.name,
  description: packageJson.description,
  author: packageJson.author,
  version: `${major}.${minor}.${patch}.${label}`,
  key: process.env.VITE_KEY,
  oauth2: {
    "client_id": process.env.VITE_OAUTH_CLIENT_ID,
    "scopes": [
      "profile email",
      "https://www.googleapis.com/auth/contacts",
      "https://www.googleapis.com/auth/tasks"
    ]
  },
  options_page: "src/pages/options/index.html",
  "options_ui": {
    "page": "src/pages/options/index.html",
    "open_in_tab": false
  },
  background: { 
    service_worker: "src/pages/background/index.ts",
    persistent: false
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icons/addtask.png",
  },
  icons: {
    "128": "icons/128icon.png",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/pages/content/index.tsx"],
    },
  ],
  side_panel: {
    "default_path": "src/pages/panel/index.html",
  },
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "assets/img/*", "icons/*.png"],
      matches: ["*://*/*"],
    },
  ],
  devtools_page: "src/pages/devtools/index.html",
  permissions: [
    "activeTab", 
    "alarms", 
    "contextMenus", 
    "identity", 
    "identity.email", 
    "notifications", 
    "sidePanel",
    "storage", 
    "tabs", 
  ],
}));

export default manifest;
