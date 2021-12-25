class GameGrid {
    RowCleared;
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
                this.RowCleared(row);
            } else if (cleared > 0) {
                this.MoveRowDown(row, cleared);
            }
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
const uiPlayBtn = uiContainer.querySelector('.btn-play');

context.fillStyle = "#333";
context.fillRect(0, 0, canvas.width, canvas.height);

let interval;
let gameState;
let skipMoveDown = false;
let gamePause = false;

function initGameState() {
    gameState = new GameState();
    uiContainer.classList.add('hide');

    gameState.BlockQueue.OnNewBlock = () => {
        skipMoveDown = true;
    }

    gameState.OnGameOver = () => {
        clearInterval(interval);
        interval = null;
        uiContainer.classList.remove('hide');

        if (uiPlayBtn.innerText == 'Play') {
            uiPlayBtn.innerText = 'Play Again';
        }
    }

    gameState.GameGrid.RowCleared = (y) => {
        triggetShake();
    }

    interval = setInterval(function () {
        if (gamePause == true) {
            console.log('dwarf');
            console.log(gameState);
            clearInterval(interval);
            return;
        }
        gameTick(gameState);
    }, 720);

    requestAnimationFrame(() => drawFrame(gameState));
}

const controllerMap = {
    "left": ['KeyA', 'ArrowLeft'],
    "right": ['KeyD', 'ArrowRight'],
    "rotateClockWise": ['KeyR'],
    "rotateCounterClockWise": ['KeyQ'],
    "drop": ['Space', 'ArrowDown', 'KeyS']
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

uiPlayBtn.addEventListener('click', () => {
    if (interval != null) {
        return;
    }

    initGameState();
});

function drawFrame(gameState) {
    context.fillStyle = "#6a6a6a";
    context.fillRect(0, 0, canvas.width, canvas.height);
    DrawGrid(gameState.GameGrid);
    DrawGhostBlock(gameState, gameState.CurrentBlock);
    DrawCurrentBlock(gameState.CurrentBlock);
    requestAnimationFrame(() => drawFrame(gameState));
}

function gameTick(gameState) {
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
        DrawCell(block.Offset.Row + position.Row, block.Offset.Column + position.Column, colorScheme[block.Id], true);
    });
}

function DrawGhostBlock(gameState, block) {
    const dropDistance = gameState.BlockDropDistance();

    block.TilePositions().forEach(pos => {
        DrawCell(pos.Row + dropDistance, pos.Column, 'rgba(255,255,255,0.3)');
    })
}

function DrawGrid(gameGrid) {
    for (let row = 2; row < gameGrid.Rows; row++) {
        for (let column = 0; column < gameGrid.Columns; column++) {
            if (gameGrid.IsEmpty(row, column)) {
                DrawCell(row, column, '#263238', false, true);

            } else {
                const blockId = gameGrid.Grid[row][column];

                DrawCell(row, column, colorScheme[blockId], true, false);
            }
        }
    }
}

function DrawCell(row, column, color, hasBorder = false, isEmpty = false) {
    const gridPadding = 5;
    const cell = 25;
    const x = (column * cell) + gridPadding;
    const y = (row * cell) + gridPadding;

    if (hasBorder == true) {
        drawBoxWithBorder(x, y, cell, cell, color);
        return;
    }

    if (isEmpty == true) {
        drawEmptyBox(x, y, cell, cell, color);
        return;
    }

    drawBox(x, y, cell, cell, color);
}

function drawBox(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawEmptyBox(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, 25, 25);

    const newX = (x + (width / 2));
    const newY = y + (height / 2);

    drawPoint(newX, newY, 3, 'rgba(255,255,255, 0.2)', 'rgba(255,255,255, 0.2)');
}

function drawPoint(x, y, radius, borderColor, fillColor) {
    context.strokeStyle = borderColor;
    context.fillStyle = fillColor;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}

function drawBoxWithBorder(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);

    context.strokeStyle = 'white';

    const borderThickness = 2;

    for (let i = 0; i < borderThickness; i++) {
        drawLine(x, y + i, x + width, y + i); // from left to right (top border)
    }

    for (let i = 0; i < borderThickness; i++) {
        drawLine(x + i, y, x + i, y + height); // from left to bottom (left border)
    }

    context.strokeStyle = 'black';

    for (let i = 0; i < borderThickness; i++) {
        drawLine((x + width) - i, y, (x + width) - i, y + height); // from right to bottom (right border)
    }

    for (let i = 0; i < borderThickness; i++) {
        drawLine(x, (y + height) - i, x + width, (y + height) - i); // from bottom to right (bottom border)
    }
}


function drawLine(fromX, fromY, toX, toY) {
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
}

const gameContainer = document.querySelector('.game-container');

function triggetShake() {
    gameContainer.classList.add('animate');

    setTimeout(() => {
        gameContainer.classList.remove('animate');
    }, 250);
}