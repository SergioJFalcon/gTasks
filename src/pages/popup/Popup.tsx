import { For, Show, createSignal, onMount } from "solid-js";
import logo from "@assets/img/logo.svg";
import "@src/styles/index.css";
import styles from "./Popup.module.css";


import { Collapse } from 'solid-collapse';

import TaskItem from "@src/components/taskItem";

import Button from "@suid/material/Button";
import ListItemIcon from "@suid/material/ListItemIcon";
import ListItemText from "@suid/material/ListItemText";
import Divider from "@suid/material/Divider";
import List from "@suid/material/List";
import ListItem from "@suid/material/ListItem";
import ListItemButton from "@suid/material/ListItemButton";
import Skeleton from "@suid/material/Skeleton";

import CircularProgress from "@suid/material/CircularProgress";
import Inbox from "@suid/icons-material/Inbox";
import Modal from "@suid/material/Modal";
import Box from "@suid/material/Box";
import Typography from "@suid/material/Typography";
import TextField from "@suid/material/TextField";
import Container from "@suid/material/Container";
import MenuButton from "@src/components/menuButton";
import Paper from "@suid/material/Paper";

export const getTaskLists = async (token?: string) => {
  console.log("getTaskLists");
  let fetch_task_lists_url = `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
  console.log("fetch_task_lists_url: ", fetch_task_lists_url);
  let fetch_task_lists_options = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const tasksList = await fetch(fetch_task_lists_url, fetch_task_lists_options)
    .then(res => res.json())
    .then(res => {
      console.log("g lists res: ", res);
      return res;
    });

  return tasksList;
};

export const getTasks = async (token, listId) => {
  let fetch_tasks_url = `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
  let fetch_tasks_options = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const tasks = await fetch(fetch_tasks_url, fetch_tasks_options)
    .then(res => res.json())
    .then(res => {
      console.log("g tasks res: ", res);
      return res;
    });

  return tasks;
};

export const signIn = () => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      if (token) {
        console.log('token: ', token);
        resolve(token);
      } else {
        console.log('no token');
        reject('No token');
      }
    });
  });
}

export const getChromeStorageItem = (item: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([item], function(result) {
      console.log(`Storage item (${item}) result: `, result);
      if (result) {
        resolve(result);
      } else {
        reject('No result');
      }
    });
  });
};

export const setChromeStorageItem = (item: string, value: any) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({[item]: value}, function() {
      console.log(`Storage Value (${item}) is set to `, value);
      resolve(value);
    });
  });
};

export const completedTask = (task) => {
  console.log('completedTask: ', task);
}

export const createNewList = (token: string, title: string) => {
  return new Promise((resolve, reject) => {
    let fetch_create_list_url = `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_create_list_options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": title
      })
    }
    fetch(fetch_create_list_url, fetch_create_list_options)
      .then(res => res.json())
      .then(res => {
        console.log("create list res: ", res);
        resolve(res);
      });
  });

}

export const updateList = (token: string, listId: string, title: string) => {
  return new Promise((resolve, reject) => {
    let fetch_update_list_url = `https://tasks.googleapis.com/tasks/v1/users/@me/lists/${listId}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_update_list_options = {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": title
      })
    }
    fetch(fetch_update_list_url, fetch_update_list_options)
      .then(res => res.json())
      .then(res => {
        console.log("update list res: ", res);
        resolve(res);
      });
  });
}

