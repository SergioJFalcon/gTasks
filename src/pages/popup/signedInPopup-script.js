/* 
  TODO List
    1. Get that last seen list/tasks from storage (sync)
    2. Check if any have been updated from a different source i.e., google tasks app on phone
      a. If so, update the storage
    3. Task abilities
      a. Create a task
      b. Delete a task
      c. Update a task
      d. Mark a task as complete -> Show alert of task completion and give user option to undo
      e. Move task position
      f. Star a task
      g. Show completed tasks
      h. Subtasks CRUD
      i. Clicking on a task should take you to the task details page
    4. List abilities
      a. Create a list
      b. Delete a list
      c. Update a list
      d. Switch to a different List
    5. Starred List
    6. Show badge icon with number of tasks due today
    7. List of coalated tasks from all lists due today
*/
let listMetadata = chrome.runtime.sendMessage({ action: "get_current_list_meta" });
(async () => {
  console.log("signedInPopup-script.js")
  // check if we have a listId stored in storage
  const response = await chrome.runtime.sendMessage({ action: "get_google_lists_and_tasks" });
  // do something with response here, not outside the function
  console.log(response);
  // store the first list id in storage so we can keep a level of state
  // const storeListMeta = chrome.runtime.sendMessage({ action: "store_current_list_meta", listId: response.result[0].list.id, listTitle: response.result[0].list.title });
  // chrome.storage.sync.set({ listId: response.result[0].list.id });
  const getListMeta = chrome.runtime.sendMessage({ action: "get_current_list_meta" });
  // populate the dropdown with the lists
  const select = document.getElementById("list");
  response.result.forEach(list => {
    const option = document.createElement("option");
    option.text = list.list.title;
    option.value = list.list.id;
    select.add(option);
  });
  
  document.getElementById('response').textContent = select.value;
  // check what the value of the dropdown is, and create a list of task items
  // for that list
  const current_list = response.result.find(list => list.list.id === select.value);
  console.log(current_list);
  document.getElementById('tasks-response').textContent = current_list;
  const tasksList = document.getElementById("tasks-list");
  // create a list of tasks
  current_list.tasks.items.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.className = "list-group-item";
    taskItem.textContent = task.title;
    tasksList.appendChild(taskItem);
  });
})();

// on select change, get the tasks for that list
document.getElementById("list").addEventListener("change", async () => {
  const listId = document.getElementById("list").value;
  // const response = await chrome.runtime.sendMessage({action: "get_google_tasks", listId: listId});
  // console.log(response);
  // document.getElementById('response').textContent = response.result;
  const current_list = response.result.find(list => list.list.id === listId);
  console.log(current_list);
  document.getElementById('tasks-response').textContent = current_list;
  const taskList = document.getElementById("tasktasks");
  // create a list of tasks
  current_list.tasks.forEach(task => {
    const listItem = document.createElement("option");
    // listItem.className = "list-group-item";

    listItem.text = task.title;
    listItem.value = task.id;
    taskList.add(listItem);
  });
});

// document.querySelector('button')
//   .addEventListener('click', function () {
//     chrome.runtime.sendMessage({ message: 'get_google_lists_and_tasks' }).then((res) => {
//       console.log("get lists: ", res)
//     });
//   });

// function setAlarm(event) {
//   const minutes = parseFloat(event.target.value);
//   chrome.action.setBadgeText({ text: 'ON' });
//   chrome.alarms.create({ delayInMinutes: minutes });
//   chrome.storage.sync.set({ minutes: minutes });
//   window.close();
// }

// function clearAlarm() {
//   chrome.action.setBadgeText({ text: '' });
//   chrome.alarms.clearAll();
//   window.close();
// }

// // An Alarm delay of less than the minimum 1 minute will fire
// // in approximately 1 minute increments if released
// document.getElementById('sampleMinute').addEventListener('click', setAlarm);
// document.getElementById('min15').addEventListener('click', setAlarm);
// document.getElementById('min30').addEventListener('click', setAlarm);
// document.getElementById('cancelAlarm').addEventListener('click', clearAlarm);





// if (request.message === 'get_auth_token') {
//   chrome.identity.getAuthToken({ interactive: true }, function (token) {
//       console.log(token);
//   });
// } else if (request.message === 'get_profile') {
//   chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (user_info) {
//       console.log(user_info);
//   });
// } else if (request.message === 'get_google_lists_and_tasks') {
// chrome.identity.getAuthToken({ interactive: true }, function (token) {
//     let fetch_task_lists_url = `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${API_KEY}`;
//     let fetch_task_lists_options = {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     }

