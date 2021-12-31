class GameGrid {
    RowCleared;
    UpdateScore;
    constructor(rows, columns) {
        this.Rows = rows;
        this.Columns = columns;
        this.Grid = [];
        for (let i = 0; i < rows; i++) {
            this.Grid[i] = [];
            for (let j = 0; j < columns; j++) {
                this.Grid[i][j] = 0;
            }
        }
    }

    IsInside(row, column) {
        return row >= 0 && row < this.Rows && column >= 0 && column < this.Columns;
    }

    IsEmpty(row, column) {
        return this.IsInside(row, column) && this.Grid[row][column] == 0;
    }

    IsRowFull(row) {
        for (let column = 0; column < this.Columns; column++) {
            if (this.Grid[row][column] == 0) {
                return false;
            }
        }

        return true;
    }

    IsRowEmpty(row) {
        for (let column = 0; column < this.Columns; column++) {
            if (this.Grid[row][column] != 0) {
                return false;
            }
        }

        return true;
    }

    ClearRow(row) {
        for (let column = 0; column < this.Columns; column++) {
            this.Grid[row][column] = 0;
        }
    }

    MoveRowDown(row, howManyRows) {
        for (let column = 0; column < this.Columns; column++) {
            this.Grid[row + howManyRows][column] = this.Grid[row][column];
            this.Grid[row][column] = 0;
        }
    }

    ClearFullRows() {
        let cleared = 0;

        for (let row = this.Rows - 1; row >= 0; row--) {
            if (this.IsRowFull(row)) {
                this.ClearRow(row);
                cleared++;
            } else if (cleared > 0) {
                this.MoveRowDown(row, cleared);
            }
        }

        if (cleared > 0) {
            this.RowCleared(cleared);
            this.UpdateScore(cleared);
        }
    }

    GetBlockIdOrNull(r, c) {
        const row = this.Grid[r];

        if (!Array.isArray(row)) {
            return null;
        }

        const blockId = this.Grid[r][c];
        if (!Number.isInteger(blockId)) {
            return null;
        }

        return blockId;
    }
}

class Position {
    constructor(row, column) {
        this.Row = row;
        this.Column = column;
    }
}

class Block {
    Tiles;
    Id;
    constructor(StartOffset) {
        this.StartOffset = StartOffset;
        this.RotationState = 0;
        this.Offset = new Position(this.StartOffset.Row, this.StartOffset.Column);
    }

    TilePositions() {
        return this.Tiles[this.RotationState].map(p => new Position(p.Row + this.Offset.Row, p.Column + this.Offset.Column));
    }

    RotateClockWise() {
        this.RotationState = (this.RotationState + 1) % this.Tiles.length;
    }

    RotateCounterClockWise() {
        if (this.RotationState == 0) {
            this.RotationState = this.Tiles.length - 1;
        } else {
            this.RotationState--;
        }
    }

    Move(rows, columns) {
        this.Offset.Row += rows;
        this.Offset.Column += columns;
    }

    Reset() {
        this.RotationState = 0;
        this.Offset.Row = this.StartOffset.Row;
        this.Offset.Column = this.StartOffset.Column;
    }
}

class IBlock extends Block {
    constructor() {
        super(new Position(0, 3))

        this.Tiles = [
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(1, 3)],
            [new Position(0, 2), new Position(1, 2), new Position(2, 2), new Position(3, 2)],
            [new Position(2, 0), new Position(2, 1), new Position(2, 2), new Position(2, 3)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(3, 1)]
        ]

        this.Id = 1;
    }
}

class JBlock extends Block {
    constructor() {
        super(new Position(0, 3))

        this.Tiles = [
            [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(0, 2), new Position(1, 1), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
            [new Position(2, 1), new Position(2, 0), new Position(1, 1), new Position(0, 1)]
        ]

        this.Id = 2;
    }
}

class LBlock extends Block {
    constructor() {
        super(new Position(0, 3));

        this.Tiles = [
            [new Position(0, 2), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 0)],
            [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(2, 1)]
        ]

        this.Id = 3;
    }
}

class OBlock extends Block {
    constructor() {
        super(new Position(0, 4));

        this.Tiles = [
            [new Position(0, 0), new Position(0, 1), new Position(1, 0), new Position(1, 1)]
        ]

        this.Id = 4;
    }
}

class SBlock extends Block {
    constructor() {
        super(new Position(0, 3));

        this.Tiles = [
            [new Position(0, 1), new Position(0, 2), new Position(1, 0), new Position(1, 1)],
            [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
            [new Position(1, 1), new Position(1, 2), new Position(2, 0), new Position(2, 1)],
            [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(2, 1)]
        ]

        this.Id = 5;
    }
}

class TBlock extends Block {
    constructor() {
        super(new Position(0, 3));

        this.Tiles = [
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 1)]
        ]

        this.Id = 6;
    }
}

class ZBlock extends Block {
    constructor() {
        super(new Position(0, 3));

        this.Tiles = [
            [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 2), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 0)]
        ];

        this.Id = 7;
    }
}

