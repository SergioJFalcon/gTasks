import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import Chip from "@suid/material/Chip";
import ListItem from "@suid/material/ListItem";
import ListItemText from "@suid/material/ListItemText";
import ListItemButton from "@suid/material/ListItemButton";
import ViewTask from "./viewTask";
import EditableTask from "./EditableTask";



const TaskItem = (props: any) => {
  const [hovered, setHovered] = createSignal(false);
  const [focused, setFocused] = createSignal(false);
  let taskItem: HTMLDivElement;

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (taskItem && !taskItem.contains(event.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    onCleanup(() => {
      document.removeEventListener('mousedown', handleClickOutside);
    });
    console.log('focused: ', focused());
  });
  
  return (
    <Show when={props.task} fallback={<>not loaded yet</>}>
      <div 
        ref={taskItem} 
        class={`container mx-auto grid grid-cols-5 gap-1 ${focused() ? 'border border-2 border-blue-600 shadow animate-pulse-border rounded bg-slate-100 my-2': ''}`}
        onMouseEnter={() => setHovered(true)} 
        onMouseLeave={() => setHovered(false)} 
        onClick={() => setFocused(true)}
      >
        <Show when={!focused()} fallback={
          <EditableTask token={props.token} activeListId={props.activeListId} task={props.task} lists={props.lists} />
        }>
          <ViewTask token={props.token} activeListId={props.activeListId} task={props.task} hovered={hovered()} lists={props.lists} />
        </Show>
      </div>
    </Show>
  );
}

export default TaskItem;