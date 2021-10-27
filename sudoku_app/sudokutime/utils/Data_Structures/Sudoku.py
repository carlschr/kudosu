class Sudoku:
    def __init__(self, sudoku_string):
        self.size = int(len(sudoku_string) ** .5)
        self.grid = [[0 for _ in range(self.size)] for _ in range(self.size)]
        for i, char in enumerate(sudoku_string):
            row = int(i//self.size)
            col = i % self.size
            self.grid[row][col] = int(char)
    
    def __repr__(self) -> str:
        r = ''
        for row in self.grid:
            r += f'\n{row}'
        return r

if __name__ == '__main__':
    test_sudoku = Sudoku('530070000600195000098000060800060003400803001700020006060000280000419005000080079')
    print(f'Test Sudoku: {test_sudoku}')