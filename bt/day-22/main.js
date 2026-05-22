const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const addBtn = $(".add-btn");
const addTaskModal = $("#addTaskModal");
const modalClose = $(".modal-close");
const btnCancel = $(".btn-cancel");
const todoList = $(".todo-list");
const tabsMenu = $(".tabs-menu");

const todoForm = $(".todo-app-form");
const title = $("#taskTitle");
const formTitle = addTaskModal.querySelector(".modal-title");
const btnSubmit = addTaskModal.querySelector(".btn-submit");
const searchInput = $(".search-input");

const isCompleted = false;

// lay du lieu tu localStorage
const todoTasks = JSON.parse(localStorage.getItem('todoTasks')) ?? [];

tabsMenu.onclick = event => {
    const allTasks = event.target.closest('.all-btn');
    const activeTasks = event.target.closest('.active-btn');
    const completeTask = event.target.closest('.completed-btn');

    const btnTabs = tabsMenu.querySelectorAll('.tab-button');
    // Xoa class active
    btnTabs.forEach( tab => {
        tab.classList.remove("active");
    })

    if(allTasks){
        allTasks.classList.add("active")
        renderTasks(todoTasks)
    }
    if(activeTasks){
        activeTasks.classList.add("active")

        const activeTasksFilter = todoTasks.filter( task => {
            return!task.isCompleted;
        })
        renderTasks(activeTasksFilter);
    }
    if(completeTask){
        completeTask.classList.add("active");

        const completeTasksFilter = todoTasks.filter( task => {
            return task.isCompleted
        })
        renderTasks(completeTasksFilter);
    }
}

let editIndex = null;

searchInput.oninput = event => {
    let searchValue = event.target.value.trim().toLowerCase();
    // console.log(searchValue)
    const filteredTasks = todoTasks.filter( task => {
        return task.title.toLowerCase().includes(searchValue) || task.description.toLowerCase().includes(searchValue)
    })
    if(filteredTasks.length === 0){
        todoList.innerHTML = `<p>Không tìm thấy công việc nào.</p>`
        return
    }
    renderTasks(filteredTasks)
}



function openForm() {
    addTaskModal.classList.add("show");
    setTimeout(() => {
        title.focus();
    }, 100);
}
function closeForm() {
    addTaskModal.classList.remove("show");
    
    if(formTitle){
        setTimeout (() => {
            formTitle.textContent = formTitle.dataset.original || formTitle.textContent;
        }, 300)
        
        // delete formTitle.dataset.original;
    }
    if(btnSubmit){
        setTimeout (() => {
            btnSubmit.textContent = btnSubmit.dataset.original || btnSubmit.textContent;
        }, 300)
    }

    editIndex = null;
    // Cuon len dau
    setTimeout (() => {
        addTaskModal.querySelector(".modal").scrollTop = 0;
    }, 300)
    

    todoForm.reset();

}
addBtn.onclick = openForm;
modalClose.onclick = closeForm;
btnCancel.onclick = closeForm;
// editBtns.onclick = openForm;



todoForm.onsubmit = function (event) {
    event.preventDefault();
    // Lay toan bo du lieu data
    const formData = Object.fromEntries(new FormData(todoForm).entries())
    formData.isCompleted = false;

    if(editIndex !== null){
        todoTasks[editIndex] = formData;
    }else{
        todoTasks.unshift(formData);
    }
    
    saveTodoTasks()
    

    // reset form
    closeForm()

    renderTasks(todoTasks)
}

function saveTodoTasks(){
    // luu du lieu vao localStorage
    localStorage.setItem("todoTasks", JSON.stringify(todoTasks))
}

todoList.onclick = event => {
    const editBtn = event.target.closest(".edit-btn")
    if(editBtn !== null){
        const taskIndex = editBtn.dataset.index;
        const task = todoTasks[taskIndex];
        editIndex = taskIndex;
        
        for (const key in task) {
            const value = task[key];
            const input = $(`[name="${key}"]`);
            if(input){
                input.value = value;
            }
        }
        
        if(formTitle){
            formTitle.dataset.original = formTitle.textContent;
            formTitle.textContent = "Edit Task";
        }
        if(btnSubmit){
            btnSubmit.dataset.original = btnSubmit.textContent;
            btnSubmit.textContent = "Save Task";
        }

        openForm();
    }
    // xoa task
    const deleteBtn = event.target.closest(".delete")
    if(deleteBtn){
        const taskIndex = deleteBtn.dataset.index;
        const task = todoTasks[taskIndex];
        if(confirm(`Ban co muon xoa cong viec "${task.title}"?`)){
            todoTasks.splice(taskIndex, 1);
            saveTodoTasks();
            renderTasks(todoTasks);
        }
    }
    // complete task
    const completeBtn = event.target.closest(".complete")
    if(completeBtn){
        const taskIndex = completeBtn.dataset.index;
        const task = todoTasks[taskIndex];
        task.isCompleted = !task.isCompleted;
        saveTodoTasks();
        renderTasks(todoTasks);
    }
    
}

function renderTasks(tasks) {
    if(!tasks.length){
        todoList.innerHTML = `<p>Chua co cong viec nao!</p>`;
        return
    }
    const html = tasks.map( (task, index) => {
    return `
    <div class="task-card ${escapeHTML(task.color)} ${task.isCompleted ? 'completed': ""}">
                    <div class="task-header">
                        <h3 class="task-title">${escapeHTML(task.title)}</h3>
                        <button class="task-menu">
                            <i class="fa-solid fa-ellipsis fa-icon"></i>
                            <div class="dropdown-menu">
                                <div class="dropdown-item edit-btn" data-index="${index}">
                                    <i
                                        class="fa-solid fa-pen-to-square fa-icon"
                                    ></i>
                                    Edit
                                </div>
                                <div class="dropdown-item complete" data-index="${index}">
                                    <i class="fa-solid fa-check fa-icon"></i>
                                    ${task.isCompleted ? 'Mark as Active': "Mark as Complete"}
                                </div>
                                <div class="dropdown-item delete" data-index="${index}">
                                    <i class="fa-solid fa-trash fa-icon"></i>
                                    Delete
                                </div>
                            </div>
                        </button>
                    </div>
                    <p class="task-description">
                        ${escapeHTML(task.description)}
                    </p>
                    <div class="task-time">${escapeHTML(task.startTime)} - ${escapeHTML(task.endTime)}</div>
                </div>
    `
    }).join("");

    todoList.innerHTML = html;
}

renderTasks(todoTasks)


function escapeHTML(html){
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
}