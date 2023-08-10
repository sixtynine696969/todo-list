// import './styles.css'

function todoItem(title, description, dueDate, priority, notes, checkList) {
    return { title, description, dueDate, priority, notes, checkList };
}

const displayController = function() {
    const sidebar = document.querySelector('.sidebar');
    const addListButton = document.querySelector('button.add-list');
    const getCardsElement = () => document.querySelector('.cards')

    const getButtons = () => document.querySelectorAll('.sidebar > button:not(button.add-list)');
    const getAddListWindow = () => document.querySelector('.add-list-window');
    const getAddTaskButton = () => document.querySelector('button.add-task');

    const capitalizeString = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

    const unselectButtons = () => {
        removeAddTaskButton();
        const buttons = getButtons();
        buttons.forEach(button => {
            button.classList.remove('selected');
        });
    };

    const removeAddTaskButton = () => {
        if (getAddTaskButton()) {
            getAddTaskButton().remove();
        }
    }

    const addAddTaskButton = () => {
        const addTaskButton = document.createElement('button');
        addTaskButton.setAttribute('type', 'button');
        addTaskButton.classList.add('card');
        addTaskButton.classList.add('add-task');
        addTaskButton.textContent = '+ Add Task';

        getCardsElement().appendChild(addTaskButton);
    }

    const selectClickedButton = (e) => {
        e.target.classList.add('selected');

        addAddTaskButton();
    }

    const removeAllLists = () => {
        getButtons().forEach(i => i.remove());
    }

    const handleAddListButtons = () => {
        const submitButton = document.querySelector('.add-list-window .add-list-submit');
        const closeButton = document.querySelector('.add-list-window .add-list-close');

        closeButton.addEventListener('click', () => {
            getAddListWindow().remove();
        })

        submitButton.addEventListener('click', () => {
            const input = getAddListWindow().querySelector('input').value;
            glue.addToListAndDraw(input);
            getAddListWindow().remove();
            removeAddTaskButton();
        })
    }

    const createAddListWindow = () => {
        const div = document.createElement('div');
        div.classList.add('add-list-window');
        
        const form = document.createElement('form');
        
        const label = document.createElement('label');
        label.setAttribute('for', 'name');
        label.textContent = 'Name of new list:';

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'name');
        input.setAttribute('id', 'name');

        form.appendChild(label);
        form.appendChild(input);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'button');
        submitButton.classList.add('add-list-submit');
        submitButton.textContent = 'Submit';

        const closeButton = document.createElement('button');
        closeButton.setAttribute('type', 'button');
        closeButton.classList.add('add-list-close');
        closeButton.textContent = 'Close';

        buttonsDiv.appendChild(submitButton);
        buttonsDiv.appendChild(closeButton);

        div.appendChild(form);
        div.appendChild(buttonsDiv);

        document.body.appendChild(div);
    }

    const displayAddListWindow = () => {
        if (!getAddListWindow()) {
            createAddListWindow();
            handleAddListButtons();
        };
    }

    const addEventsToAddListButton = () => {
        addListButton.addEventListener('click', e => {
            displayAddListWindow();
        })
    }

    const addEvenetsToButtons = () => {
        const buttons = getButtons();

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                unselectButtons();
                selectClickedButton(e);
            });

        })
    };

    const drawListButtons = (listNames) => {
        listNames.forEach(listName => {
            const button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.id = listName;
            button.textContent = capitalizeString(listName);
            
            sidebar.appendChild(button);
        });
        addEvenetsToButtons();
    };

    return { 
        drawListButtons, addEventsToAddListButton, removeAllLists,
        removeAddTaskButton
    };
}();

const todoList = function() {
    let list = {};

    list = {
        'inbox': [new todoItem('test', 'test', 'test', 'test', 'test', 'test')],
        'today': [],
        'week': [],
    };

    const getNamesOfLists = () => {
        let listNames = [];
        for (const key in list) listNames.push(key);
        return listNames;
    };

    const addNewList = (listName) => {
        if (!(listName in list)) {
            list[listName] = [];
        }
    }

    const getAllTodoItems = () => {
        let todoItems = [];
        for (const key in list) {
            for (const arrItem of list[key]) {
                todoItems.push(arrItem);
            }
        }
        return todoItems;
    }

    return { getNamesOfLists, addNewList, getAllTodoItems };
}();

const glue = function() {

    const addToListAndDraw = (listName) => {
        displayController.removeAllLists();
        todoList.addNewList(listName);
        const namesOfLists = todoList.getNamesOfLists();
        displayController.drawListButtons(namesOfLists);
        displayController.addEventsToAddListButton();
    } 

    const _init = function() {
        displayController.addEventsToAddListButton();
        const namesOfLists = todoList.getNamesOfLists();
        displayController.drawListButtons(namesOfLists);
        displayController.addEventsToAddListButton();
        displayController.removeAddTaskButton();
    }();

    return { addToListAndDraw };
    
}();