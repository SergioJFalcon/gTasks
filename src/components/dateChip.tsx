import { Chip } from "@suid/material";
import { createSignal, onMount } from "solid-js";

const DateChip = (props: any) => {
  const [hovered, setHovered] = createSignal(false);
  const [displayDate, setDisplayDate] = createSignal('');

  const today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  // TODO - Be able to set the date from the chip
  onMount(() => {
    console.log('DateChip mounted');
    console.log('task: ', props.task);
    
    const localDateString = props.task.due.slice(0, -1);
    const dueDateMillieSecondsSinceEpoch = Date.parse(localDateString);
    const dueDate = new Date(dueDateMillieSecondsSinceEpoch);

    if (dueDate.toLocaleDateString() === today.toLocaleDateString()) {
      setDisplayDate('Today');
    } else if (dueDate.toLocaleDateString() === tomorrow.toLocaleDateString()) {
      setDisplayDate('Tomorrow');
    } else if (dueDate.toLocaleDateString() < today.toLocaleDateString()) {
      setDisplayDate(`Overdue: ${dueDate.toLocaleDateString()}`);
    } else {
      setDisplayDate(dueDate.toLocaleDateString());
    }
  });

  return (
    <div class="text-xs mb-2">
      {/* TODO: Change the color and decoration depending on due status [pastDue, today, tomorrow, rest] */}
      <button  class="rounded-full outline outline-offset-2 outline-2 outline-blue-500 px-2">{displayDate()}</button>
    </div>
  );
}

export default DateChip;