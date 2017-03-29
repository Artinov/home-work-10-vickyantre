var inputText = document.querySelector("#todoText");
var todosList = document.querySelector("#todoList");
var todosLeft = document.querySelector("#todosLeft");
var clearCompleted = document.querySelector("#clearCompleted");
var markAllComplited = document.querySelector("#markAllComplited")
var todoIndexValue = 0;

var showAll = document.querySelector("#showAll");
var showActive = document.querySelector("#showActive");
var showCompleted = document.querySelector("#showCompleted");

var globalTodoFilter = null;

var todos = [];

// inputText.onkeypress = function(e) {
$("#todoText").keypress(function(e){
    if (e.keyCode == 13) {
        todoIndexValue++;
        todos.push({
            text: inputText.value,
            isDone: false,
            index: todoIndexValue
        });
        updateLocalStorage();
        inputText.value = "";
        renderTodos();
        countActiveTodos();
        showClearCompleted();
        showMarkAllButton()
    }
})

// clearCompleted.onclick =function() {
$("#clearCompleted").click(function(){
    todos.forEach(function(todo, i) {
        if (todo.isDone == true) {
            var li = document.querySelector("li[todo-index='" + todo.index + "']");
            todosList.removeChild(li);
        }
    });

        todos = todos.filter(function(todo) {
        return todo.isDone == false;
    });
        updateLocalStorage();
})

function showClearCompleted(){
    var completedTodos = todos.filter(function(todo) {
        return todo.isDone == true;
    });
    if (completedTodos.length == 0){
            clearCompleted.style.display="none";
        } else {
            clearCompleted.style.display="inline-block";
        }
}

function showMarkAllButton(){
    var completedTodos = todos.filter(function(todo){
        return todo.isDone == false;
    });
    if (completedTodos.length == 0){
        markAllCompleted.classList.remove("mark-all-selected")
    } else {
        markAllCompleted.classList.add("mark-all-selected")
    }
}


markAllCompleted.onclick = function() {
    var activeTodos = todos.filter(function(todo) {
        return todo.isDone == false;
    }).length;

    if(activeTodos == 0) {
        todos.forEach(function(todo) {
            changeTodoStatus(todo,"", false)
        });
    
    } else {
        todos.forEach(function(todo) {
            changeTodoStatus(todo, "todo-done", true)
        });
    }

    countActiveTodos();
    showClearCompleted();
    showMarkAllButton();
    updateLocalStorage();
}

function changeTodoStatus(todo,liClass, todoState){
            var li = document.querySelector("li[todo-index='" + todo.index + "']");
            var checkbox = li.querySelector("input");

            todo.isDone = todoState;
            checkbox.checked = todoState;
            li.setAttribute("class", "list-group-item " + liClass)
}


showActive.onclick = function(){
    renderTodos(false);
}
showAll.onclick = function(){
    renderTodos(null);
}
showCompleted.onclick = function(){
    renderTodos(true);
}

function renderTodos(todoFilter) {
    highlightButton(todoFilter);
    globalTodoFilter = todoFilter;

    var filteredTodos = todos;
    todosList.innerHTML = "";

    if (todos.length == 0) {
        todosList.innerHTML = "";
        return;
    }

    if (todoFilter != null) {
        todosList.innerHTML = "";
        filteredTodos = filteredTodos.filter(function(todo) {
            return todo.isDone == todoFilter;
        });
    }

    filteredTodos.forEach(function(todo) {
        var todoElementTemplate = document.querySelector("div#hollow li").cloneNode(true);

        todoElementTemplate.querySelector("span").innerText = todo.text;
        todoElementTemplate.setAttribute("todo-index", todo.index)
        
        if(todo.isDone == true){
            todoElementTemplate.setAttribute("class", "list-group-item todo-done")
            todoElementTemplate.querySelector("input").checked= true;
        }

        todoElementTemplate.querySelector("input").onchange = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            var todo = todos.filter(function(todo) {
                return todo.index == todoIndex;
            });

            todo = todos.indexOf(todo[0]);
            todo = todos[todo];

            if(e.path[0].checked) {
                li.setAttribute("class"," list-group-item todo-done");
                todo.isDone = true;
            } else {
                li.setAttribute("class","list-group-item");
                todo.isDone = false;
            }
            countActiveTodos();
            showClearCompleted();
            showMarkAllButton();
            updateLocalStorage();
        }
        todoElementTemplate.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            todos.splice(todoIndex, 1);

            todosList.removeChild(li);
            // renderTodos();
            countActiveTodos();
            showClearCompleted();
            showMarkAllButton()
            updateLocalStorage();
        }
        todosList.appendChild(todoElementTemplate);
    });
}

function highlightButton (todoFilter){
    document.querySelectorAll(".btn-group .btn").forEach(function(button){
        button.setAttribute("class", "btn btn-default")
    })

    switch(todoFilter){
        case true: 
            showCompleted.setAttribute("class", "btn btn-primary");
            break;
        case null: 
            showAll.setAttribute("class", "btn btn-primary");
            break;
        case false: 
            showActive.setAttribute("class", "btn btn-primary");
            break;
    }
}

function countActiveTodos() {
    var activeTodos = todos.filter(function(todo){
        return todo.isDone == false;
    });

    todosLeft.innerText = activeTodos.length;
}

function updateLocalStorage(){
    localStorage.setItem("todos", JSON.stringify(todos));
}


function init(){
    var localStorageTodos = localStorage.todos;
    var select = document.querySelector("#listName");
    select.onchange = function(){
    localStorage.setItem("listName", select.value);
    }
    select.value = localStorage.getItem("listName");
    if (localStorageTodos != undefined){
      todos = JSON.parse(localStorageTodos);  
    }
    
    showClearCompleted()
    showMarkAllButton();
    renderTodos(null);
    countActiveTodos(); 
}

init();