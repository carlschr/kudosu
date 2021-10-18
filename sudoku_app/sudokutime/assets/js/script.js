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

    let selected = null;

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

    document.addEventListener('keyup', event => {
        if (!selected || selected.className.includes('given')) return;

        let key = event.key;
        let digits = '123456789';

        if (key === 'Backspace'){
            selected.textContent = '';
            return;
        };

        if (digits.includes(key)){
            selected.textContent = key;
        };
    });
};

init();