class BlockQueue {
    OnNewBlock;
    constructor() {
        this.Blocks = [
            new IBlock(),
            new JBlock(),
            new LBlock(),
            new OBlock(),
            new SBlock(),
            new TBlock(),
            new ZBlock()
        ]

        this.NextBlocks = [this.RandomBlock(), this.RandomBlock(), this.RandomBlock(), this.RandomBlock()];
    }

    RandomBlock() {
        return this.Blocks[randomIntFromInterval(0, this.Blocks.length - 1)];
    }

    GetAndUpdate() {
        const block = this.NextBlocks.shift();

        let newBlock;
        do {
            newBlock = this.RandomBlock();
        } while (block.Id == newBlock.Id || this.NextBlocks[this.NextBlocks.length - 1].Id == newBlock.Id);

        this.NextBlocks.push(newBlock);

        if (this.OnNewBlock) {
            this.OnNewBlock();
        }
        return block;
    }
}

class GameState {
    OnGameOver;
    constructor() {
        this.GameGrid = new GameGrid(22, 10);
        this.BlockQueue = new BlockQueue();
        this.CurrentBlock = this.BlockQueue.GetAndUpdate();
        this.GameOver = false;
        this.CurrentScore = 0;
        this.LastScore = 0;

        this.GameGrid.UpdateScore = (clearedRows) => this.DoScoreCalculations(clearedRows);
    }

    BlockFits() {
        for (const position of this.CurrentBlock.TilePositions()) {
            if (!this.GameGrid.IsEmpty(position.Row, position.Column)) {
                return false;
            }
        }

        return true;
    }

    RotateBlockClockWise() {
        this.CurrentBlock.RotateClockWise();

        if (!this.BlockFits()) {
            this.CurrentBlock.RotateCounterClockWise();
        }
    }

    RotateBlockCounterClockWise() {
        this.CurrentBlock.RotateCounterClockWise();

        if (!this.BlockFits()) {
            this.CurrentBlock.RotateClockWise();
        }
    }

    MoveBlockLeft() {
        this.CurrentBlock.Move(0, -1);

        if (!this.BlockFits()) {
            this.CurrentBlock.Move(0, 1);
        }
    }

    MoveBlockRight() {
        this.CurrentBlock.Move(0, 1);

        if (!this.BlockFits()) {
            this.CurrentBlock.Move(0, -1);
        }
    }

    IsGameOver() {
        return !(this.GameGrid.IsRowEmpty(0) && this.GameGrid.IsRowEmpty(1));
    }

    PlaceBlock() {
        for (const position of this.CurrentBlock.TilePositions()) {
            this.GameGrid.Grid[position.Row][position.Column] = this.CurrentBlock.Id;
        }

        this.GameGrid.ClearFullRows();

        if (this.IsGameOver()) {
            this.GameOver = true;
            this.OnGameOver();
        } else {
            this.CurrentBlock = this.BlockQueue.GetAndUpdate();
            this.CurrentBlock.Reset();
        }
    }

    MoveBlockDown() {
        this.CurrentBlock.Move(1, 0);

        if (!this.BlockFits()) {
            this.CurrentBlock.Move(-1, 0);
            this.PlaceBlock();
        }
    }

    TileDropDistance(position) {
        let drop = 0;

        while (this.GameGrid.IsEmpty(position.Row + drop + 1, position.Column)) {
            drop++;
        }

        return drop;
    }

    BlockDropDistance() {
        let drop = this.GameGrid.Rows;

        this.CurrentBlock.TilePositions().forEach(pos => {
            drop = Math.min(drop, this.TileDropDistance(pos));
        });

        return drop;
    }

    HoldBlock() {
        if (this.CurrentHoldBlock) {
            const block = this.CurrentBlock;

            this.CurrentBlock = this.CurrentHoldBlock;
            this.CurrentBlock.Offset.Row = block.Offset.Row;
            this.CurrentBlock.Offset.Column = block.Offset.Column;

            if (!this.BlockFits()) {
                this.CurrentBlock = block;
                this.CurrentHoldBlock.Reset();
                return;
            }

            this.CurrentHoldBlock = block;
            this.CurrentHoldBlock.Reset();
            return;
        }

        this.CurrentHoldBlock = this.CurrentBlock;
        this.CurrentHoldBlock.Reset();

        this.CurrentBlock = this.BlockQueue.GetAndUpdate();
        this.CurrentBlock.Reset();
    }

    DropBlock() {
        this.CurrentBlock.Move(this.BlockDropDistance(), 0);
        this.PlaceBlock();
    }

    DoScoreCalculations(clearedRows) {
        if (clearedRows >= 4) {
            this.CurrentScore += 1200;
            return;
        }

        if (clearedRows >= 3) {
            this.CurrentScore += 300;
            return;
        }

        if (clearedRows >= 2) {
            this.CurrentScore += 100;
            return;
        }

        this.CurrentScore += 40;
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}