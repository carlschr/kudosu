function init() {  
    // Store actions in undo and redo stacks
    let undoStack = [];
    let redoStack = [];
    let currentType = 'answer';

    // Accesses the grid element
    let gridEl = document.querySelector('.grid');
    
    // Function to add an action to the undo stack
    function addAction(prevGrid, newGrid){
        undoStack.push({
            prevGrid,
            newGrid,
        });
        redoStack = [];
    };
    
    // Function to undo an action
    function undo(){
        let action = undoStack.pop();
        redoStack.push(action);
        gridEl.innerHTML = action.prevGrid;
        assignListeners();
        removeActive();
    };
    
    // Function to redo an action
    function redo(){
        let action = redoStack.pop();
        undoStack.push(action);
        gridEl.innerHTML = action.newGrid;
        assignListeners();
        removeActive();
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


    // Declares a variable to store the currently selected cell
    let selected = [];
    let selectAllowed = false;

    function toggleCell(event) {
        if (!selectAllowed) return;
        let el = event.target;
        if (el.className.includes('given')) return;

        if (el.className.includes('cell-active')) {
            el.className = 'cell';
        } else {
            el.className = 'cell cell-active';
            selected.push(el);
        };
        selected = selected.filter(cell => cell.className === 'cell cell-active')
    };

    function assignListeners () {
        // Click listener to assign a cell to the selected variable
        // and change stylings accordingly
        gridEl = document.querySelector('.grid');
        Array.from(gridEl.children).forEach(box => {
            Array.from(box.children).forEach(cell => {
                cell.addEventListener('mouseover', toggleCell);
                cell.addEventListener('mousedown', event => {
                    if (!selected) return;
                    let length = selected.length;
                    selected.forEach(el => {
                        if (el === event.target && length === 1) return;
                        el.className = 'cell';
                    });
                    selected = selected.filter(cell => cell.className === 'cell cell-active');
                    selectAllowed = true, toggleCell(event);
                });
                cell.addEventListener('mouseup', () => selectAllowed = false);
            });
        });
    };
    assignListeners();

    function removeActive() {
        let cells = document.querySelectorAll('.cell');
        Array.from(cells).forEach(cell => cell.className = (cell.className !== 'cell given') ? 'cell' : 'cell given');
    };

    gridEl.addEventListener('mouseleave', () => selectAllowed = false);

    // Listener to enable user input of numbers with keyboard
    document.addEventListener('keyup', event => {
        if (event.key === "Shift") return toggleType();

        // Flags for aborting early
        if (!selected) return;

        // Constant values
        const key = event.key;
        const digits = '123456789';
        const prevGrid = gridEl.innerHTML;

        selected.forEach(cell => {
            // Previous values
            let prevText = cell.textContent;
            let prevMark = cell.dataset.pencil;

            // Code for if the user presses backspace
            if (key === 'Backspace'){
                let newText =  '';
                let newMark = prevMark.slice(0, prevMark.length - 1);

                cell.textContent = newText;
                cell.dataset.pencil = newMark;
                return;
            };

            // Flags for aborting early
            if (currentType === 'pencil-mark' && cell.textContent) return;

            // Code for if the pencil mark already has the digit
            if (cell.dataset.pencil.includes(key) && currentType === 'pencil-mark') {
                let newMark = prevMark.slice(0, prevMark.indexOf(key)) + prevMark.slice(prevMark.indexOf(key) + 1);
                let newText = prevText;

                cell.textContent = newText;
                cell.dataset.pencil = newMark;
                return;
            };
   
            // Code for if the user presses a valid digit
            if (digits.includes(key)){
                let newText = (currentType === 'answer') ? key : prevText;
                let newMark = (currentType === 'pencil-mark') ? prevMark + key : '';

                if (cell.textContent === key) newText = '';

                cell.textContent = newText;
                cell.dataset.pencil = newMark;
            };
        });

        let newGrid = gridEl.innerHTML;
        addAction(prevGrid, newGrid);
    });

    // Allows user input of numbers with number button elements
    let numbers = document.querySelectorAll('button.number');
    numbers.forEach(num => {
        num.addEventListener('click', event => {
            if (!selected) return;
            let prevGrid = gridEl.innerHTML;
            let val = event.target.textContent;
            
            selected.forEach(cell => {
                if (currentType === 'pencil-mark' && cell.textContent) return;
                let prevText = cell.textContent;
                let prevMark = cell.dataset.pencil;
    
                // new values
                let newText = (currentType === 'answer' && cell.textContent !== val) 
                              ? val 
                              : (currentType === 'answer') 
                              ? '' 
                              : prevText;
    
                let newMark = (currentType === 'pencil-mark' && !prevMark.includes(val)) 
                              ? prevMark + val 
                              : (currentType === 'pencil-mark') 
                              ? prevMark.slice(0, prevMark.indexOf(val)) + prevMark.slice(prevMark.indexOf(val) + 1) 
                              : '';
    
                cell.textContent = newText;
                cell.dataset.pencil = newMark;
            });

            let newGrid = gridEl.innerHTML;
            addAction(prevGrid, newGrid);
        });
    });

    // Answer type buttons
    let pencilButton = document.querySelector('.pencil-mark');
    let answerButton = document.querySelector('.answer');

    // Funtion that toggles active classes
    function toggleType(){
        if (answerButton.className.includes('active')) {
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
    pencilButton.addEventListener('click', toggleType);
    answerButton.addEventListener('click', toggleType);

    let checkButton = document.querySelector('.check');
    function checkSudoku(){
        let solved = true;
        let boxes = document.querySelectorAll('.box');
        Array.from(boxes).forEach(box => {
            let answer = Array.from(box.children).map(cell => cell.textContent).join('');
            if (answer !== box.dataset.solved) solved = false;
        });
        return solved;
    };
    checkButton.addEventListener('click', () => {
        let solved = checkSudoku();
        let message = document.querySelector('.grid-message');
        message.style.visibility = 'visible';
        if (solved) {
            message.textContent = 'You solved it! Great job!';
        } else {
            message.textContent = 'Not quite right! Keep trying!';
        };
    });

    let helpButton = document.querySelector('.help');
    function displayHelp(){
        let content = `
        <h1>The rules of Sudoku are as follows:</h1>
        <p>Each row, column, and bax must contain the digits 1 through 9.</p>
        `;
        let message = document.querySelector('.grid-message');
        message.innerHTML = content;
        message.style.visibility = 'visible';
    }
    helpButton.addEventListener('click', displayHelp);

    gridEl.addEventListener('click', () => {
        let message = document.querySelector('.grid-message');
        if (message.style.visibility === 'hidden') return;
        message.style.visibility = 'hidden';
    });
};

init();