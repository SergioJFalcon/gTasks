import { render } from "solid-js/web";
import "./index.css";
import { AuthProvider } from "@src/context";
import Popup from "./Popup";

const popupContainer = document.querySelector("#popup-container");
if (!popupContainer) {
  throw new Error("Can not find PopupContainer");
}

render(() =>
  (
    <AuthProvider>
      <Popup />
    </AuthProvider>
  ), popupContainer!
);