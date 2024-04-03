import logo from "@assets/img/logo.svg";

console.log("background loaded");
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
let user_signed_in = false;

// On Install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("====================onInstalled=====================");
  // Set default option preferences
  chrome.storage.sync.set({
    content: false,
    devtools: true,
    popup: true,
    newtab: false,
    panel: true,
  });

  // Check if user is signed in
  await getChromeAuthToken().then(async (token: any) => {
    if (token) {
      console.log('User is signed in - token: ', token);
      // Check if activeListId and activeListTitle are already set, if not assign to first list
      await getChromeStorageItem('activeListId').then(async (res: any) => {
        if (res.activeListId) {
          console.log('activeListId already set - res: ', res);
          // Get active Task List
        } else {
          console.log('activeListId not set - res: ', res);

          await getTaskLists(token).then((taskLists: any) => {
            console.log('taskLists: ', taskLists);
            if (taskLists.items.length > 0) {
              let firstList = taskLists.items[0];
              console.log('firstList: ', firstList);
              // Set initial values for gTasks - activeListId, activeListTitle
              setChromeStorageItem('activeListId', firstList.id);
              setChromeStorageItem('activeListTitle', firstList.title);
            }
          });
        }
      });
    }
  });
  console.log("=====================onInstalled done=====================");
});

/* CHROME IDENTITY */
export const getChromeAuthToken = () => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (token) {
        resolve(token);
      } else {
        console.log('No token');
        reject('No token');
      }
    });
  });
};

/* CHROME STORAGE */
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

/* TASKLISTS */
export const getTaskLists = async (token?: string) => {
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
      return res;
    });
  console.log("\t\t\t\tgetTaskLists tasksList: ", tasksList);
  return tasksList;
};

