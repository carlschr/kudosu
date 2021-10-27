if __name__ == '__main__':
    from Node import Node
    from Sudoku import Sudoku
    from Column import ColumnNode
else:
    from .Node import Node
    from .Sudoku import Sudoku
    from .Column import ColumnNode
import matplotlib.pyplot as plt

class DLX:
    def __init__(self, sudoku_string):
        self.solution = []
        self.multiple_solutions = None

        # creates sudoku and defines constants
        self.sudoku = Sudoku(sudoku_string)
        CELL_COUNT = self.sudoku.size ** 2
        CONSTRAINTS = 4
        DIGITS = ROW_SIZE = COL_SIZE = self.sudoku.size
        BOX_COL_SIZE = BOX_ROW_SIZE = int(self.sudoku.size ** .5)

        # initializes empty matrix
        self.matrix = [[0 for _ in range(CELL_COUNT * CONSTRAINTS)] for _ in range(CELL_COUNT * DIGITS)]

        # creates columns and connects them
        self.columns = [ColumnNode(-1, i) for i in range(-1, CELL_COUNT * CONSTRAINTS)]
        for i in range(len(self.columns) - 1):
            self.columns[i].add_right(self.columns[i + 1])

        # sets head node for matrix
        self.header = self.columns[0]

        # loops through rows to assign constraints
        for index, row in enumerate(self.matrix):
            i = index

            # cells change every 9 rows
            cell_number = int(i//DIGITS)
            # sudoku rows change every 81 rows
            row_number = int(i//(DIGITS * ROW_SIZE))
            # sudoku columns change for every cell and reset every 9 cells
            col_number = cell_number % COL_SIZE
            # sudoku boxes are calculated by taking the lower row of the box (0,3, or 6) plus the column grouping (1,2, or 3)
            # result is one of nine boxes (0 through 8)
            box_number = int(row_number - (row_number % BOX_COL_SIZE) + col_number//BOX_ROW_SIZE)

            # if the sudoku cell is given, only one option will be created
            # this ensures that the given cells will be part of the solution
            if self.sudoku.grid[row_number][col_number] != 0:
                i = (cell_number * DIGITS) + self.sudoku.grid[row_number][col_number] - 1
                if i != index:
                    continue

            # cell constraint gets placed in the corresponding column for the cell number 1-81
            cell_i = cell_number
            cell_node = Node(index, cell_i)
            row[cell_i] = cell_node

            # row constraint gets placed in 9 by 9 diagonals that are offset by 9 times the row number (0 through 8)
            # the whole row constraint grid is offset by 81
            ROW_CONSTRAINT_OFFSET = 1 * CELL_COUNT
            row_i = ((row_number * DIGITS) + (i % DIGITS)) + ROW_CONSTRAINT_OFFSET
            row_node = Node(index, row_i)
            row[row_i] = row_node
         
            # col constraint gets placed in 81 by 81 diagonals that repeat without an additional offset
            # the whole col constraint grid is offset by 162
            COL_CONSTRAINT_OFFSET = 2 * CELL_COUNT
            col_i = (i % (ROW_SIZE * DIGITS)) + COL_CONSTRAINT_OFFSET
            col_node = Node(index, col_i)
            row[col_i] = col_node
          
            # box constraint gets placed in 9 by 9 diagonals that are offset by 9 times the box number (0 through 8)
            # the box constraint grid is offset by 243
            BOX_CONSTRAINT_OFFSET = 3 * CELL_COUNT
            box_i = ((box_number * DIGITS) + (i % DIGITS)) + BOX_CONSTRAINT_OFFSET
            box_node = Node(index, box_i)
            row[box_i] = box_node

            # connects row
            cell_node.add_right(row_node)
            row_node.add_right(col_node)
            col_node.add_right(box_node)

            # adds nodes to columns
            COLS_INDEX_OFFSET = 1
            self.columns[cell_i + COLS_INDEX_OFFSET].add(cell_node)
            self.columns[row_i + COLS_INDEX_OFFSET].add(row_node)
            self.columns[col_i + COLS_INDEX_OFFSET].add(col_node)
            self.columns[box_i + COLS_INDEX_OFFSET].add(box_node)

    def solve(self, depth=0):
        # print(self.solution)
        # self.print_cols()
        if self.header.right == self.header or depth == self.sudoku.size ** 2:
            self.at_least_one_solution = True
            self.multiple_solutions = False if self.multiple_solutions == None else True
            if self.multiple_solutions:
                return
            self.solved = [n for n in self.solution]
            # print(self.solution)
        col = self.find_col()
        col.cover()
        current_sol = col.down
        while current_sol != col:
            self.solution.append(current_sol)
            sol_node = current_sol.right
            while sol_node != current_sol:
                sol_node.parent.cover()
                sol_node = sol_node.right
            
            self.solve(depth + 1)

            if self.multiple_solutions:
                return

            current_sol = self.solution.pop()
            col = current_sol.parent

            sol_node = current_sol.left
            while sol_node != current_sol:
                sol_node.parent.uncover()
                sol_node = sol_node.left
            
            current_sol = current_sol.down

        col.uncover()
        
    def find_col(self):
        min_col = self.header.right
        current = self.header.right.right
        while current != self.header:
            if current.size < min_col.size:
                min_col = current
            current = current.right
        return min_col

    def __repr__(self) -> str:
        r = ''
        for i in range(len(self.matrix)):
            row = ''
            for j in range(len(self.matrix[0])):
                current =  self.matrix[i][j]
                if current != 0:
                    row += str(current)
            r += f'\n{row if row != "" else "empty"}'
        return r
    
    def print_cols(self):
        start = self.header
        print(start)
        current = start.right
        while current != start:
            print(current)
            current = current.right

if __name__ == '__main__':
    sudoku_string = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'
    test_cover = DLX(sudoku_string)
    # print(f'Test Cover Matrix: {test_cover}')
    print(f'\nTest Sudoku: {test_cover.sudoku}')
    print(f'\nTest Cover Head: {test_cover.header}')
    print(f'\nTest Traversal (right): {test_cover.header.right}')
    print(f'\nTest Traversal (left): {test_cover.header.left}')
    print(f'\nTest Traversal (up): {test_cover.header.up}')
    print(f'\nTest Traversal (down): {test_cover.header.down}')

    test_cover.solve()
    solution = test_cover.solved
    if not test_cover.multiple_solutions:
        for i, node in enumerate(solution):
            matrix_row = node.row
            cell = matrix_row//9
            sudoku_string = sudoku_string[:cell] + str((matrix_row % 9) + 1) + sudoku_string[cell + 1:]
        print(f'\nTest Solution: {Sudoku(sudoku_string)}')
    else:
        print('\nSudoku is unsolvable due to multiple solutions.')

    x1 = []
    y1 = []
    x2 = []
    y2 = []
    x3 = []
    y3 = []
    x4 = []
    y4 = []
    for i, _ in enumerate(test_cover.matrix):
        for j, _ in enumerate(test_cover.matrix[0]):
            if test_cover.matrix[i][j] != 0:
                current = test_cover.matrix[i][j]
                if current.col < 81:
                    y1.append(729 - i)
                    x1.append(j)
                    continue
                if current.col < 162:
                    y2.append(729 - i)
                    x2.append(j)
                    continue
                if current.col < 243:
                    y3.append(729 - i)
                    x3.append(j)
                    continue
                y4.append(729 - i)
                x4.append(j)
    plt.scatter(x1, y1, marker='.', c='black')
    plt.scatter(x2, y2, marker='.', c='blue')
    plt.scatter(x3, y3, marker='.', c='green')
    plt.scatter(x4, y4, marker='.', c='red')
    plt.xlabel('x - axis')
    plt.ylabel('y - axis')
    plt.title('Cover Matrix')
    plt.show()