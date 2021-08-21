function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("todo-input");
  db.collection("todo-items").add({
    text: text.value,
    status: "active",
  });
  //   reset todo
  text.value = "";
}

function getItems() {
  db.collection("todo-items").onSnapshot((snapshot) => {
    // console.log(snapshot);
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    generateItems(items);
  });
}
// recibe items to todo-items
function generateItems(items) {
  let itemsHTML = "";
  items.forEach((item) => {
    itemsHTML += `
            <div class="todo-item">
            <div class="check">
                <div data-id="${item.id}" class="check-mark 
                ${item.status == "completed" ? "checked" : ""}">
                    <img src="/assets/icon-check.svg" alt=""> 
                </div>
            </div>
            <div class="todo-text ${
              item.status == "completed" ? "checked" : ""
            }">
                ${item.text}
            </div>
        </div>
        `;
  });

  document.querySelector(".todo-items").innerHTML = itemsHTML;
  createdEvenListeners();
}

function createdEvenListeners() {
  let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");

  todoCheckMarks.forEach((checkmark) => {
    checkmark.addEventListener("click", () => {
      markCompleted(checkmark.dataset.id);
    });
  });
}
function markCompleted(id) {
  let item = db.collection("todo-items").doc(id);
  item.get().then(function (doc) {
    if (doc.exists) {
      if (doc.data().status == "active") {
        item.update({
          status: "completed",
        });
      } else {
        item.update({
          status: "active",
        });
      }
    }
  });
}
getItems();
