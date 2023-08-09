import './styles.css'

// basic blueprint - add functionality, make it a class or something.
function TodoItem(title, description, dueDate, priority, notes, checkList) {
   return { title, description, dueDate, priority, notes, checkList };
}

function Project(name) {
   this.name = name;
   this.todoItems = [];

   this.addTodoItem = (item) => this.todoItems.push(item);
}