import { For, Show, createEffect, createSignal } from "solid-js";
import MoreVert from "@suid/icons-material/MoreVert";
import { createSubTask, deleteTask } from "@src/pages/background";
import { createStore } from "solid-js/store";
import { Task, TaskInterface } from "@src/entity";
import { UseAuthState } from "@src/context/auth";

const TaskMenu = (props: any) => {
  const activeUser = UseAuthState();
  const [openMenu, setOpenMenu] = createSignal(false);
  const [newTask, setNewTask] = createStore<TaskInterface>(new Task());
  let menuRef: HTMLDivElement;

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef && !menuRef.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    console.log('NewTask: ', newTask);
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
            <a 
              href="#" 
              class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900" 
              role="menuitem" 
              onClick={() => { setOpenMenu(false); deleteTask(activeUser.token, activeUser.activeListId, props.task.id) }}>
                Delete
            </a>
            <a 
              href="#" 
              class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900" 
              role="menuitem" 
              onClick={() => { setOpenMenu(false); createSubTask(activeUser.token, activeUser.activeListId, props.task.id, newTask) }}>
                Add a subtask
            </a>
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