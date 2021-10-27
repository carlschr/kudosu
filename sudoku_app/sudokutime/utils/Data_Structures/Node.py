class Node:
    def __init__(self, row, col):
        self.row = row
        self.col = col
        self.up = self
        self.down = self
        self.right = self
        self.left = self

    def add_right(self, node):
        node.right = self.right
        node.left = self
        self.right.left = node
        self.right = node

    def removeUD(self):
        self.down.up = self.up
        self.up.down = self.down

    def reinsertUD(self):
        self.down.up = self
        self.up.down = self

    def __repr__(self) -> str:
        return f'[{self.row}, {self.col}]'


if __name__ == '__main__':
    test_node = Node(1, 5)
    print(f'Test Node: {test_node}')