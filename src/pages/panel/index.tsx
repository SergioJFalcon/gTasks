import { render } from "solid-js/web";
import "./index.css";
import Panel from "./Panel";

const appContainer = document.querySelector("#app-container");
if (!appContainer) {
  throw new Error("Can not find AppContainer");
}

// Render the Panel component if the panel option is enabled
chrome.storage.sync.get(['panel'], (result) => {
  if (result.panel) {
    render(Panel, appContainer);
  }
});