//     fetch(fetch_task_lists_url, fetch_task_lists_options)
//         .then(res => res.json())
//         .then(res => {
//             let aggregatedTasks = res.items.map(async list => {
//                 fetch_task_lists_url = `https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks?key=${API_KEY}`;

//                 const res = await fetch(fetch_task_lists_url, fetch_task_lists_options);
//               const tasks = await res.json();
//               return { list, tasks };
//             });

//             Promise.all(aggregatedTasks).then(results => {
//                 sendResponse({ tasks: results });
//             });
//         });

//       });
//       return true; // This is important to indicate that the response will be sent asynchronously
// } else if (request.message === 'get_google_lists') {
//   let aggregatedTasks = [];
//   chrome.identity.getAuthToken({ interactive: true }, function (token) {
//       let fetch_task_lists_url = `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${API_KEY}`;
//       let fetch_task_lists_options = {
//           headers: {
//               'Authorization': `Bearer ${token}`
//           }
//       }

//       fetch(fetch_task_lists_url, fetch_task_lists_options)
//           .then(res => res.json())
//           .then(res => {
//               console.log(res);
//               aggregatedTasks = res.items;
//               console.log("aggregatedTasks: ", aggregatedTasks);
//                 // aggregatedTasks = res;
//                 // lets store it
//                 // chrome.storage.local.set({ 'google_lists': res.items }, function () {
//                   //     console.log('google_lists stored');
//                   // });
//             }); 
//       });
//       console.log("aggregatedTasks: ", aggregatedTasks);
//   sendResponse({ lists: aggregatedTasks });
//   return true;
// } else if (request.message === 'get_google_tasks') {
//   chrome.identity.getAuthToken({ interactive: true }, function (token) {
//       let fetch_task_lists_url = `https://tasks.googleapis.com/tasks/v1/lists/${request.list_id}/tasks?key=${API_KEY}`;
//       let fetch_task_lists_options = {
//           headers: {
//               'Authorization': `Bearer ${token}`
//           }
//       }

//       fetch(fetch_task_lists_url, fetch_task_lists_options)
//           .then(res => res.json())
//           .then(res => {
//               console.log(res);
//               // lets store it in its respective list
//               chrome.storage.local.get('google_lists', function (data) {
//                   console.log(data);
//                   const lists = data.google_lists;
//                   const list_index = lists.findIndex(list => list.id === request.list_id);
//                   lists[list_index].tasks = res.items;

//                   chrome.storage.local.set({ 'google_lists': lists }, function () {
//                       console.log('google_lists stored');
//                   });
//               });
//           });
//   });
// } else if (request.message === 'get_contacts') {
//   chrome.identity.getAuthToken({ interactive: true }, function (token) {
//       let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`;
//       let fetch_options = {
//           headers: {
//               'Authorization': `Bearer ${token}`
//           }
//       }

//       fetch(fetch_url, fetch_options)
//           .then(res => res.json())
//           .then(res => {
//               if (res.memberCount) {
//                   const members = res.memberResourceNames;
//                   fetch_url = `https://people.googleapis.com/v1/people:batchGet?personFields=names&key=${API_KEY}`;

//                   members.forEach(member => {
//                       fetch_url += `&resourceNames=${encodeURIComponent(member)}`;
//                   });

//                   fetch(fetch_url, fetch_options)
//                       .then(res => res.json())
//                       .then(res => console.log(res));
//               }
//           });
//   });
// } else if (request.message === 'create_contact') {
//   chrome.identity.getAuthToken({ interactive: true }, function (token) {
//       let fetch_url = `https://people.googleapis.com/v1/people:createContact?key=${API_KEY}`;

//       let fetch_options = {
//           method: 'POST',
//           headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//               'names': [
//                   {
//                       "givenName": "Johnny",
//                       "familyName": "Silver"
//                   }
//               ]
//           })
//       }

//       fetch(fetch_url, fetch_options)
//           .then(res => res.json())
//           .then(res => console.log(res));
//   });
// } else if (request.message === 'delete_contact') {
//   chrome.identity.getAuthToken({ interactive: true }, function (token) {
//       let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`;
//       let fetch_options = {
//           headers: {
//               'Authorization': `Bearer ${token}`
//           }
//       }

//       fetch(fetch_url, fetch_options)
//           .then(res => res.json())
//           .then(res => {
//               if (res.memberCount) {
//                   const members = res.memberResourceNames;

//                   fetch_options.method = 'DELETE';
//                   fetch_url = `https://people.googleapis.com/v1/${members[0]}:deleteContact?key=${API_KEY}`;

//                   fetch(fetch_url, fetch_options)
//                       .then(res => console.log(res));
//               }
//           });
//   });
// }