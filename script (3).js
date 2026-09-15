const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelector(".filters");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


// ADD TASK
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";

    renderTasks();
});


// DISPLAY TASKS
function renderTasks() {

    taskList.innerHTML = "";

    let displayedTasks = tasks;

    if (currentFilter === "active") {
        displayedTasks = tasks.filter(function(task) {
            return task.completed === false;
        });
    }

    if (currentFilter === "completed") {
        displayedTasks = tasks.filter(function(task) {
            return task.completed === true;
        });
    }

    displayedTasks.forEach(function(task) {

        const div = document.createElement("div");

        div.className = "task";

        if (task.completed) {
            div.classList.add("completed");
        }

        div.dataset.id = task.id;

        div.innerHTML = `
            <input
                type="checkbox"
                class="complete-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">${task.text}</span>

            <button class="edit-btn">Edit</button>

            <button class="delete-btn">Delete</button>
        `;

        taskList.appendChild(div);
    });

    updateCount();
}


// EDIT AND DELETE
taskList.addEventListener("click", function(event) {

    const taskElement = event.target.closest(".task");

    if (!taskElement) {
        return;
    }

    const id = Number(taskElement.dataset.id);

    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderTasks();
    }


    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        const task = tasks.find(function(task) {
            return task.id === id;
        });

        const newText = prompt("Edit task:", task.text);

        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            renderTasks();
        }
    }
});


// COMPLETE TASK
taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("complete-checkbox")) {
        return;
    }

    const taskElement = event.target.closest(".task");

    const id = Number(taskElement.dataset.id);

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    task.completed = event.target.checked;

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    renderTasks();
});


// FILTERS
filterButtons.addEventListener("click", function(event) {

    if (!event.target.classList.contains("filter")) {
        return;
    }

    document.querySelectorAll(".filter").forEach(function(button) {
        button.classList.remove("active");
    });

    event.target.classList.add("active");

    currentFilter = event.target.dataset.filter;

    renderTasks();
});


// TASK COUNT
function updateCount() {

    const activeTasks = tasks.filter(function(task) {
        return task.completed === false;
    }).length;

    taskCount.textContent =
        activeTasks + " " +
        (activeTasks === 1 ? "task" : "tasks") +
        " remaining";
}


// LOAD SAVED TASKS
renderTasks();