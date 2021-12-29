const canvas = document.getElementById('mainCanvas');
const context = canvas.getContext('2d');

const mainPainter = new CanvasPainter(context);

const container = document.querySelector('.container');

const uiContainer = document.querySelector('.ui');
const uiPlayBtn = uiContainer.querySelector('.btn-play');

const gameUi = document.querySelector('.game-ui');
const gameUiScore = gameUi.querySelector('.game-score');

const holdContainer = document.querySelector('.hold-container');

const postGameWrapper = document.querySelector('.post-game-wrapper')
const postGameScoreLabel = postGameWrapper.querySelector('h2');
const postGameScore = postGameWrapper.querySelector('.post-game-score');

const instructionsWrapper = document.querySelector('.instructions');

context.fillStyle = "#333";
context.fillRect(0, 0, canvas.width, canvas.height);

let GameTickInterval;
let GameTickTimeout;
let gameState;
let currentScore = 0;
let lastScore = 0;

function initGameState() {
    ClearGameState();
    gameUi.classList.add('show');
    holdContainer.classList.add('show');
    postGameScoreLabel.classList.add('hide');
    instructionsWrapper.classList.add('hide');
    container.classList.add('animate');
    uiContainer.classList.add('hide');

    gameState.BlockQueue.OnNewBlock = () => {
        ClearGameTick();
        clearTimeout(GameTickTimeout);
        GameTickTimeout = setTimeout(() => SetGameTick(720), 2000);
    };

    gameState.OnGameOver = () => {
        ClearGameTick();
        uiContainer.classList.remove('hide');
        gameUi.classList.remove('show');
        holdContainer.classList.remove('show');
        postGameScore.innerText = currentScore.toString().padStart(6, '0');
        postGameScoreLabel.classList.remove('hide');
        instructionsWrapper.classList.remove('hide');
        container.classList.remove('animate');

        if (uiPlayBtn.innerText == 'Play') {
            uiPlayBtn.innerText = 'Play Again';
        }
    }

    gameState.GameGrid.RowCleared = (clearedRows) => {
        triggetShake();
        DoScoreCalculations(clearedRows);
    }

    SetGameTick(720);

    requestAnimationFrame(() => drawFrame(gameState));
}

const ClearGameTick = () => clearInterval(GameTickInterval);
const SetGameTick = (interval) => {
    ClearGameTick();
    GameTickInterval = setInterval(() => gameState.MoveBlockDown(), interval);
}

function ClearGameState() {
    gameUiScore.innerText = '000000';
    currentScore = 0;
    lastScore = 0;
    gameState = new GameState();
}

function DebugMode() {
    if (!gameState) {
        console.log('The game hasn\'t started yet!');
        return;
    }

    console.log(gameState);
    console.log('The game is now in debug mode.')
    clearInterval(GameTickInterval);
}

function DoScoreCalculations(clearedRows) {
    if (clearedRows >= 4) {
        currentScore += 1200;
        return;
    }

    if (clearedRows >= 3) {
        currentScore += 300;
        return;
    }

    if (clearedRows >= 2) {
        currentScore += 100;
        return;
    }

    currentScore += 40;
}

const InputMap = {
    "left": ['KeyA', 'ArrowLeft'],
    "right": ['KeyD', 'ArrowRight'],
    "rotateClockWise": ['KeyR'],
    "rotateCounterClockWise": ['KeyQ'],
    "drop": ['Space'],
    "speed": ['ArrowDown', 'KeyS'],
    "hold": ['KeyC']
}

function OnInput(key) {
    // if the game is not currently running we don't need the key inputs
    if (!gameState) {
        return;
    }

    if (InputMap.left.includes(key)) {
        gameState.MoveBlockLeft();
    }

    if (InputMap.right.includes(key)) {
        gameState.MoveBlockRight();
    }

    if (InputMap.rotateClockWise.includes(key)) {
        gameState.RotateBlockClockWise();
    }

    if (InputMap.rotateCounterClockWise.includes(key)) {
        gameState.RotateBlockCounterClockWise();
    }

    if (InputMap.drop.includes(key)) {
        gameState.DropBlock();
    }

    if (InputMap.speed.includes(key)) {
        gameState.MoveBlockDown();
    }

    if (InputMap.hold.includes(key)) {
        gameState.HoldBlock();
    }
}

