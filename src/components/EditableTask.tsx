import { Show, onMount } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

import TaskCheckbox from "./taskCheckbox";
import DateChip from "./dateChip";
import TextField from "@suid/material/TextField";
import TaskMenu from "./taskMenu";
import { updateTask } from "@src/pages/popup/Popup";

const EditableTask = (props: any) => {
  const [task, setTask] = createStore(props.task);
  let titleTextarea: HTMLTextAreaElement;
  let notesTextarea: HTMLTextAreaElement;

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
      updateTask(props.token, props.activeListId, task.id, unwrap(task));
    }
  }

  onMount(() => {
    autoResize(titleTextarea);
    autoResize(notesTextarea);
  });

  return (
    <>
      <div class="col-span-1">
        <TaskCheckbox task={props.task} />
      </div>
      <div class="col-span-3 mt-1">
        <textarea
          ref={titleTextarea}
          name="title"
          class="w-full"
          autofocus 
          spellcheck
          placeholder={props.task.title}
          value={props.task.title}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
        <textarea 
          ref={notesTextarea}
          name="notes"
          class="w-full"
          spellcheck
          placeholder={props.task.notes ? props.task.notes : 'Notes'}
          value={props.task.notes ? props.task.notes : ""}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div class="col-span-1 flex flex-row-reverse">
        <TaskMenu task={props.task} lists={props.lists} />
      </div>
      <Show when={props.task.due}>
        <div class="col-span-1" />
        <div class="col-span-3">
          <DateChip task={props.task} />
        </div>
      </Show>
    </>
  )
};

export default EditableTask;