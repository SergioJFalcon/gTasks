import logo from "@assets/img/logo.svg";
import "@src/styles/index.css";
import styles from "./Options.module.css";

import { createSignal, onMount } from 'solid-js';

const Options = () => {
  const [content, setContent] = createSignal(false);
  const [devtools, setDevtools] = createSignal(true);
  const [popup, setPopup] = createSignal(true);
  const [newtab, setNewtab] = createSignal(true);
  const [panel, setPanel] = createSignal(true);

  // Load content from Chrome storage on component mount
  onMount(() => {
    chrome.storage.sync.get('content', (result) => {
      setContent(result.content);
    });
    chrome.storage.sync.get('devtools', (result) => {
      setDevtools(result.devtools);
    });
    chrome.storage.sync.get('popup', (result) => {
      setPopup(result.popup);
    });
    chrome.storage.sync.get('newtab', (result) => {
      setNewtab(result.newtab);
    });
    chrome.storage.sync.get('panel', (result) => {
      setPanel(result.panel);
    });
  });
  
  const handleContent = () => {
    setContent(!content());
    console.log("Setting Content Panel to: " + content());
    chrome.storage.sync.set({ content: content() }, 
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Content panel has been saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    });
  };
  const handleDevtools = () => {
    setDevtools(!devtools());
    console.log("Setting Devtools Panel to: " + devtools());
    chrome.storage.sync.set({ devtools: devtools() },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Devtools panel has been saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    });
  };
  const handlePopup = () => {
    setPopup(!popup());
    console.log("Setting Popup Panel to: " + popup());
    chrome.storage.sync.set({ popup: popup() },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Popup panel has been saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    });
  };
  const handleNewtab = () => {
    setNewtab(!newtab());
    console.log("Setting Newtab Panel to: " + newtab());
    chrome.storage.sync.set({ newtab: newtab() },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Newtab panel has been saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    });
  };
  const handlePanel = () => {
    setPanel(!panel());
    console.log("Setting Panel Panel to: " + panel());
    chrome.storage.sync.set({ panel: panel() },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Panel panel has been saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    });
  };

  return (
    <div class={styles.App}>
      <label>
        <input type="checkbox" checked={content()} onChange={() => { handleContent(); }}/>
        Content
      </label>
      <label>
        <input type="checkbox" checked={devtools()} onChange={() => { handleDevtools(); }}/>
        Devtools
      </label>
      <label>
        <input type="checkbox" checked={popup()} onChange={() => { handlePopup(); }}/>
        Popup
      </label>
      <label>
        <input type="checkbox" checked={newtab()} onChange={() => { handleNewtab(); }}/>
        Newtab
      </label>
      <label>
        <input type="checkbox" checked={panel()} onChange={() => { handlePanel(); }}/>
        Panel
      </label>
      
      <div id="status"></div>
    </div>
  );
};

export default Options;
