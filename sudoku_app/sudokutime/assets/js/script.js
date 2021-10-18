function init() {    
    let sudoku = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'.split('');
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

    let boxEls = document.querySelectorAll('.box');

    sudoku.forEach((num, i) => {
        let row = Math.floor(i/9);
        let col = i % 9;
        let box = Math.floor(col/3) + Math.floor(row/3) * 3;
        let cell = document.createElement('button');
        cell.setAttribute('class', (num === '.') ? 'cell' : 'cell given');
        cell.setAttribute('data-cell', i);
        cell.textContent = (num === '.') ? '' : num;
        boxEls[box].append(cell);
    });

    let lastSelected = null;

    gridEl.addEventListener('click', event => {
        let el = event.target;
        if (el.className.includes('cell')){
            lastSelected = el;
        };
    });

    document.addEventListener('keyup', event => {
        let key = event.key;
        let digits = '123456789';
        if (lastSelected && key === 'Backspace'){
            lastSelected.textContent = '';
            return;
        };
        if (digits.includes(key) && lastSelected && !lastSelected.className.includes('given')){
            lastSelected.textContent = key;
        };
    });
};

init();