export const updateTask = (token: string, listId: string, taskId: string, task: any) => {
  console.log('updateTask: ', token, listId, taskId, task);
  return new Promise((resolve, reject) => {
    let fetch_update_task_url = `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_update_task_options = {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": task.title,
        "notes": task.notes
      })
    }
    
    fetch(fetch_update_task_url, fetch_update_task_options)
      .then(res => res.json())
      .then(res => {
        console.log("update task res: ", res);
        resolve(res);
      });
  });
}

const Popup = () => {
  const [loading, setLoading] = createSignal(false);
  const [createListModal, setCreateListModal] = createSignal(false);
  const [isExpanded, setIsExpanded] = createSignal(false);
  
  const [signedInToken, setSignedInToken] = createSignal('');
  
  const [activeListId, setActiveListId] = createSignal('');
  const [activeListName, setActiveListName] = createSignal('');
  const [newListName, setNewListName] = createSignal('');
  const [lists, setLists] = createSignal([]);

  const [pastDueTasks, setPastDueTasks] = createSignal([]);
  const [tasksToday, setTasksToday] = createSignal([]);
  const [tasksTomorrow, setTasksTomorrow] = createSignal([]);
  const [restOfTasks, setRestOfTasks] = createSignal([]);


  const changeList = async (list) => {
    // Change active list and get tasks
    console.log('changeList: ', list);
    // Update active list in state and chrome local storage
    setActiveListId(list.id);
    setActiveListName(list.title);
    setChromeStorageItem('activeListId', list.id);
    setChromeStorageItem('activeListName', list.title);

    setLoading(false);
    // set all tasks to empty
    setPastDueTasks([]);
    setTasksToday([]);
    setTasksTomorrow([]);
    setRestOfTasks([]);

    // Get tasks from the new active list
    await getTasks(signedInToken(), list.id).then((res: any) => {
      console.log('task res: ', res);
      if(res.items.length === 0) {
        console.log('No tasks found');
      }
      filterTasksByDates(res.items);
      setChromeStorageItem('activeTasks', res.items);
    });

    // finish loading
    setLoading(true);
  }

  const openCreateListModal = () => {
    // Create and switch to new list
    console.log('createList');
  }

  const refresh = () => {
    console.log('refresh');
  }

  const filterTasksByDates = (tasks: []) => {
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let noDateTasks = [];

    if(tasks.length > 0) {
      tasks.forEach((task: any) => {
        if(task.due) {
          // Remove the trailing 'Z' from the string
          const localDateString = task.due.slice(0, -1);
          let dueDateMillieSecondsSinceEpoch = Date.parse(localDateString);
          const dueDate = new Date(dueDateMillieSecondsSinceEpoch);

          if(dueDate.toLocaleDateString() < today.toLocaleDateString()) {
            setPastDueTasks([...pastDueTasks(), task]);
          } else if(dueDate.toLocaleDateString() === today.toLocaleDateString()) {
            setTasksToday([...tasksToday(), task]);
          } else if(dueDate.toLocaleDateString() === tomorrow.toLocaleDateString()) {
            setTasksTomorrow([...tasksTomorrow(), task]);
          } else {
            setRestOfTasks([...restOfTasks(), task]);
          }
        } else {
          noDateTasks.push(task);
        }
      });
    }

    if(restOfTasks().length > 0) {
      // Sort rest of tasks by due date
      restOfTasks().sort((a, b) => {
        if(a.due && b.due) {
          return a.due.localeCompare(b.due);
        }
      });
    }

    setRestOfTasks([...restOfTasks(), ...noDateTasks]);
  }
  
  onMount(async () => {
    console.log('~popup onMount!~');
    try {
      await signIn().then((res: any) => {
        setSignedInToken(res);
      });

      await getTaskLists(signedInToken()).then((res) => {
        if(res.items.length === 0) {
          console.log('No lists found');
        } else {
          setChromeStorageItem('activeListId', res.items[0].id);
          setChromeStorageItem('activeListName', res.items[0].title);
          setLists(res.items);
        }
      });

      // Get active task from chrome storage
      await getChromeStorageItem('activeListId').then(async (res: any) => {
        if (res.activeListId === undefined) {
          console.log('No active list found');
          // Getting lists and assigning first list as active
          setActiveListId(lists()[0].id);
        } else {
          setActiveListId(res.activeListId);
        }
      });

      await getChromeStorageItem('activeListName').then((res: any) => {
        if (res.activeListName === undefined) {
          console.log('No active list name found');
          setActiveListName(lists()[0].title);
        } else {
          setActiveListName(res.activeListName);
        }
      });

      if(activeListId()) {
        await getTasks(signedInToken(), activeListId()).then((res: any) => {
          console.log('task res: ', res);
          if(res.items.length === 0) {
            console.log('No tasks found');
          }
          // Filter tasks for today, tomorrow, and rest
          filterTasksByDates(res.items);
          setChromeStorageItem('activeTasks', res.items);
        });
      }

      // Get tasks from active list

      // TODO - Get tasks from chrome storage
      // await getChromeStorageItem('activeTasks').then((res: any) => {
      //   console.log('activeTasks res: ', res);
      //   if (res.activeTasks === undefined) {
      //     console.log('No active tasks found');
      //   } else {
      //     console.log('activeTasks: ', res.activeTasks);
      //   }
      // });

      console.log('activeListId: ', activeListId());
      console.log('lists: ', lists());
      console.log('tasksToday: ', tasksToday());
      console.log('tasksTomorrow: ', tasksTomorrow());
      console.log('restOfTasks: ', restOfTasks());
      console.log('=============END OF ONMOUNT!=============');
      setLoading(true);
    } catch (error) {
      console.error('error: ', error);
    }
  });

  return (
    <div class="container overflow-hidden h-full w-full min-h-full min-w-full">
      <Show 
        when={loading()} 
        fallback={
          <div class="h-screen flex items-center justify-center">
            <CircularProgress class="" />
          </div>
        }
      >
        <div class="overflow-hidden h-full w-full min-h-full min-w-full">
          <div class="overflow-hidden h-full w-full py-4 px-4">
            {/* <h1 class="text-xl">TASKS</h1> */}
            <Paper elevation={5} class="h-full w-full overflow-hidden">
              <Show when={activeListName() && activeListId() && lists()}>
                <MenuButton token={signedInToken()} activeListName={activeListName()} activeListId={activeListId()} lists={lists()} changeList={changeList} />
              </Show>
              <Show when={restOfTasks()} fallback={
                <CircularProgress />
              }>
                <div id="list-content" class="overflow-y-auto h-full">
                  <Collapse value={!isExpanded()} class="my-transition">
                    <List>
                    <Show when={pastDueTasks().length > 0}>
                        <h2 class="text-base text-red-900 px-2">Past Due</h2>
                        <For each={pastDueTasks()}>
                          {(task) => <TaskItem token={signedInToken()} activeListId={activeListId()} task={task} lists={lists()} />}
                        </For>
                        <Divider class="py-2" />
                      </Show>
                      <Show when={tasksToday().length > 0}>
                        <h2 class="text-base px-2">Today</h2>
                        <For each={tasksToday()}>
                          {(task) => <TaskItem token={signedInToken()} activeListId={activeListId()} task={task} lists={lists()} />}
                        </For>
                        <Divider class="py-2" />
                      </Show>
                      <Show when={tasksTomorrow().length > 0}>
                        <h2 class="text-base px-2">Tomorrow</h2>
                        <For each={tasksTomorrow()}>
                          {(task) => <TaskItem token={signedInToken()} activeListId={activeListId()} task={task} lists={lists()} />}
                        </For>
                        <Divider  class="py-2"/>
                      </Show>
                      <Show when={restOfTasks().length > 0}>
                        <For each={restOfTasks()}>
                          {(task) => <TaskItem token={signedInToken()} activeListId={activeListId()} task={task} lists={lists()} />}
                        </For>
                        <Divider class="py-2" />
                      </Show>
                    </List>
                  </Collapse>
                  <Button onClick={() => setIsExpanded(!isExpanded())}>Expand me</Button>
                  <Collapse value={isExpanded()} class="my-transition">
                    <p class="my-content-class">
                      I am a bunch of collapsed text that wants to be expanded
                    </p>
                  </Collapse>
                </div>
              </Show>
            </Paper>
          </div>
        </div>
      </Show>

      <Modal
        open={createListModal()}
        onClose={() => setCreateListModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            width: 400,
            border: "2px solid #000",
            boxShadow: "24px",
            p: 4,
          }}
          >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create new list
          </Typography>
          <TextField
            id="create-new-list" 
            variant="standard" 
            value={newListName()} 
            onChange={(event, value) => {
              setNewListName(value);
            }}
            />
          <Button onClick={_ => setCreateListModal(false)}>Cancel</Button>
          <Button onClick={_ => {
            createNewList(signedInToken(), newListName())
            setCreateListModal(false)
            refresh()
          }}>
            Create
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Popup;
