// Форма
// Список задач
const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body:
      "here you can add, remove or edit your TODO list. and also you have some other opportunities as to edit themes or mark your task like finished. The application has active supporting and soon you will see more possibilities. Thank you for your choose \r\n",
    title: "Welcome to your own TODO list"
  }
];

(function(arrOfTasks) {
  const localObjectOfTasks = JSON.parse(localStorage.getItem("objectOfTasks"));
  let objectOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});
  objectOfTasks = localObjectOfTasks || objectOfTasks;

  const themes = {
    default: {
      "--base-text-color": "#212529",
      "--header-bg": "#007bff",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#007bff",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#0069d9",
      "--default-btn-border-color": "#0069d9",
      "--danger-btn-bg": "#dc3545",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#bd2130",
      "--danger-btn-border-color": "#dc3545",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#80bdff",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
      "--checkbox-active-bg-color": "rgb(121, 250, 47)",
      "--taskItem-checked-bg-color": "#cce5ff",
      "--mark-color": "white",
      "--mark-bg": "#007bff"
    },
    dark: {
      "--base-text-color": "#212529",
      "--header-bg": "#343a40",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#58616b",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#292d31",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#b52d3a",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#88222c",
      "--danger-btn-border-color": "#88222c",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--checkbox-active-bg-color": "rgb(250, 203, 47)",
      "--taskItem-checked-bg-color": "#D6D8D9",
      "--mark-color": "yellow",
      "--mark-bg": "#212529"
    },
    light: {
      "--base-text-color": "#212529",
      "--header-bg": "#fff",
      "--header-text-color": "#212529",
      "--default-btn-bg": "#fff",
      "--default-btn-text-color": "#212529",
      "--default-btn-hover-bg": "#e8e7e7",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#f1b5bb",
      "--danger-btn-text-color": "#212529",
      "--danger-btn-hover-bg": "#ef808a",
      "--danger-btn-border-color": "#e2818a",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--checkbox-active-bg-color": "rgb(145, 145, 145)",
      "--taskItem-checked-bg-color": "rgb(245, 245, 245)",
      "--mark-color": "#bcffa1",
      "--mark-bg": "#212529"
    }
  };

  // UI Elements
  const listContainer = document.querySelector(".list-group");
  const form = document.forms["addTask"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];
  const sortSection = document.querySelector(".sort-section");
  const themeSelect = document.getElementById("themeSelect");

  // sort btn
  let activeSortBtn = "allTasks";
  let cookieEditableTask;

  //theme
  const localTheme = localStorage.getItem("theme");
  localTheme ? setTheme(localTheme) : null;

  // first drawing
  renderAllTasks(objectOfTasks);
  onEmptyListHandler();

  // events
  form.addEventListener("submit", onFormSubmitHandler);
  listContainer.addEventListener("click", onDeleteHandler);
  listContainer.addEventListener("click", onCheckedHandler);
  listContainer.addEventListener("DOMSubtreeModified", onEmptyListHandler);
  sortSection.addEventListener("click", onSortTask);
  // edit task
  listContainer.addEventListener("click", onEditTaskHandler);
  window.addEventListener("click", onCheckEditedTaskHandler, true);
  listContainer.addEventListener("mouseover", onCreateMark);
  listContainer.addEventListener("mouseout", onDeleteMark);
  // change theme
  themeSelect.addEventListener("change", onThemeSelectHandler);

  // draw tasks
  function renderAllTasks(tasksList) {
    const fragment = document.createDocumentFragment();
    const sortedTasksLists = Object.values(tasksList).sort((a, b) => {
      return a.completed ? 1 : -1;
    });
    sortedTasksLists.forEach(task => {
      const listItem = createListItem(task);
      fragment.append(listItem);
    });
    listContainer.append(fragment);
  }
  function renderNotFinishedTasks(tasksList) {
    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
      if (task.completed) return;
      const listItem = createListItem(task);
      fragment.append(listItem);
    });
    listContainer.append(fragment);
  }
  function createListItem({ _id: id, title, body, completed } = {}) {
    const listItem = document.createElement("li");
    listItem.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2",
      "task-item"
    );
    listItem.setAttribute("data-task-id", id);
    listItem.style.background = completed
      ? "var(--taskItem-checked-bg-color)"
      : "";

    const label = createCheckbox(completed);

    const span = document.createElement("span");
    span.textContent = title;
    span.style.cssText = "font-weight:bold; margin-right:116px;";

    const btn = document.createElement("button");
    btn.textContent = "delete";
    btn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");
    btn.style.cssText = "position: absolute; top: 20px; right: 20px;";

    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100", "pr-4");

    listItem.append(label);
    listItem.append(span);
    listItem.append(btn);
    listItem.append(article);
    return listItem;
  }

  // create new task
  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;
    if (!bodyValue || !titleValue) {
      alert("some field were empty");
      return;
    }
    const newTask = createNewTask(titleValue, bodyValue);
    const newItem = createListItem(newTask);
    listContainer.insertAdjacentElement("afterbegin", newItem);
    form.reset();
    setLocalStorageObjectOfTasks();
  }
  function createNewTask(title, body) {
    const taskObject = {
      title,
      body,
      _id: `task-${Math.random()}`,
      completed: false
    };
    objectOfTasks[taskObject._id] = taskObject;
    return taskObject;
  }

  // delete task
  function onDeleteHandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      confirmed = deleteTak(id);
      deleteTaskFromHTML(confirmed, parent);
      setLocalStorageObjectOfTasks();
    }
  }
  function deleteTaskFromHTML(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }
  function deleteTak(id) {
    const { title } = objectOfTasks[id];
    const isConfirm = confirm(`do you realy wanna delete the task: ${title}`);
    if (!isConfirm) return isConfirm;
    delete objectOfTasks[id];
    return isConfirm;
  }

  // show alert of empty tasks list
  function createAlertInfo() {
    const alertInfo = document.createElement("div");
    alertInfo.textContent = "The task list is empty. Please add your task";
    alertInfo.className = "alert alert-info empty-alert container";
    return alertInfo;
  }
  function onEmptyListHandler() {
    const lenIsNull = Object.values(objectOfTasks).length === 0;
    const alertEmpty = document.querySelector(".empty-alert");
    if (!lenIsNull && alertEmpty) alertEmpty.remove();
    if (lenIsNull && !alertEmpty) {
      const alertInfo = createAlertInfo();
      listContainer.append(alertInfo);
      return;
    }
  }

  // checkbox and their options
  function onCheckedHandler({ target }) {
    if (!target.classList.contains("checkbox")) return;
    const isChecked = target.checked;
    const parent = target.closest("[data-task-id]");
    const id = parent.dataset.taskId;
    makeChecked(isChecked, id);
    setLocalStorageObjectOfTasks();
  }
  function createCheckbox(completed) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const checkBox = document.createElement("i");
    checkBox.className = "checkbox-mark";
    input.className = "checkbox";
    input.type = "checkbox";
    input.checked = completed;
    label.append(input);
    label.append(checkBox);
    return label;
  }
  function makeChecked(isChecked, id) {
    objectOfTasks[id].completed = isChecked;
    redrawSortedTasks(activeSortBtn);
  }

  // sort task and sort button
  function onSortTask({ target }) {
    if (target.className.includes("btn")) {
      const input = target.querySelector("input[type=radio]");
      activeSortBtn = input.id;
      redrawSortedTasks(activeSortBtn);
      setLocalStorageObjectOfTasks();
    }
  }
  function redrawSortedTasks(id) {
    listContainer.innerHTML = "";
    if (id === "allTasks") renderAllTasks(objectOfTasks);
    if (id === "notFinishedTasks") renderNotFinishedTasks(objectOfTasks);
  }

  //edit tasks and save edited task
  function onEditTaskHandler({ target }) {
    const tag = target.tagName;
    onDeleteMark();
    if (tag === "SPAN" || tag === "P") {
      cookieEditableTask = target.innerHTML.trim();
      const inputField = createEditField(tag, cookieEditableTask);
      target.innerHTML = "";
      target.append(inputField);
      inputField.addEventListener("keydown", onKeyFieldControlHandler);
      setLocalStorageObjectOfTasks();
    }
  }
  function onKeyFieldControlHandler(e) {
    const isField = listContainer.querySelector(".editableField");
    if (e.key === "Enter" && e.ctrlKey) isField.value += "\n";
    if (e.key === "Enter" && !e.ctrlKey) {
      onCheckEditedTaskHandler({ target: document.createElement("div") });
      e.preventDefault();
    }
  }
  function createEditField(tag, content) {
    const field =
      tag === "SPAN"
        ? document.createElement("input")
        : document.createElement("textArea");
    field.className = "editableField";
    field.value = content;
    return field;
  }
  function onCheckEditedTaskHandler(e) {
    const isField = listContainer.querySelector(".editableField");
    if (!e.target.className.includes("editableField") && isField) {
      const isChanged = isField.value.trim() === cookieEditableTask;
      const confirmed = !isChanged
        ? confirm("do you realy wanna to edit this field")
        : false;
      makeChanges(confirmed, isField);
    }
  }
  function makeChanges(confirmed, field) {
    const parent = field.parentElement;
    const tagName = parent.tagName === "SPAN" ? "title" : "body";
    const id = field.closest("[data-task-id]").dataset.taskId;
    let content = confirmed ? field.value : cookieEditableTask;
    content = content || "The field is empty";
    objectOfTasks[id][tagName] = content;
    parent.innerHTML = content;
  }

  //hover effect create mouse on editable element
  function onCreateMark({ target }) {
    const tag = target.tagName;
    const isField = target.querySelector(".editableField");
    const isMark = target.querySelector(".markEdit");
    const spanHasMark = !isField && !isMark && tag === "SPAN";
    const articleHasMark = !isField && !isMark && tag === "P";
    if (spanHasMark || articleHasMark) {
      const mark = document.createElement("mark");
      mark.textContent = "edit";
      mark.style.cssText = "position: absolute;";
      mark.className = "badge badge-pill badge-primary ml-2 markEdit";
      target.append(mark);
    }
  }
  function onDeleteMark() {
    const isMark = listContainer.querySelector(".markEdit");
    if (isMark) isMark.remove();
  }

  // change theme
  function onThemeSelectHandler() {
    const selectedTheme = themeSelect.value;
    setTheme(selectedTheme);
    setLocalTheme(selectedTheme);
  }
  function setTheme(name) {
    const selectedThemeObject = themes[name];
    for (key in selectedThemeObject)
      document.documentElement.style.setProperty(key, selectedThemeObject[key]);
    themeSelect.value = name;

    // hardlier way
    // Object.entries(selectedThemeObject).forEach(([key, value]) =>
    //   document.documentElement.style.setProperty(key, value)
    // );
  }

  //localStorage
  function setLocalStorageObjectOfTasks() {
    const tasksInJSON = JSON.stringify(objectOfTasks);
    localStorage.setItem("objectOfTasks", tasksInJSON);
  }
  function setLocalTheme(theme) {
    localStorage.setItem("theme", theme);
  }
})(tasks);
