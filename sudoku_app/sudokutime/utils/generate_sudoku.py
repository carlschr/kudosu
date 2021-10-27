import random
from .Data_Structures.DLX import DLX

# helper function to check if a string can be converted to int
def valid_integer(string):
    try:
        int(string)
        return True
    except ValueError:
        return False

# function to check sudoku rules for an input
def check_valid_num(puzzle, num, coord):
    # determine starting points for the sudoku square
    square_y = coord[0] - (coord[0] % 3)
    square_x = coord[1] - (coord[1] % 3)

    # check validity in row
    if puzzle[coord[0]].count(num) != 0:
        return False
    # check validity in column
    if [row[coord[1]] for row in puzzle].count(num) != 0:
        return False
    # check validity in square
    for i in range(3):
        for j in range(3):
            if puzzle[square_y + i][square_x + j] == num:
                return False

    return True

# checks if a sudoku is solvable
def check_sudoku(puzzle_str):
    cover = DLX(puzzle_str)
    cover.solve()
    return cover.at_least_one_solution and not cover.multiple_solutions

# function to create a filled puzzle
def generate_puzzle():
    # initalizes empty puzzle with a tile counter set to 0
    new_puzzle = {
        'puzzle': [[0 for i in range(9)] for j in range(9)],
        'current_space': 0
    }

    # recursive function to build upon above puzzle
    def build_sudoku():
        space = new_puzzle['current_space']
        # the counter being at 81 indicates that the puzzle is full
        if space == 81:
            return
        # creates coordinates of current tile from counter
        coord = [int(space//9), space % 9]

        # shuffled list of nums 1-9
        num_list = list(range(1, 10))
        random.shuffle(num_list)

        # tries nums 1-9 in random order at current tile
        for num in num_list:
            if new_puzzle['current_space'] == 81:
                return
            if check_valid_num(new_puzzle['puzzle'], num, coord):
                new_puzzle['puzzle'][coord[0]][coord[1]] = num
                new_puzzle['current_space'] += 1
                build_sudoku()

        # when the puzzle is full there is no need for resets as the function unwinds
        if new_puzzle['current_space'] == 81:
            return

        # sets current tile back to 0 and rewinds counter before backtracking
        new_puzzle['puzzle'][coord[0]][coord[1]] = 0
        new_puzzle['current_space'] -= 1
        return
    
    build_sudoku()
    return ''.join([''.join([str(n) for n in m]) for m in new_puzzle['puzzle']])

# function to create a sudoku with missing tiles that is solvable
def generate_sudoku():
    solved_puzzle = generate_puzzle()
    puzzle = '0' * 81

    # Makes sure there are at least twenty filled tiles
    counter = 0
    while counter < 21:
        cell = random.randint(0, 80)
        cell_digit = int(puzzle[cell:cell + 1])

        if cell_digit != 0:
            continue

        puzzle = puzzle[0:cell] + solved_puzzle[cell:cell + 1] + puzzle[cell + 1:]
        counter += 1

    # Fills tiles until the puzzle is solvable
    while not check_sudoku(puzzle):
        cell = random.randint(0, 80)
        cell_digit = int(puzzle[cell:cell + 1])

        if cell_digit != 0:
            continue

        puzzle = puzzle[0:cell] + solved_puzzle[cell:cell + 1] + puzzle[cell + 1:]
    
    return puzzle, solved_puzzle

new_sudoku, new_sudoku_solved = generate_sudoku()