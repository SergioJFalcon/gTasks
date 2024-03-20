import { Show, onMount } from "solid-js";

import DateChip from "./dateChip";
import TaskCheckbox from "./taskCheckbox";
import TaskMenu from "./taskMenu";

const ViewTask = (props: any) => {
  console.log('\tprops.hovered: ', props.hovered);
  onMount(() => {
    console.log('ViewTask mounted');
    console.log('props.task: ', props.task);
    console.log('props.hovered: ', props.hovered);
  });
  return (
    <>
      <div class="col-span-1">
        <TaskCheckbox task={props.task} />
      </div>
      <div class="col-span-3">
        <div class="text-sm text-ellipsis overflow-hidden max-h-5 hover:max-h-full transition-max-height duration-300">
          {props.task.title}
        </div>
        <Show when={props.task.notes}>
          <div class="text-xs text-ellipsis overflow-hidden max-h-5 hover:max-h-full transition-max-height duration-300">
            {props.task.notes}
          </div>
        </Show>
      </div>
      <div class="col-span-1 flex flex-row-reverse">
        <Show when={props.hovered}>
          <TaskMenu task={props.task} lists={props.lists} />
        </Show>
      </div>
      <Show when={props.task.due}>
        <div class="col-span-1" />
        <div class="col-span-3">
          <DateChip task={props.task} />
        </div>
      </Show>
    </>
  )
}

export default ViewTask;