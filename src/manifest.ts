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
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvxJz240Fp/BmlEhCqxCVbyL646G+Y+GUKNk87IVM1WCpmbUvRr8UUwtI1xKDXQDYS6cYIhpPh3q3OXJB/VJk+gSNLA7iLAp5ygpA/U4jmLmEbRlQfmai6LxUipOce1leOHYOsIbi4fNh7+Twm0NwKSPhlx+3r8uwk6YgKDyEghQAB4b1qAkuxvBbxyX1ezDVVfzrvF5KvqkU0lRhSKCOAlTSS1RE0/o4Etiy+EgqNZz4BsXX6ix42yJOscbI1ZbvLbGgWU6SkCOuX4+1mtzgub7PkbyJhOWTm/3nxJTl+kXQTCZ3viaszsIilOeiWo+Zdcnq2dUWcjCBVSaOWN0JdwIDAQAB",
  oauth2: {
    "client_id": "281339005676-062h52qp39vhdgnuqfa9a12ed2hqcd9h.apps.googleusercontent.com",
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
