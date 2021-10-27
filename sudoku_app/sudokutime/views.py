from django.shortcuts import render

# Create your views here.
def index(request):
    from .utils.generate_sudoku import generate_sudoku
    new_sudoku, new_sudoku_solved = generate_sudoku()
    
    boxes = []
    for i in range(9):
        off = (i % 3) * 3 + (i - (i % 3)) * 9
        new_box = new_sudoku[0+off:3+off] + new_sudoku[9+off:12+off] + new_sudoku[18+off:21+off]
        row = int(i//3) + 1
        col = i % 3 + 1
        grid_area = f'grid-area: {row}/{col}/{row + 1}/{col + 1}'
        boxes.append({'box': new_box, 'grid_area': grid_area})

    args = {'new_sudoku': new_sudoku, 'new_sudoku_solved': new_sudoku_solved, 'boxes': boxes}
    return render(request, 'index.html', args)