document.body.addEventListener('keydown', (e) => OnInput(e.code));

uiPlayBtn.addEventListener('click', () => {
    if (gameState && !gameState.GameOver) {
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
    DrawNextBlocks(gameState);
    DrawHoldBlock(gameState.CurrentHoldBlock);
    UpdateScoreIfNeeded();
    requestAnimationFrame(() => drawFrame(gameState));
}

function UpdateScoreIfNeeded() {
    if (lastScore != currentScore) {
        UpdateScoreWithAnimation(lastScore, currentScore, Math.max(200, 300 - (currentScore - lastScore)));
        lastScore = currentScore;
    }
}

function UpdateScoreWithAnimation(from, to, speed) {
    gameUiScore.classList.add('animate');
    const increment = to / speed;
    if (from < to) {
        gameUiScore.innerText = Math.floor(from).toString().padStart(6, '0');
        setTimeout(() => UpdateScoreWithAnimation(from + increment, to, speed), 1);
        return;
    }

    gameUiScore.innerText = Math.floor(to).toString().padStart(6, '0');
    gameUiScore.classList.remove('animate');
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
        DrawCell(mainPainter, block.Offset.Row + position.Row, block.Offset.Column + position.Column, colorScheme[block.Id], true);
    });
}

function DrawGhostBlock(gameState, block) {
    const dropDistance = gameState.BlockDropDistance();

    block.TilePositions().forEach(pos => {
        DrawCell(mainPainter, pos.Row + dropDistance, pos.Column, 'rgba(255,255,255,0.3)');
    })
}

function DrawGrid(gameGrid) {
    for (let row = 2; row < gameGrid.Rows; row++) {
        for (let column = 0; column < gameGrid.Columns; column++) {
            if (gameGrid.IsEmpty(row, column)) {
                DrawCell(mainPainter, row, column, '#263238', false, true);

            } else {
                const blockId = gameGrid.Grid[row][column];

                DrawCell(mainPainter, row, column, colorScheme[blockId], true, false);
            }
        }
    }
}

function DrawCell(canvasPainter, row, column, color, hasBorder = false, isEmpty = false) {
    const gridPadding = 5;
    const cell = 25;
    const x = (column * cell) + gridPadding;
    const y = (row * cell) + gridPadding;

    if (hasBorder == true) {
        canvasPainter.DrawBoxWithBorder(x, y, cell, cell, color);
        return;
    }

    if (isEmpty == true) {
        canvasPainter.DrawEmptyBox(x, y, cell, cell, color);
        return;
    }

    canvasPainter.DrawBox(x, y, cell, cell, color);
}

const nextCanvas = document.querySelector('#next-canvas');
const nextContext = nextCanvas.getContext('2d');
const nextPainter = new CanvasPainter(nextContext);

function DrawNextBlocks(gameState) {
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    let rowOffset = 0;
    gameState.BlockQueue.NextBlocks.forEach(nextBlock => {
        const positions = nextBlock.Tiles[0];
        const columnOffset = nextBlock.Id != 1 ? 1 : 0;
        positions.forEach(position => {
            DrawCell(nextPainter, rowOffset + position.Row, columnOffset + position.Column, colorScheme[nextBlock.Id], true);
        });
        rowOffset += 3;
    })
}

const holdCanvas = document.querySelector('#hold-canvas');
const holdContext = holdCanvas.getContext('2d');
const holdPainter = new CanvasPainter(holdContext);

function DrawHoldBlock(block) {
    if (!block) {
        return;
    }

    holdContext.clearRect(0, 0, holdCanvas.width, holdCanvas.height);

    const positions = block.Tiles[0];
    const columnOffset = block.Id != 1 ? 1 : 0;
    positions.forEach(position => {
        DrawCell(holdPainter, position.Row, columnOffset + position.Column, colorScheme[block.Id], true);
    });
}


const gameContainer = document.querySelector('.game-container');

function triggetShake() {
    gameContainer.classList.add('animate');

    setTimeout(() => {
        gameContainer.classList.remove('animate');
    }, 250);
}