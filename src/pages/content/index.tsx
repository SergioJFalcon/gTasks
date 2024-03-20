import { render } from "solid-js/web";
import App from "./components/ContentApp/app";

// const root = document.createElement("div");
// root.id = "extension-root";
// document.body.append(root);

// Check if there's a div with id "example"
// const exampleDiv = document.getElementsByClassName("atvwebplayersdk-ad-timer-background fhwmucx");
// const amazonAdBox = document.getElementsByClassName("text-2xl font-bold tracking-tight");
// const volumeButton = document.getElementsByClassName("fqye4e3 f1ly7q5u fk9c3ap fz9ydgy f1xrlb00 f1hy0e6n fgbpje3 f1uteees f1h2a8xb f760yrh f1mic5r1 f13ipev8 fi0dpz f153k48l f1mic5r1 f45h");

// TODO: Extract total ad time from amazonAdBox div

// Send a message to background script if div is found
// if (amazonAdBox) {
//   chrome.runtime.sendMessage({ divFound: true });
//   // for each match, hide the element
//   for (let i = 0; i < amazonAdBox.length; i++) {
//     const element = amazonAdBox[i] as HTMLElement;
//     element.style.display = "none";
//   }
//   // we want to click the volume button and mute the ad by setting the volume to 0
//   for (let i = 0; i < volumeButton.length; i++) {
//     const element = volumeButton[i] as HTMLElement;
//     element.click();
//   }
// }

// chrome.storage.sync.get(['content'], (result) => {
//   if (result.content) {
//     render(App, root);
//   }
// });
