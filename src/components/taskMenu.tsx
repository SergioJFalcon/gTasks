import { For, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import MoreVert from "@suid/icons-material/MoreVert";

const TaskMenu = (props: any) => {
  const [openMenu, setOpenMenu] = createSignal(false);
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

  onMount(() => {
    console.log('\t\tTaskMenu mounted');
    console.log('\t\t\tprops.task: ', props.task);
    console.log('\t\t\tprops.lists: ', props.lists);
  });
  
  return (
    <div class="relative">
      <button onClick={() => setOpenMenu(!openMenu())}>
        <MoreVert />
      </button>
      <Show when={openMenu()}>
        <div ref={menuRef} class="absolute right-0 mt-2 rounded-md w-36 shadow-lg bg-white ring-1 ring-black z-40">
          <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <span class="block px-2 py-2 text-xs font-medium text-gray-900">Actions</span>
            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => { setOpenMenu(false); props.editTask(props.task); }}>Delete</a>
            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => { setOpenMenu(false); props.editTask(props.task); }}>Add a subtask</a>
            <hr />
            <span class="block px-2 py-2 text-xs font-medium text-gray-900">Move to another list</span>
            <For each={props.lists}>
              {(list: any) => (
                <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => { setOpenMenu(false); props.moveTask(props.task, list); }}>{list.title}</a>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default TaskMenu;