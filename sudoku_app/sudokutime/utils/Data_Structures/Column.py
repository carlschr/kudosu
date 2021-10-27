if __name__ == '__main__':
    from Node import Node
else:
    from .Node import Node

class ColumnNode(Node):
    def __init__(self, row, col):
        super().__init__(row, col)
        self.size = 1

    def add(self, node):
        node.parent = self
        node.up = self.up
        node.down = self
        self.up.down = node
        self.up = node
        self.size += 1

    def removeRL(self):
        self.right.left = self.left
        self.left.right = self.right

    def reinsertRL(self):
        self.right.left = self
        self.left.right = self

    def cover(self):
        # print(f'covering column: {self.col}')
        self.removeRL()
        current = self.down
        while current != self:
            row_node = current.right
            while row_node != current:
                row_node.removeUD()
                row_node.parent.size -= 1
                row_node = row_node.right
            current = current.down

    def uncover(self):
        # print(f'uncovering column: {self.col}')
        current = self.up
        while current != self:
            row_node = current.left
            while row_node != current:
                row_node.reinsertUD()
                row_node.parent.size += 1
                row_node = row_node.left
            current = current.up
        self.reinsertRL()

    def __repr__(self) -> str:
        string = ''
        current_node = self.down
        for _ in range(self.size - 1):
            string += str(current_node)
            current_node = current_node.down
        return f'[{self.row}, {self.col}]{string}'

if __name__ == '__main__':
    test_column = ColumnNode(0, 0)
    for i in range(1, 9):
        new_node = Node(i, 0)
        test_column.add(new_node)
    print(f'Test Column: {test_column}')