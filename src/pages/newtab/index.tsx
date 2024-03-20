import { render } from "solid-js/web";
import "./index.css";
import Newtab from "./Newtab";

const appContainer = document.querySelector("#app-container");
if (!appContainer) {
  throw new Error("Can not find AppContainer");
}

// Render the Newtab component if the newtab option is enabled
chrome.storage.sync.get(['newtab'], (result) => {
  if (result.newtab) {
    render(Newtab, appContainer);
  }
});