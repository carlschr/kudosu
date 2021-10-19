function init() {
    //Example sudoku string
    let sudoku = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'.split('');
    
    // Store actions in undo and redo stacks
    let undoStack = [];
    let redoStack = [];
    
    // Function to add an action to the undo stack
    function addAction(el, prevText, newText, prevType='answer', newType='answer'){
        undoStack.push({
            element: el,
            prevText: prevText,
            newText: newText,
            prevType: prevType,
            newType: newType
        });
        redoStack = [];
    };
    
    // Function to undo an action
    function undo(){
        let action = undoStack.pop();
        redoStack.push(action);
        action.element.textContent = action.prevText;
    };
    
    // Function to redo an action
    function redo(){
        let action = redoStack.pop();
        undoStack.push(action);
        action.element.textContent = action.newText;
    };
    
    // Undo and redo elements
    let undoEl = document.querySelector('.undo');
    let redoEl = document.querySelector('.redo');

    // Undo click listener
    undoEl.addEventListener('click', () => {
        if (undoStack.length === 0) return;
        undo();
    });

    // Redo click listener
    redoEl.addEventListener('click', () => {
        if (redoStack.length === 0) return;
        redo();
    });

    // Adds the nine boxes of the sudoku grid to the DOM
    let gridEl = document.querySelector('.grid');
    for (let i = 0; i < 9; i++){
        let box = document.createElement('div');
        box.setAttribute('class', 'box');
        box.setAttribute('data-box', i);
        let row = Math.floor(i/3) + 1;
        let col = i % 3 + 1;
        box.style.gridArea = `${row}/${col}/${row + 1}/${col + 1}`;
        gridEl.append(box);
    };

    // Adds the cells of the sudoku grid to the DOM using a sudoku string
    let boxEls = document.querySelectorAll('.box');
    sudoku.forEach((num, i) => {
        let row = Math.floor(i/9);
        let col = i % 9;
        let box = Math.floor(col/3) + Math.floor(row/3) * 3;
        let cell = document.createElement('button');
        cell.setAttribute('class', (num === '.') ? 'cell' : 'cell given');
        cell.setAttribute('data-cell', i);
        cell.setAttribute('data-pencil', '');
        cell.textContent = (num === '.') ? '' : num;
        boxEls[box].append(cell);
    });

    // Declares a variable to store the currently selected cell
    let selected = null;

    // Click listener to assign a cell to the selected variable
    // and change stylings accordingly
    gridEl.addEventListener('click', event => {
        let el = event.target;
        if (el.className.includes('given')) return;
        if (el.className.includes('cell')){
            if (el.className.includes('cell-active')) {
                el.className = 'cell';
                selected = null;
            } else {
                el.className = 'cell cell-active';
                if (selected) selected.className = 'cell';
                selected = el;
            };
        };
    });

    // Listener to enable user input of numbers with keyboard
    document.addEventListener('keyup', event => {
        if (!selected || selected.className.includes('given')) return;
        let prevText = selected.textContent;

        let key = event.key;
        let digits = '123456789';

        if (key === 'Backspace'){
            selected.textContent = '';
            addAction(selected, prevText, '')
            return;
        };
        
        if (digits.includes(key)){
            selected.textContent = key;
            addAction(selected, prevText, key)
        };
    });

    // Allows user input of numbers with number button elements
    let numbers = document.querySelectorAll('button.number');
    numbers.forEach(num => {
        num.addEventListener('click', event => {
            if (!selected) return;
            let prevText = selected.textContent;

            if (selected.textContent === event.target.textContent) {
                selected.textContent = '';
                addAction(selected, prevText, '');
                return;
            };
            selected.textContent = event.target.textContent;
            addAction(selected, prevText, event.target.textContent);
        });
    });

    // Answer type buttons
    let pencilButton = document.querySelector('.pencil-mark');
    let answerButton = document.querySelector('.answer');

    // Listeners to toggle type selection on click
    pencilButton.addEventListener('click', event => {
        if (event.target.className.includes('active')) {
            event.target.className = 'pencil-mark';
            answerButton.className = 'answer active';
        } else {
            event.target.className = 'pencil-mark active';
            answerButton.className = 'answer';
        };
    });
    answerButton.addEventListener('click', event => {
        if (event.target.className.includes('active')) {
            event.target.className = 'answer';
            pencilButton.className = 'pencil-mark active';
        } else {
            event.target.className = 'answer active';
            pencilButton.className = 'pencil-mark';
        };
    });
};

init();