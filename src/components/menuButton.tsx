import { For, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import Menu from "@suid/material/Menu";
import MenuItem from "@suid/material/MenuItem";
import Divider from "@suid/material/Divider";
import Button from "@suid/material/Button";

import List from "@suid/material/List";
import ListItem from "@suid/material/ListItem";
import ListItemButton from "@suid/material/ListItemButton";
import ListItemIcon from "@suid/material/ListItemIcon";
import ListItemText from "@suid/material/ListItemText";

import Cloud from "@suid/icons-material/Cloud";
import Add from "@suid/icons-material/Add";
import AddTask from "@suid/icons-material/AddTask";
import ExpandMore from "@suid/icons-material/ExpandMore";
import { updateList } from "@src/pages/popup/Popup";

const MenuButton = (props: any) => {
  const [openMenu, setOpenMenu] = createSignal(false);
  const [activeListName, setActiveListName] = createSignal(props.activeListName);
  const [lists, setLists] = createSignal(props.lists);
  let menuRef: HTMLDivElement;

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef && !menuRef.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    onCleanup(() => {
      document.removeEventListener('mousedown', handleClickOutside);
    });
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      console.log('event.target: ', (event.target as HTMLInputElement).value);
      updateList(props.token, props.activeListId, (event.target as HTMLInputElement).value);
    }
  }
  // TODO - active menu item should be highlighted
  return (
    <div class="text-lg relative m-2">
      <input type="text" class="" disabled={false} value={props.activeListName} onKeyDown={handleKeyDown} />
      <button onClick={() => setOpenMenu(!openMenu())}>
        <ExpandMore />
      </button>
      <Show when={openMenu()}>
        <div ref={menuRef} class="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black z-40">
          <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <For each={lists()}>
              {(list: any) => (
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => { setOpenMenu(false); props.changeList(list); }} >{list.title}</a>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default MenuButton;