import { Chip } from "@suid/material";
import { createSignal, onMount } from "solid-js";

const DateChip = (props: any) => {
  const [hovered, setHovered] = createSignal(false);
  const [displayDate, setDisplayDate] = createSignal('');
  const [dueStatus, setDueStatus] = createSignal(''); // [pastDue, today, tomorrow, rest]

  const today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const getOverDue = (dueDate: Date) => {
    // Get the number of days between today and the due date
    let result = '';
    const days = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    if (days > 365) {
      result = `${Math.floor(days / 365)} years`;
    } else if (days > 31) {
      result = `${Math.floor(days / 31)} months`;
    } else {
      result = `${days} days`;
    }
    return result;
  }

  // TODO - Be able to set the date from the chip
  onMount(() => {
    console.log('DateChip mounted');
    console.log('task: ', props.task);
    console.log('today: ', today);
    
    const localDateString = props.task.due.slice(0, -1);
    const dueDateMillieSecondsSinceEpoch = Date.parse(localDateString);
    const dueDate = new Date(dueDateMillieSecondsSinceEpoch);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }
    if(dueDate.getFullYear() !== today.getFullYear()) {
      options.year = 'numeric';
    }

    if (dueDate.toLocaleDateString() === today.toLocaleDateString()) {
      setDisplayDate('Today');
      setDueStatus('outline-blue-500');
    } else if (dueDate.toLocaleDateString() === tomorrow.toLocaleDateString()) {
      setDisplayDate('Tomorrow');
      setDueStatus('outline-blue-700');
    } else if (dueDate.toLocaleDateString() < today.toLocaleDateString()) {
      console.log('\tdueDate: ', dueDate.toLocaleDateString());
      console.log('\ttoday: ', today.toLocaleDateString());
      console.log('\toverdue: ', getOverDue(dueDate));
      setDisplayDate(getOverDue(dueDate));
      setDueStatus('outline-red-500');
    } else {
      setDisplayDate(`${dueDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`);
      setDueStatus('outline-blue-900');
    }
  });

  return (
    <div class="text-xs mb-2">
      {/* TODO: Change the color and decoration depending on due status [pastDue, today, tomorrow, rest] */}
      <button  class={`rounded-full outline outline-offset-2 outline-2 ${dueStatus()} px-2`}>{displayDate()}</button>
    </div>
  );
}

export default DateChip;