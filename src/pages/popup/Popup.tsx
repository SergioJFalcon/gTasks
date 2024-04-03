import { For, Show, createSignal, onMount } from "solid-js";
import logo from "@assets/img/logo.svg";
import "@src/styles/index.css";
import styles from "./Popup.module.css";

import { Collapse } from "solid-collapse";

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
import { UseAuthDispatch, UseAuthState } from "@src/context/auth";
import {
  createTaskList,
  getChromeStorageItem,
  getTaskLists,
  getTasks,
  sendNotification,
  setChromeStorageItem,
} from "../background";

const Popup = () => {
  const [loading, setLoading] = createSignal(false);
  const [createListModal, setCreateListModal] = createSignal(false);
  const [isExpanded, setIsExpanded] = createSignal(false);

  const [newListName, setNewListName] = createSignal("");
  const [lists, setLists] = createSignal([]);

  const [pastDueTasks, setPastDueTasks] = createSignal([]);
  const [tasksToday, setTasksToday] = createSignal([]);
  const [tasksTomorrow, setTasksTomorrow] = createSignal([]);
  const [restOfTasks, setRestOfTasks] = createSignal([]);

  const activeUser = UseAuthState();
  const authDispatch = UseAuthDispatch();
  console.log("activeUser: ", activeUser);

  const changeList = async (list) => {
    // Change active list and get tasks
    console.log("changeList: ", list);
    // Update active list in state and chrome local storage
    // setActiveListId(list.id);
    authDispatch.setListId(list.id);
    // setActiveListName(list.title);
    authDispatch.setListTitle(list.title);
    setChromeStorageItem("activeListId", list.id);
    setChromeStorageItem("activeListName", list.title);

    setLoading(false);
    // set all tasks to empty
    setPastDueTasks([]);
    setTasksToday([]);
    setTasksTomorrow([]);
    setRestOfTasks([]);

    // Get tasks from the new active list
    await getTasks(activeUser.token, list.id).then((res: any) => {
      console.log("task res: ", res);
      if (res.items.length === 0) {
        console.log("No tasks found");
      }
      filterTasksByDates(res.items);
      setChromeStorageItem("activeTasks", res.items);
    });

    // finish loading
    setLoading(true);
  };

  const openCreateListModal = () => {
    // Create and switch to new list
    console.log("createList");
  };

  const refresh = () => {
    console.log("refresh");
  };

  const filterTasksByDates = (tasks: []) => {
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let noDateTasks = [];

    if (tasks.length > 0) {
      tasks.forEach((task: any) => {
        if (task.due) {
          // Remove the trailing 'Z' from the string
          const localDateString = task.due.slice(0, -1);
          let dueDateMillieSecondsSinceEpoch = Date.parse(localDateString);
          const dueDate = new Date(dueDateMillieSecondsSinceEpoch);

          if (dueDate.toLocaleDateString() < today.toLocaleDateString()) {
            setPastDueTasks([...pastDueTasks(), task]);
          } else if (
            dueDate.toLocaleDateString() === today.toLocaleDateString()
          ) {
            setTasksToday([...tasksToday(), task]);
          } else if (
            dueDate.toLocaleDateString() === tomorrow.toLocaleDateString()
          ) {
            setTasksTomorrow([...tasksTomorrow(), task]);
          } else {
            setRestOfTasks([...restOfTasks(), task]);
          }
        } else {
          noDateTasks.push(task);
        }
      });
    }

    if (restOfTasks().length > 0) {
      // Sort rest of tasks by due date
      restOfTasks().sort((a, b) => {
        if (a.due && b.due) {
          return a.due.localeCompare(b.due);
        }
      });
    }

    setRestOfTasks([...restOfTasks(), ...noDateTasks]);
  };

  onMount(async () => {
    console.log("~popup onMount!~");
    try {
      console.log("onMount activeUser: ", activeUser);
      const response = chrome.runtime.sendMessage(
        { action: "get_task_lists" },
        (response) => {
          console.log("******getTaskLists: ", response);
          setLists(response.items);
        }
      );
      console.log("response: ", response);

      const activeTasksExample = chrome.runtime.sendMessage(
        { action: "get_active_tasks" },
        (response) => {
          console.log("$$$$$$$$$$$$$$$$$$$$activeTasksExample: ", response);
        }
      );

      console.log("activeTasksExample: ", activeTasksExample);

      // Get active task from chrome storage
      await getChromeStorageItem("activeListId").then(async (res: any) => {
        if (res.activeListId === undefined) {
          console.log("No active list found");
          // Getting lists and assigning first list as active
          authDispatch.setListId(lists()[0].id);
        } else {
          authDispatch.setListId(res.activeListId);
        }
      });

      await getChromeStorageItem("activeListName").then(async (res: any) => {
        if (res.activeListName === undefined) {
          console.log("No active list name found");
          // setActiveListName(lists()[0].title);
          authDispatch.setListTitle(lists()[0].title);
        } else {
          // setActiveListName(res.activeListName);
          authDispatch.setListTitle(res.activeListName);
        }
      });

      if (activeUser.activeListId) {
        await getTasks(activeUser.token, activeUser.activeListId).then(
          (res: any) => {
            console.log("task res: ", res);
            if (res.items.length === 0) {
              console.log("No tasks found");
            }
            // Filter tasks for today, tomorrow, and rest
            filterTasksByDates(res.items);
            setChromeStorageItem("activeTasks", res.items);
          }
        );
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

      // console.log('activeListId: ', activeListId());
      // console.log('lists: ', lists());
      // console.log('tasksToday: ', tasksToday());
      // console.log('tasksTomorrow: ', tasksTomorrow());
      // console.log('restOfTasks: ', restOfTasks());
      console.log("END OF ONMOUNT!~ activeUser: ", activeUser);
      console.log("=============END OF ONMOUNT!=============");
      setLoading(true);
    } catch (error) {
      console.error("error: ", error);
    }
  });

  const exampleMsg = async () => {
    console.log(
      "****************************************************************************"
    );
    const result = await chrome.runtime.sendMessage(
      { action: "example", data: { hi: 1 } },
      (response) => {
        console.log(
          "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
        );
        console.log("exampleMsg response: ", response);
      }
    );
    console.log(
      "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    );
    console.log("exampleMsg response: ", result);
  };

  const exampleGetLists = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    console.log("TABBB: ", tab);
    const response = chrome.runtime.sendMessage(
      { action: "get_task_lists" },
      (response) => {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log("11111exampleGetLists: ", response);
      }
    );
  };

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
              <Show
                when={
                  activeUser.isAuthenticated &&
                  activeUser.activeListId &&
                  activeUser.activeListTitle &&
                  lists()
                }
              >
                <MenuButton lists={lists()} changeList={changeList} />
                <Button
                  variant="contained"
                  onClick={() =>
                    sendNotification("Creating a new task", "wow new task@!")
                  }
                >
                  Add a task
                </Button>
                <Button variant="contained" onClick={() => exampleMsg()}>
                  Sned msg to background
                </Button>
                <Button variant="contained" onClick={exampleGetLists}>
                  Get task lists
                </Button>
              </Show>
              <Show when={restOfTasks()} fallback={<CircularProgress />}>
                <div id="list-content" class="overflow-y-auto h-full">
                  <Collapse value={!isExpanded()} class="my-transition">
                    <List>
                      <Show when={pastDueTasks().length > 0}>
                        <h2 class="w-fit text-base text-red-900 px-2">
                          Past Due
                        </h2>
                        <For each={pastDueTasks()}>
                          {(task) => <TaskItem task={task} lists={lists()} />}
                        </For>
                        <Divider class="py-2" />
                      </Show>
                      <Show when={tasksToday().length > 0}>
                        <h2 class="text-base px-2">Today</h2>
                        <For each={tasksToday()}>
                          {(task) => <TaskItem task={task} lists={lists()} />}
                        </For>
                        <Divider class="py-2" />
                      </Show>
                      <Show when={tasksTomorrow().length > 0}>
                        <h2 class="text-base px-2">Tomorrow</h2>
                        <For each={tasksTomorrow()}>
                          {(task) => <TaskItem task={task} lists={lists()} />}
                        </For>
                        <Divider class="py-2" />
                      </Show>
                      <Show when={restOfTasks().length > 0}>
                        <For each={restOfTasks()}>
                          {(task) => <TaskItem task={task} lists={lists()} />}
                        </For>
                        <Divider class="py-2" />
                      </Show>
                    </List>
                  </Collapse>
                  <Button onClick={() => setIsExpanded(!isExpanded())}>
                    Expand me
                  </Button>
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
          <Button onClick={(_) => setCreateListModal(false)}>Cancel</Button>
          <Button
            onClick={(_) => {
              createTaskList(activeUser.token, newListName());
              setCreateListModal(false);
              refresh();
            }}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Popup;
