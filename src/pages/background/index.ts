console.log("background loaded");

// On Install
chrome.runtime.onInstalled.addListener(function () {
  // Set default preferences
  chrome.storage.sync.set({
    content: false,
    devtools: true,
    popup: true,
    newtab: false,
    panel: true,
  });
});

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
let user_signed_in = false;
// chrome.runtime.onStartup.addListener(() => {
//   console.log("onStartup");
//   getTaskLists();
// });

// chrome.action.onClicked.addListener(() => {
//   console.log("onClicked");
//   getTaskLists();
// });

// chrome.identity.getAuthToken({ interactive: false }, function (token) {
//     if (token) {
//         chrome.action.setPopup({ popup: 'signedIn.html' });
//     } else {
//         chrome.action.setPopup({ popup: 'popup.html' });
//     }
// });

// chrome.identity.onSignInChanged.addListener(function (account_id, signedIn) {
//     if (signedIn) {
//         user_signed_in = true;
//         chrome.action.setPopup({ popup: 'signedIn.html' });
//     } else {
//         user_signed_in = false;
//     }
// });

function getTaskLists(token?: string) {
  console.log("getTaskLists");
  let fetch_task_lists_url = `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${API_KEY}`;
  console.log("fetch_task_lists_url: ", fetch_task_lists_url);
  let fetch_task_lists_options = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  fetch(fetch_task_lists_url, fetch_task_lists_options)
    .then(res => res.json())
    .then(res => {
      console.log("g lists res: ", res);
      return res;
    });
}

async function getListsAndTasks(token) {
  let fetch_task_lists_url = `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${API_KEY}`;
  let fetch_task_lists_options = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const res = await fetch(fetch_task_lists_url, fetch_task_lists_options);
  const lists = await res.json();

  let aggregatedTasks = await Promise.all(lists.items.map(async list => {
    fetch_task_lists_url = `https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks?key=${API_KEY}`;

    const res = await fetch(fetch_task_lists_url, fetch_task_lists_options);
    const tasks = await res.json();
    return { list, tasks };
  }));

  return aggregatedTasks;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("request: ", request);
    // console.log("sender: ", sender);
    // console.log("sendResponse: ", sendResponse);
    chrome.identity.getAuthToken({ interactive: true }, function (token) {

      switch(request.action) {
        case 'get_auth_token':
          console.log("token: ", token);
          sendResponse({ token: token });
          break;
        case 'example':
          console.log("example");
          sendResponse({ result: "response from background.js" });
          break;
        case 'get_google_lists':
          sendResponse({ result: getTaskLists(token) });
          break;
        case 'get_google_lists_and_tasks':
          getListsAndTasks(token).then(res => {
            console.log("res: ", res);
            sendResponse({ result: res });
          });
          break;
        case 'store_current_list_meta':
          // TODO: store the list id and title in storage for caching
          console.log("store_current_list_meta: ", request.listId, request.listTitle);
          chrome.storage.sync.set({ listMeta: { "id": request.listId, "title": request.listTitle } });
          break;
        case 'get_current_list_meta':
          // TODO: get the list id and title from storage
          chrome.storage.sync.get(['listMeta'], function (result) {
            console.log("get_current_list_meta: ", result);
            sendResponse({ result: result.listMeta });
          });
          break;
        default:
          console.log("default");
        }
        console.log("end of onMessage");
      });
    return true;
});

// async function fetchData() {
//   const res = await fetch ("https://api.coronavirus.data.gov.uk/v1/data");
//   const record = await res.json();
//   console.log(record);
  // document.getElementById("date").innerHTML=record.data[0].date;
  // document.getElementById("areaName").innerHTML=record.data[0].areaName;
  // document.getElementById("latestBy").innerHTML=record.data[0].latestBy;
  // document.getElementById("deathNew").innerHTML=record.data[0].deathNew;
// }
// fetchData();


// Side Panel service worker
function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'define-word',
    title: 'Define',
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data) => {
  chrome.runtime.sendMessage({
    name: 'define-word',
    data: { value: data.selectionText }
  });
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