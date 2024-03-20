import App from "@src/pages/content/components/ContentApp/app";
import { render } from "solid-js/web";

const root = document.createElement("div");
root.id = "extension-root";
document.body.append(root);

// contentScript.js


render(App, root);
