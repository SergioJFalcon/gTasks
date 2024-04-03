import { Show, createEffect, createSignal } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

import { updateTask } from "@src/pages/background";
import TaskCheckbox from "./taskCheckbox";
import DateChip from "./dateChip";
import TaskMenu from "./taskMenu";
import { UseAuthState } from "@src/context/auth";

const TaskItem = (props: any) => {
  const activeUser = UseAuthState();
  const [hovered, setHovered] = createSignal(false);
  const [focused, setFocused] = createSignal(false);
  let taskItem: HTMLDivElement;
  const [task, setTask] = createStore(props.task);
  let [titleTextarea, setTitleTextarea] = createSignal<HTMLTextAreaElement>();
  let [notesTextarea, setNotesTextarea] = createSignal<HTMLTextAreaElement>();

  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleInput = (ev: any) => {
    setTask([ev.currentTarget.name], ev.currentTarget.value);
    autoResize(ev.srcElement)
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      console.log('task notes: ', task);
      console.log('task notes: ', task.title);
      console.log('task notes: ', task.notes);
      console.log('unwrap(task): ', unwrap(task));
      updateTask(activeUser.token, activeUser.activeListId, task.id, unwrap(task));
    }
  }
  
  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (taskItem && !taskItem.contains(event.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  });
  
  return (
    <Show when={props.task} fallback={<>not loaded yet</>}>
      <div 
        ref={taskItem} 
        class={`container mx-auto grid grid-cols-5 gap-1 ${focused() ? 'border border-2 border-blue-600 shadow animate-pulse-border rounded bg-slate-100': ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setFocused(true)}
      >
        <div class="col-span-1">
          <TaskCheckbox task={props.task} />
        </div>
        <div class="col-span-3 mt-1">
          <textarea
            ref={titleTextarea}
            name="title"
            class={`w-full text-sm ${!focused() ? "text-ellipsis overflow-hidden max-h-5 hover:max-h-full transition-max-height duration-300" : ""}`}
            spellcheck
            placeholder={props.task.title}
            value={props.task.title}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
          <Show when={props.task.notes}>
            <textarea
              ref={notesTextarea}
              name="title"
              class={`w-full text-xs ${!focused() ? "text-ellipsis overflow-hidden max-h-5 hover:max-h-full transition-max-height duration-300" : ""}`}
              spellcheck
              placeholder={props.task.notes}
              value={props.task.notes}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            />
          </Show>
        </div>
        <div class="col-span-1 flex flex-row-reverse">
          <Show when={hovered()}>
            <TaskMenu task={props.task} lists={props.lists} />
          </Show>
        </div>
        <Show when={props.task.due}>
          <div class="col-span-1" />
          <div class="col-span-3">
            <DateChip task={props.task} />
          </div>
        </Show>
      </div>
    </Show>
  );
}

export default TaskItem;