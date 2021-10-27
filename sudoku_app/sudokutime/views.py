from django.shortcuts import render

# Create your views here.
def index(request):
    from .utils.generate_sudoku import new_sudoku, new_sudoku_solved
    args = {'new_sudoku': new_sudoku, 'new_sudoku_solved': new_sudoku_solved}
    return render(request, 'index.html', args)