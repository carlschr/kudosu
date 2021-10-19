function init() {
    //Example sudoku string
    let sudoku = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'.split('');
    
    // Store actions in undo and redo stacks
    let undoStack = [];
    let redoStack = [];
    let currentType = 'answer';
    
    // Function to add an action to the undo stack
    function addAction(el, prevText, newText, prevMark, newMark){
        undoStack.push({
            element: el,
            prevText: prevText,
            newText: newText,
            prevMark: prevMark,
            newMark: newMark
        });
        redoStack = [];
    };
    
    // Function to undo an action
    function undo(){
        let action = undoStack.pop();
        redoStack.push(action);
        action.element.textContent = action.prevText;
        action.element.dataset.pencil = action.prevMark;
    };
    
    // Function to redo an action
    function redo(){
        let action = redoStack.pop();
        undoStack.push(action);
        action.element.textContent = action.newText;
        action.element.dataset.pencil = action.newMark;
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
        if (currentType === 'answer' && selected.dataset.pencil) return;
        if (currentType === 'pencil-mark' && selected.textContent) return;

        let prevText = selected.textContent;
        let prevMark = selected.dataset.pencil;

        let key = event.key;
        let digits = '123456789';

        if (selected.dataset.pencil.includes(key)) {
            let newMark = prevMark.slice(0, prevMark.indexOf(key)) + prevMark.slice(prevMark.indexOf(key) + 1);
            let newText = prevText;

            selected.textContent = newText;
            selected.dataset.pencil = newMark;
            addAction(selected, prevText, newText, prevMark, newMark);
            return;
        };

        if (key === 'Backspace'){
            let newText = (currentType === 'answer') ? '' : prevText;
            let newMark = (currentType === 'pencil-mark') ? prevMark.slice(0, prevMark.length - 1) : prevMark;

            selected.textContent = newText;
            selected.dataset.pencil = newMark;
            addAction(selected, prevText, newText, prevMark, newMark);
            return;
        };
        
        if (digits.includes(key)){
            let newText = (currentType === 'answer') ? key : prevText;
            let newMark = (currentType === 'pencil-mark') ? prevMark + key : prevMark;

            if (selected.textContent === key) newText = '';

            selected.textContent = newText;
            selected.dataset.pencil = newMark;
            addAction(selected, prevText, newText, prevMark, newMark);
        };
    });

    // Allows user input of numbers with number button elements
    let numbers = document.querySelectorAll('button.number');
    numbers.forEach(num => {
        num.addEventListener('click', event => {
            if (!selected) return;
            if (currentType === 'answer' && selected.dataset.pencil) return;
            if (currentType === 'pencil-mark' && selected.textContent) return;
            let prevText = selected.textContent;
            let prevMark = selected.dataset.pencil;
            let val = event.target.textContent;

            if (selected.textContent === val || prevMark.includes(val)) {
                let newText = (currentType === 'answer') ? '' : prevText;
                let newMark = (currentType === 'pencil-mark') ? prevMark.slice(0, prevMark.indexOf(val)) + prevMark.slice(prevMark.indexOf(val) + 1) : prevMark;

                selected.textContent = newText;
                selected.dataset.pencil = newMark;
                addAction(selected, prevText, newText, prevMark, newMark);
                return;
            };
            let newText = (currentType === 'answer') ? val : prevText;
            let newMark = (currentType === 'pencil-mark') ? prevMark + val : prevMark;

            selected.textContent = newText;
            selected.dataset.pencil = newMark;
            addAction(selected, prevText, newText, prevMark, newMark);
        });
    });

    // Answer type buttons
    let pencilButton = document.querySelector('.pencil-mark');
    let answerButton = document.querySelector('.answer');

    function toggle(event){
        if (event.target.className.includes('pencil-mark')) {
            answerButton.className = 'answer';
            pencilButton.className = 'pencil-mark active';
            currentType = 'pencil-mark';
        } else {
            answerButton.className = 'answer active';
            pencilButton.className = 'pencil-mark';
            currentType = 'answer';
        };
    }
    // Listeners to toggle type selection on click
    pencilButton.addEventListener('click', toggle);
    answerButton.addEventListener('click', toggle);
};

init();