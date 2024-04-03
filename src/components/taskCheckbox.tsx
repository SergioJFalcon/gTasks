import { Show, createSignal } from "solid-js";

import Checkbox from "@suid/material/Checkbox";
import RadioButtonUnchecked from '@suid/icons-material/RadioButtonUnchecked';

import CheckCircle from "@suid/icons-material/CheckCircle";
import CheckCircleOutline from "@suid/icons-material/CheckCircleOutline";

const TaskCheckbox = (props: any) => {
  const [checkboxHovered, setCheckboxHovered] = createSignal(false);
  // TODO: Add a function to update the task's completed status
  
  return (
    <div onMouseEnter={() => setCheckboxHovered(true)} onMouseLeave={() => setCheckboxHovered(false)}>
      <Show when={checkboxHovered()} fallback={
          <Checkbox
            checked={false}
            icon={<RadioButtonUnchecked />}
            checkedIcon={<CheckCircle />}
            onChange={(event, checked) => {
              console.log('checked: ', event, checked);
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        }>
        <Checkbox
          checked={false}
          icon={<CheckCircleOutline />}
          checkedIcon={<CheckCircle />}
          onChange={(event, checked) => {
            console.log('checked: ', event, checked);
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Show>
    </div>
  )
}

export default TaskCheckbox;