class GameGrid {
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
        super(new Position(-1, 3))

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

        this.NextBlock = this.RandomBlock();
    }

    RandomBlock() {
        return this.Blocks[randomIntFromInterval(0, this.Blocks.length - 1)];
    }

    GetAndUpdate() {
        const block = this.NextBlock;

        do {
            this.NextBlock = this.RandomBlock();
            this.NextBlock.Reset();
        } while (block.Id == this.NextBlock.Id);

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

    DropBlock() {
        this.CurrentBlock.Move(this.BlockDropDistance(), 0);
        this.PlaceBlock();
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// DRAW

const canvas = document.getElementById('mainCanvas');
const context = canvas.getContext('2d');

const uiContainer = document.querySelector('.ui');
const uiPlayAgain = uiContainer.querySelector('.play-again');

let interval;
let gameState;
let skipMoveDown = false;

function initGameState() {
    gameState = new GameState();
    uiContainer.classList.add('hide');

    gameState.BlockQueue.OnNewBlock = () => {
        console.log('new block')
        skipMoveDown = true;
    }

    gameState.OnGameOver = () => {
        clearInterval(interval);
        interval = null;
        uiContainer.classList.remove('hide');
    }

    interval = setInterval(function () {
        gameTick(gameState);
    }, 250)
}

initGameState();

const controllerMap = {
    "left": ['KeyA', 'ArrowLeft'],
    "right": ['KeyD', 'ArrowRight'],
    "rotateClockWise": ['KeyR'],
    "rotateCounterClockWise": ['KeyQ'],
    "drop": ['Space']
}

document.body.addEventListener('keydown', (e) => {
    const key = e.code;

    if (controllerMap.left.includes(key)) {
        gameState.MoveBlockLeft();
    }

    if (controllerMap.right.includes(key)) {
        gameState.MoveBlockRight();
    }

    if (controllerMap.rotateClockWise.includes(key)) {
        gameState.RotateBlockClockWise();
    }

    if (controllerMap.rotateCounterClockWise.includes(key)) {
        gameState.RotateBlockCounterClockWise();
    }

    if (controllerMap.drop.includes(key)) {
        gameState.DropBlock();
    }
});

uiPlayAgain.addEventListener('click', () => {
    if (interval != null) {
        return;
    }

    initGameState();
})

function gameTick(gameState) {
    context.fillStyle = "#333";
    context.fillRect(0, 0, canvas.width, canvas.height);
    DrawGrid(gameState.GameGrid);
    DrawGhostBlock(gameState, gameState.CurrentBlock);
    DrawCurrentBlock(gameState.CurrentBlock);

    if (skipMoveDown) {
        skipMoveDown = false;
        return;
    }
    gameState.MoveBlockDown();
}

const colorScheme = {
    1: 'cyan',
    2: 'blue',
    3: 'orange',
    4: 'yellow',
    5: 'lightgreen',
    6: 'purple',
    7: 'red'
}

function DrawCurrentBlock(block) {
    const positions = block.Tiles[block.RotationState];
    positions.forEach(position => {
        DrawCell(block.Offset.Row + position.Row, block.Offset.Column + position.Column, colorScheme[block.Id]);
    });
}

function DrawGhostBlock(gameState, block) {
    const dropDistance = gameState.BlockDropDistance();

    block.TilePositions().forEach(pos => {
        DrawCell(pos.Row + dropDistance, pos.Column, 'rgba(255,255,255,0.3)');
    })
}

function DrawGrid(gameGrid) {
    for (let row = 0; row < gameGrid.Rows; row++) {
        for (let column = 0; column < gameGrid.Columns; column++) {
            if (gameGrid.IsEmpty(row, column)) {
                DrawCell(row, column, '#231F20', false);
            } else {
                const blockId = gameGrid.Grid[row][column];
                DrawCell(row, column, colorScheme[blockId])
            }
        }
    }
}

function DrawCell(row, column, color, hasBorder = true) {
    const gridPadding = 5;
    const cell = 25;
    const x = (column * cell) + gridPadding;
    const y = (row * cell) + gridPadding;

    if (hasBorder) {
        drawBoxWithBorder(x, y, cell, cell, color);
        return;
    }

    drawBox(x, y, cell, cell, color);
}

function drawBox(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawBoxWithBorder(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);

    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(x, y, width, height);

    const borderThickness = 2;
    context.fillStyle = color;
    context.fillRect(x + borderThickness, y + borderThickness, width - (borderThickness * 2), height - (borderThickness * 2));
}