export const createTaskList = (token: string, title: string) => {
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

export const updateTaskList = (token: string, listId: string, title: string) => {
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

export const deleteTaskList = (token: string, listId: string) => {
  return new Promise((resolve, reject) => {
    let fetch_delete_list_url = `https://tasks.googleapis.com/tasks/v1/users/@me/lists/${listId}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_delete_list_options = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    fetch(fetch_delete_list_url, fetch_delete_list_options)
      .then(res => res.json())
      .then(res => {
        console.log("delete list res: ", res);
        resolve(res);
      });
  });
}

/* TASKS */
export const getTasks = async (token: string, listId: string) => {
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

export const getActiveTasks = async (token: string) => {
  const listId = await getChromeStorageItem('activeListId').then( async (res: any) => {
    return res;
  });
  console.log('getActiveTasks listId: ', listId.activeListId);

  let fetch_tasks_url = `https://tasks.googleapis.com/tasks/v1/lists/${listId.activeListId}/tasks?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
  let fetch_tasks_options = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const tasks = await fetch(fetch_tasks_url, fetch_tasks_options)
    .then(res => res.json())
    .then(res => {
      return res;
    });

  return tasks;
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
        "notes": task.notes,
        "status": task.status,
        "due": task.due,
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

export const createTask = (token: string, listId: string, task: any) => {
  console.log('createTask: ', token, listId, task);
  return new Promise((resolve, reject) => {
    let fetch_create_task_url = `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_create_task_options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": task.title,
        "notes": task.notes
      })
    }
    
    fetch(fetch_create_task_url, fetch_create_task_options)
      .then(res => res.json())
      .then(res => {
        console.log("create task res: ", res);
        resolve(res);
      });
  });

}

export const clearTasks = (token: string, listId: string) => {
  console.log('clearTasks: ', token, listId);
  return new Promise((resolve, reject) => {
    let fetch_clear_tasks_url = `https://tasks.googleapis.com/tasks/v1/lists/${listId}/clear?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_clear_tasks_options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    
    fetch(fetch_clear_tasks_url, fetch_clear_tasks_options)
      .then(res => res.json())
      .then(res => {
        console.log("clear tasks res: ", res);
        resolve(res);
      });
  });
}

export const moveTask = (token: string, listId: string, taskId: string, newParent: string) => {
  console.log('moveTask: ', token, listId, taskId, newParent);
  return new Promise((resolve, reject) => {
    let fetch_move_task_url = `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}/move?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_move_task_options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "parent": newParent
      })
    }
    
    fetch(fetch_move_task_url, fetch_move_task_options)
      .then(res => res.json())
      .then(res => {
        console.log("move task res: ", res);
        resolve(res);
      });
  });

}

export const deleteTask = (token: string, listId: string, taskId: string) => {
  console.log('deleteTask: ', token, listId, taskId);
  return new Promise((resolve, reject) => {
    let fetch_delete_task_url = `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_delete_task_options = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    
    fetch(fetch_delete_task_url, fetch_delete_task_options)
      .then(res => {
        console.log("delete task res: ", res);
        resolve(res);
      });
  });
}

// TODO- Create subtask
export const createSubTask = (token: string, listId: string, taskId: string, task: any) => {
  console.log('createSubTask: ', token, listId, taskId, task);
  return new Promise((resolve, reject) => {
    let fetch_create_subtask_url = `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}/subtasks?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    let fetch_create_subtask_options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": task.title,
        "notes": task.notes
      })
    }
    
    fetch(fetch_create_subtask_url, fetch_create_subtask_options)
      .then(res => res.json())
      .then(res => {
        console.log("create subtask res: ", res);
        resolve(res);
      });
  });

}

export const sendNotification = (title: string, message: string) => {
  const imageUrl = chrome.runtime.getURL(logo);
  chrome.notifications.create({
    type: 'basic',
    iconUrl: logo,
    title: title,
    message: message,
    buttons: [{ title: 'Keep it Flowing.' }],
    priority: 50
  });
}

// Chrome RunTIme Server
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("initial request: ", request);
    console.log("initial sender: ", sender);
    console.log("initial sendResponse: ", sendResponse);

    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
      switch(request.action) {
        case 'get_auth_token':
          console.log("token: ", token);
          sendResponse({ token: token });
          break;
        case 'example':
          console.log("example");
          sendResponse({ result: "response from background.js" });
          break;
        case 'get_task_lists':
          const lists = await getTaskLists(token);
          sendResponse(lists);
          break;
        case 'create_task_list':
          const createdList = await createTaskList(token, request.title);
          sendResponse(createdList);
          break;
        case 'update_task_list':
          const updatedList = await updateTaskList(token, request.listId, request.title);
          sendResponse(updatedList);
          break;
        case 'delete_task_list':
          const deletedList = await deleteTaskList(token, request.listId);
          sendResponse(deletedList);
          break;
        case 'get_tasks':
          const tasks = await getTasks(token, request.listId);
          sendResponse(tasks);
          break;
        case 'get_active_tasks':
          const activeTasks = await getActiveTasks(token);
          sendResponse(activeTasks);
          break;
        case 'create_task':
          const createdTask = await createTask(token, request.listId, request.task);
          sendResponse(createdTask);
          break;
        case 'update_task':
          const updatedTask = await updateTask(token, request.listId, request.taskId, request.task);
          sendResponse(updatedTask);
          break;
        case 'clear_tasks':
          const clearedTasks = await clearTasks(token, request.listId);
          sendResponse(clearedTasks);
          break;
        case 'move_task':
          const movedTask = await moveTask(token, request.listId, request.taskId, request.newParent);
          sendResponse(movedTask);
          break;
        case 'delete_task':
          const deletedTask = await deleteTask(token, request.listId, request.taskId);
          sendResponse(deletedTask);
          break;
        case 'create_subtask':
          const createdSubtask = await createSubTask(token, request.listId, request.taskId, request.task);
          sendResponse(createdSubtask);
          break;
        // case 'clear_subtasks':
        //   const clearedSubtasks = await clearSubtasks(token, request.listId, request.taskId);
        //   sendResponse(clearedSubtasks);
        //   break;
        case 'send_notification':
          sendNotification(request.title, request.message);
          break;
        default:
          console.log("Hit default");
        }

        return true;
    });
    console.log("sendResponse: ", sendResponse);
    console.log("end of onMessage");
    return true;
});


chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '128.png',
    title: 'Time to Hydrate',
    message: "Everyday I'm Guzzlin'!",
    buttons: [{ title: 'Keep it Flowing.' }],
    priority: 0
  });
});

chrome.notifications.onButtonClicked.addListener(async () => {
  const item = await chrome.storage.sync.get(['minutes']);
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.alarms.create({ delayInMinutes: item.minutes });
});



console.log("background loaded 2");