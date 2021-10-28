function init() {  
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

    // Accesses the grid element
    let gridEl = document.querySelector('.grid');

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
        if (event.key === "Shift") return toggle();

        // Flags for aborting early
        if (!selected || selected.className.includes('given')) return;

        // Current values
        let prevText = selected.textContent;
        let prevMark = selected.dataset.pencil;
        let key = event.key;
        let digits = '123456789';

        // Code for if the user presses backspace
        if (key === 'Backspace'){
            let newText =  '';
            let newMark = prevMark.slice(0, prevMark.length - 1);

            selected.textContent = newText;
            selected.dataset.pencil = newMark;
            addAction(selected, prevText, newText, prevMark, newMark);
            return;
        };

        // Flags for aborting early
        if (currentType === 'pencil-mark' && selected.textContent) return;

        // Code for if the pencil mark already has the digit
        if (selected.dataset.pencil.includes(key) && currentType === 'pencil-mark') {
            let newMark = prevMark.slice(0, prevMark.indexOf(key)) + prevMark.slice(prevMark.indexOf(key) + 1);
            let newText = prevText;

            selected.textContent = newText;
            selected.dataset.pencil = newMark;
            addAction(selected, prevText, newText, prevMark, newMark);
            return;
        };

        
        // Code for if the user presses a valid digit
        if (digits.includes(key)){
            let newText = (currentType === 'answer') ? key : prevText;
            let newMark = (currentType === 'pencil-mark') ? prevMark + key : '';

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
            // Flags to abort early
            if (!selected) return;
            if (currentType === 'pencil-mark' && selected.textContent) return;

            // Current values
            let prevText = selected.textContent;
            let prevMark = selected.dataset.pencil;
            let val = event.target.textContent;

            // new values
            let newText = (currentType === 'answer' && selected.textContent !== val) 
                          ? val 
                          : (currentType === 'answer') 
                          ? '' 
                          : prevText;

            let newMark = (currentType === 'pencil-mark' && !prevMark.includes(val)) 
                          ? prevMark + val 
                          : (currentType === 'pencil-mark') 
                          ? prevMark.slice(0, prevMark.indexOf(val)) + prevMark.slice(prevMark.indexOf(val) + 1) 
                          : '';

            selected.textContent = newText;
            selected.dataset.pencil = newMark;
            addAction(selected, prevText, newText, prevMark, newMark);
        });
    });

    // Answer type buttons
    let pencilButton = document.querySelector('.pencil-mark');
    let answerButton = document.querySelector('.answer');

    // Funtion that toggles active classes
    function toggle(){
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
    pencilButton.addEventListener('click', toggle);
    answerButton.addEventListener('click', toggle);
};

init();