import './styles.css'

function todoItem(title, description, dueDate, priority, notes, checkList) {
    return { title, description, dueDate, priority, notes, checkList };
}

const displayController = function() {
    const sidebar = document.querySelector('.sidebar');
    const addListButton = document.querySelector('button.add-list');
    const main = document.querySelector('main');
    const cardsElement = document.querySelector('.cards');

    const getCardsElement = () => document.querySelector('.cards')
    const getCardsEelemtChildren = () => document.querySelectorAll('.card')
    const getButtons = () => document.querySelectorAll('.sidebar > button:not(button.add-list)');
    const getAddListWindow = () => document.querySelector('.add-list-window');
    const getAddTaskButton = () => document.querySelector('button.add-task');
    const getAddItemForm = () => document.querySelector('.add-item-form');
    const getSelectedElementId = () => document.querySelector('.selected').id;

    const capitalizeString = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

    const removeAllCardsChildren = () => getCardsEelemtChildren().forEach(i => i.remove());

    const addItemFormTemplate = `<div class="add-item-form">
    <form action="" class="add-item-window">
        <!-- title, description, dueDate, priority, notes, checkList -->
        <div>
            <label for="title">Title:</label>
            <input type="text" name="title" id="title">
        </div>
        <div>
            <label for="desc">Description:</label>
            <input type="text" name="desc" id="desc">
        </div>
        <div>
            <label for="duedate">Due Date:</label>
            <input type="date" name="duedate" id="duedate">
        </div>
        <fieldset>
            <legend>Priority</legend>
            <div>
                <input type="radio" name="priority" id="urgent" value="urgent">
                <label for="priority">Urgent</label>
            </div>
            <div>
                <input type="radio" name="priority" id="mid" value="mid">
                <label for="priority">Mid</label>
            </div>
            <div>
                <input type="radio" name="priority" id="low" value="low" checked>
                <label for="priority">Low</label>
            </div>
        </fieldset>
        <div>
            <label for="notes">Notes:</label>
            <textarea name="notes" id="notes" rows="3"></textarea>
        </div>
        <div class="buttons">
            <button type="button" class="add-item-submit">Submit</button>
            <button type="button" class="add-item-close">Close</button>
        </div>
    </form>`;

    const fillCardTemplate = (obj, idx) => {
        return `<div class="card priority-${obj.priority}" data-item-index="${idx}">
        <div class="title">
            <span>Title:</span>
            <span>${obj.title ? obj.title : 'Not Set'}</span>
        </div>
        <div class="desc invisible">
            <span>Description:</span>
            <span>${obj.description ? obj.description : 'Not Set'}</span>
        </div>
        <div class="dueDate">
            <span>DueDate:</span>
            <span>${obj.dueDate ? obj.dueDate : 'Not Set'}</span>
        </div>
        <div class="notes invisible">
            <span>Notes:</span>
            <span>${obj.notes ? obj.notes : 'Not Set'}</span>
        </div>
        <div class="card-buttons invisible">
            <button type="button" class="remove-button">Remove</button>
        </div>
        <button type="button" class="expand-button">⌄</button>
    </div>`
    }

    const addEventsToToggleCardVisibility = function() {
        const cards = document.querySelectorAll('div.card');
        cards.forEach(card => {
            const expandButton = card.querySelector('.expand-button');
            expandButton.addEventListener('click', (e) => {
                const innerDivs = card.querySelectorAll('div');
                if (!card.querySelector('.invisible')) {
                    innerDivs.forEach(div => {
                        if (!(div.classList.contains('dueDate') || div.classList.contains('title'))) {
                            div.classList.add('invisible');
                        }
                    })
                    return;
                }
                innerDivs.forEach(div => {
                    div.classList.remove('invisible');
                })
            })
        })
    }

    const addEventsForCardRemove = () => {
        const cards = getCardsEelemtChildren();
        cards.forEach(card => {
            const currentlySelected = getSelectedElementId();
            const removeButton = card.querySelector('button.remove-button');

            if (!removeButton) return;

            removeButton.addEventListener('click', () => {
                const listIndex = card.dataset['itemIndex'];
                todoList.removeItem(currentlySelected, listIndex);
                removeItemsFromCurrentlySelectedList();
                addItemsToCurrentlySelectedList();
            })
        })
    }

    const removeRemoveButton = () => document.querySelectorAll('.remove-button').forEach(i => i.remove());

    const displayAllItems = () => {
        const items = todoList.getAllTodoItems();
        items.forEach((item, idx) => {
            const card = fillCardTemplate(item, idx);
            cardsElement.insertAdjacentHTML('beforeend', card);
        });
        removeAddTaskButton();
        addEventsToToggleCardVisibility();
        removeRemoveButton();
    }

    const removeItemsFromCurrentlySelectedList = () => {
        removeAllCardsChildren();
    }

    const addItemsToCurrentlySelectedList = () => {
        addAddTaskButton();

        const selectedId = getSelectedElementId();
        const items = todoList.getItemsFromList(selectedId);
        items.forEach((item, idx) => {
            const card = fillCardTemplate(item, idx);
            cardsElement.insertAdjacentHTML('beforeend', card);
        });
        addEventsToToggleCardVisibility();
        addEventsForCardRemove();
    }

    const handleAddItemSubmitButton = () => {
        const form = getAddItemForm().querySelector('form');
        
        const title = form.querySelector('input[id="title"]').value;
        const desc = form.querySelector('input[id="desc"]').value;
        const dueDate = form.querySelector('input[id="duedate"').value;
        const priority = form.querySelector('input[type="radio"]:checked').value;
        const notes = form.querySelector('textarea').value;

        const selectedElementId = getSelectedElementId();
        glue.parseItemAndAddToList({title, desc, dueDate, priority, notes}, selectedElementId);

        getAddItemForm().remove();

        removeItemsFromCurrentlySelectedList();
        addItemsToCurrentlySelectedList();
    }

    const handleAddItemButtons = () => {
        const submitButton = document.querySelector('.add-item-form .add-item-submit');
        const closeButton = document.querySelector('.add-item-form .add-item-close');

        closeButton.addEventListener('click', () => {
            getAddItemForm().remove();
        })

        submitButton.addEventListener('click', handleAddItemSubmitButton);
    }

    const addEventsToAddTaskButton = () => {
        getAddTaskButton().addEventListener('click', () => {
            if (!getAddItemForm()) {
                main.insertAdjacentHTML('beforeend', addItemFormTemplate);
                handleAddItemButtons();
            }
        })
    }

    const addAddTaskButton = () => {
        const addTaskButton = document.createElement('button');
        addTaskButton.setAttribute('type', 'button');
        addTaskButton.classList.add('card');
        addTaskButton.classList.add('add-task');
        addTaskButton.textContent = '+ Add Task';

        getCardsElement().appendChild(addTaskButton);
        addEventsToAddTaskButton();
    }

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

    const selectClickedButton = (e) => {
        e.target.classList.add('selected');
        removeItemsFromCurrentlySelectedList();
        addItemsToCurrentlySelectedList();
    }

    const removeAllLists = () => {
        getButtons().forEach(i => i.remove());
    }

    const handleAddListButtons = () => {
        const submitButton = document.querySelector('.add-list-window .add-list-submit');
        const closeButton = document.querySelector('.add-list-window .add-list-close');

        closeButton.addEventListener('click', () => {
            getAddListWindow().remove();
            displayAllItems();
        })

        submitButton.addEventListener('click', () => {
            const input = getAddListWindow().querySelector('input');
            const inputValue = input.value;
            if(!inputValue) return;

            glue.addToListAndDraw(inputValue);
            getAddListWindow().remove();
            removeAddTaskButton();
            displayAllItems();
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

            // due to some bug i cannot fix
            removeAllCardsChildren();
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
        drawListButtons, addEventsToAddListButton, removeAllLists, displayAllItems,
    };
}();

const todoList = function() {
    let list = {};

    list = {
        'inbox': [
            new todoItem('Take a walk', 'A long Walk...', '2023-09-01', 'mid','With my ferret'),
            new todoItem('Brush teeth', 'I got a new tooth paste to try out', '2023-11-28', 'low','best to brush them while pooping to not waste time'),
            new todoItem('Buy gucci flip flops', 'gotta flex on dem ho*s', '2024-11-31', 'urgent','buy a an off white tee for double flexerino'),

        ],
        'today': [
            new todoItem('Learn JavaScript', '', '2023-11-01', 'mid',''),
        ],
        'week': [
            new todoItem('Clean my room', '', '2023-08-01', 'mid',''),
        ],
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

    const addItemToList = (arr, listName) => {
        list[listName].push(new todoItem(...arr));
    }

    const getItemsFromList = (listName) => list[listName]; 

    const removeItem = (listName, index) => {
        list[listName].splice(index, 1);
    };

    return { getNamesOfLists, addNewList, getAllTodoItems, addItemToList, addItemToList, getItemsFromList, removeItem };
}();

const glue = function() {
    const parseItemAndAddToList = (obj, listName) => {
        arr = [];
        for (const key in obj) {
            arr.push(obj[key]);
        }
        todoList.addItemToList(arr, listName);
    }

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
        displayController.displayAllItems();
    }();

    return { addToListAndDraw, parseItemAndAddToList };
    
}();