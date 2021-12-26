const canvas = document.getElementById('mainCanvas');
const context = canvas.getContext('2d');

const painter = new CanvasPainter(context);

const uiContainer = document.querySelector('.ui');
const uiPlayBtn = uiContainer.querySelector('.btn-play');

const gameUi = document.querySelector('.game-ui');
const gameUiScore = gameUi.querySelector('.game-score');

const postGameWrapper = document.querySelector('.post-game-wrapper')
const postGameScoreLabel = postGameWrapper.querySelector('h2');
const postGameScore = postGameWrapper.querySelector('.post-game-score');

context.fillStyle = "#333";
context.fillRect(0, 0, canvas.width, canvas.height);

let interval;
let gameState;
let skipMoveDown = false;
let gamePause = false;
let currentScore = 0;
let lastScore = 0;

function initGameState() {
    currentScore = 0;
    lastScore = 0;
    ClearGameUi();
    gameUi.classList.add('show');
    postGameScoreLabel.classList.add('hide');

    gameState = new GameState();
    uiContainer.classList.add('hide');

    gameState.BlockQueue.OnNewBlock = () => {
        skipMoveDown = true;
    }

    gameState.OnGameOver = () => {
        clearInterval(interval);
        interval = null;
        uiContainer.classList.remove('hide');
        gameUi.classList.remove('show');
        postGameScore.innerText = currentScore.toString().padStart(6, '0');
        postGameScoreLabel.classList.remove('hide');

        if (uiPlayBtn.innerText == 'Play') {
            uiPlayBtn.innerText = 'Play Again';
        }
    }

    gameState.GameGrid.RowCleared = (clearedRows) => {
        triggetShake();
        DoScoreCalculations(clearedRows);
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

let movingFaster = false;

function StartMovingFaster() {
    if (movingFaster) {
        return;
    }
    movingFaster = true;
    clearInterval(interval);
    interval = setInterval(() => gameTick(gameState), 80);
}

function StopMovingFaster() {
    clearInterval(interval);
    interval = setInterval(function () {
        if (gamePause == true) {
            console.log('dwarf');
            console.log(gameState);
            clearInterval(interval);
            return;
        }
        gameTick(gameState);
    }, 720);
    movingFaster = false;
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

const controllerMap = {
    "left": ['KeyA', 'ArrowLeft'],
    "right": ['KeyD', 'ArrowRight'],
    "rotateClockWise": ['KeyR'],
    "rotateCounterClockWise": ['KeyQ'],
    "drop": ['Space'],
    "speed": ['ArrowDown', 'KeyS']
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

    if (controllerMap.speed.includes(key)) {
        StartMovingFaster();
    }
});

document.body.addEventListener('keyup', (e) => {
    const key = e.code;

    if (controllerMap.speed.includes(key)) {
        StopMovingFaster();
    }
})

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

function ClearGameUi() {
    gameUiScore.innerText = '000000';
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
        painter.DrawBoxWithBorder(x, y, cell, cell, color);
        return;
    }

    if (isEmpty == true) {
        painter.DrawEmptyBox(x, y, cell, cell, color);
        return;
    }

    painter.DrawBox(x, y, cell, cell, color);
}


const gameContainer = document.querySelector('.game-container');

function triggetShake() {
    gameContainer.classList.add('animate');

    setTimeout(() => {
        gameContainer.classList.remove('animate');
    }, 250);
}