let tasksArea = document.querySelector("section");
let inputField = document.querySelector("input[type='text']");
let addBtn = document.querySelector(".add-btn");

// make a task and added to the tasks area
const addTask = (taskText) => {
  if (taskText.length != 0) {
    let box = document.createElement("div");
    box.className = "box";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    box.appendChild(checkbox);

    let text = document.createElement("span");
    text.append(taskText);
    box.appendChild(text);

    let editeArea = document.createElement("div");
    editeArea.className = "edite-area";
    box.appendChild(editeArea);

    let editeBtn = document.createElement("i");
    editeBtn.classList.add("fa-solid", "fa-pen-to-square", "edite");
    editeArea.appendChild(editeBtn);

    let removeBtn = document.createElement("i");
    removeBtn.classList.add("fa-solid", "fa-trash", "remove");
    editeArea.appendChild(removeBtn);

    tasksArea.appendChild(box);

    inputField.value = "";
  }
};

// Blur Element wich doesn't selected
const blurElement = (e) => {
  e.target.parentElement.parentElement.parentElement.childNodes.forEach(
    (e, i) => {
      if (i != 0) {
        e.style.filter = "grayscale(1)";
      }
    }
  );

  e.target.parentElement.parentElement.style.filter = "grayscale(0)";
  e.target.style.opacity = "1";
};

const unBlurElement = (e) => {
  e.target.parentElement.parentElement.parentElement.childNodes.forEach(
    (e, i) => {
      if (i != 0) {
        e.style.filter = "grayscale(0)";
      }
    }
  );
  e.target.style.opacity = "0.6";
};

// Add All tasks to the localStorage
const addTasksToLocalStorage = () => {
  let tasksArr = [];
  if (JSON.parse(localStorage.getItem("tasksArr")) != null) {
    tasksArr = JSON.parse(localStorage.getItem("tasksArr"));
  }
  if (inputField.value != "") {
    tasksArr.push(inputField.value);
  }
  localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
};

// Add tasks from localStorage to the document
const addTasksFromLocalStorage = () => {
  let tasksArr = [];
  if (JSON.parse(localStorage.getItem("tasksArr")) != null) {
    tasksArr = JSON.parse(localStorage.getItem("tasksArr"));
  }
  if (tasksArr) {
    tasksArr.forEach((e) => {
      addTask(e);
    });
  }
};
addTasksFromLocalStorage();

// give task some specific styling if it selected
const taskDone = (e) => {
  if (e.target.nodeName == "INPUT") {
    if (e.target.checked) {
      let index = [...document.querySelectorAll(".box")].indexOf(
        e.target.parentElement
      );
      let element = e.target.parentElement.querySelector("span").textContent;

      e.target.parentElement.classList.add("done");
      e.target.parentElement.querySelector(".edite-area").style.display =
        "none";

      setTimeout(() => {
        e.target.parentElement.style.opacity = 0;
      }, 300);
      setTimeout(() => {
        e.target.parentElement.style.display = "none";
      }, 600);

      // create undo element
      let undoParent = document.createElement("div");
      undoParent.className = "undo";

      let undoText = document.createElement("span");
      undoText.append(`${element} Completed`);
      undoParent.appendChild(undoText);

      undoBtn = document.createElement("i");
      undoBtn.classList.add("fa-solid", "fa-rotate-left");
      undoParent.appendChild(undoBtn);

      document.body.appendChild(undoParent);
      setTimeout(() => {
        undoParent.style.opacity = 1;
      }, 100);

      deleteFromLocalStorage(index);

      let deleteElement = setTimeout(() => {
        undoParent.remove();
      }, 5000);

      undoBtn.addEventListener("click", () => {
        e.target.parentElement.style.display = "flex";
        e.target.parentElement.style.opacity = 1;
        e.target.click();
        e.target.parentElement.classList.remove("done");
        e.target.parentElement.querySelector(".edite-area").style.display =
          "block";
        clearInterval(deleteElement);
        undoParent.remove();
        let tasksArr = [];
        if (localStorage.getItem("tasksArr") != null) {
          tasksArr = JSON.parse(localStorage.getItem("tasksArr"));
        }
        tasksArr.splice(index, 0, element);
        localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
      });
    }
  }
};

// Edite Task by inputField
const editeTask = (e) => {
  if (e.target.classList.contains("edite")) {
    e.target.parentElement.parentElement.childNodes.forEach((e) => {
      if (e.nodeName == "SPAN") {
        inputField.value = e.textContent;
        addBtn.classList.remove("fa-plus");
        addBtn.classList.add("fa-check");
        inputField.addEventListener("input", () => {
          if (addBtn.classList.contains("fa-check")) {
            e.textContent = inputField.value;
          }
        });
      }
    });
    addBtn.addEventListener("click", () => {
      unBlurElement(e);
      inputField.value = "";
      let index = [...document.querySelectorAll(".box")].indexOf(
        e.target.parentElement.parentElement
      );
      let element =
        e.target.parentElement.parentElement.querySelector("span").textContent;
      let tasksArr = JSON.parse(localStorage.getItem("tasksArr"));
      tasksArr[index] = element;
      localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
      addBtn.classList.remove("fa-check");
      addBtn.classList.add("fa-plus");
    });
    blurElement(e);
  }
};

// Delete Task From localStorage
const deleteFromLocalStorage = (i) => {
  let tasksArr = [];
  if (JSON.parse(localStorage.getItem("tasksArr")) != null) {
    tasksArr = JSON.parse(localStorage.getItem("tasksArr"));
  }
  tasksArr.splice(i, 1);
  localStorage.setItem("tasksArr", JSON.stringify(tasksArr));
  if (tasksArr.length === 0) {
    localStorage.removeItem("tasksArr");
  }
};

// Delete task
const deleteTask = (e) => {
  if (e.target.classList.contains("remove")) {
    let deleteElement = document.createElement("div");
    deleteElement.className = "delete";

    let cancel = document.createElement("i");
    cancel.classList.add("fa-solid", "fa-circle-xmark");
    deleteElement.appendChild(cancel);

    let text = document.createElement("p");
    text.append("click on delete if you sure!");
    deleteElement.appendChild(text);

    let btn = document.createElement("button");
    btn.append("Delete");
    deleteElement.appendChild(btn);

    document.body.appendChild(deleteElement);

    cancel.addEventListener("click", () => {
      deleteElement.remove();
      unBlurElement(e);
    });

    btn.addEventListener("click", () => {
      unBlurElement(e);
      let index = [...document.querySelectorAll(".box")].indexOf(
        e.target.parentElement.parentElement
      );
      deleteFromLocalStorage(index);
      e.target.parentElement.parentElement.remove();
      deleteElement.remove();
    });
    blurElement(e);
  }
};

tasksArea.addEventListener("click", (e) => {
  deleteTask(e);
  editeTask(e);
  taskDone(e);
});

addBtn.addEventListener("click", () => {
  if (addBtn.classList.contains("fa-plus")) {
    addTasksToLocalStorage();
    addTask(inputField.value);
  }
});

// Add Element by Enter
inputField.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    addBtn.click();
  }
});
