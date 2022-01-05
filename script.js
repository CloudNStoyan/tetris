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

const mainPainter = new CanvasPainter('#main-canvas');
const nextPainter = new CanvasPainter('#next-canvas');
const holdPainter = new CanvasPainter('#hold-canvas');
mainPainter.Fill('#333');

let GameTickInterval;
let GameTickTimeout;
let gameState;

function initGameState() {
    gameUiScore.innerText = '000000';
    gameState = new GameState();

    gameUi.classList.add('show');
    holdContainer.classList.add('show');
    postGameScoreLabel.classList.add('hide');
    instructionsWrapper.classList.add('hide');
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
        postGameScore.innerText = gameState.CurrentScore.toString().padStart(6, '0');
        postGameScoreLabel.classList.remove('hide');
        instructionsWrapper.classList.remove('hide');

        if (uiPlayBtn.innerText == 'Play') {
            uiPlayBtn.innerText = 'Play Again';
        }
    }

    gameState.GameGrid.RowCleared = (clearedRows) => triggetShake();

    SetGameTick(720);

    requestAnimationFrame(() => drawFrame(gameState));
}

const ClearGameTick = () => clearInterval(GameTickInterval);
const SetGameTick = (interval) => {
    ClearGameTick();
    GameTickInterval = setInterval(() => gameState.MoveBlockDown(), interval);
}

const gameContainer = document.querySelector('.game-container');

function triggetShake() {
    gameContainer.classList.add('animate');

    setTimeout(() => {
        gameContainer.classList.remove('animate');
    }, 250);
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
    mainPainter.Fill('#6a6a6a');
    DrawGrid(gameState.GameGrid);
    DrawGhostBlock(gameState, gameState.CurrentBlock);
    DrawCurrentBlock(gameState.CurrentBlock);
    DrawNextBlocks(gameState);
    DrawHoldBlock(gameState.CurrentHoldBlock);
    UpdateScoreIfNeeded();
    requestAnimationFrame(() => drawFrame(gameState));
}

function UpdateScoreIfNeeded() {
    if (gameState.LastScore != gameState.CurrentScore) {
        UpdateScoreWithAnimation(gameState.LastScore, gameState.CurrentScore, Math.max(200, 300 - (gameState.CurrentScore - gameState.LastScore)));
        gameState.LastScore = gameState.CurrentScore;
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

const ColorScheme = {
    1: 'cyan',
    2: 'blue',
    3: 'orange',
    4: 'yellow',
    5: 'lightgreen',
    6: 'purple',
    7: 'red'
};

function DrawCurrentBlock(block) {
    const positions = block.Tiles[block.RotationState];
    positions.forEach(position => {
        mainPainter.DrawCell(block.Offset.Row + position.Row, block.Offset.Column + position.Column, ColorScheme[block.Id], true);
    });
}

function DrawGhostBlock(gameState, block) {
    const dropDistance = gameState.BlockDropDistance();

    block.TilePositions().forEach(pos => {
        mainPainter.DrawCell(pos.Row + dropDistance, pos.Column, 'rgba(255,255,255,0.3)');
    });
}

function DrawGrid(gameGrid) {
    for (let row = 2; row < gameGrid.Rows; row++) {
        for (let column = 0; column < gameGrid.Columns; column++) {
            if (gameGrid.IsEmpty(row, column)) {
                mainPainter.DrawCell(row, column, '#263238', false, true);

            } else {
                const blockId = gameGrid.Grid[row][column];

                mainPainter.DrawCell(row, column, ColorScheme[blockId], true, false);
            }
        }
    }
}

function DrawNextBlocks(gameState) {
    nextPainter.Clear();

    let rowOffset = 0;
    gameState.BlockQueue.NextBlocks.forEach(nextBlock => {
        const positions = nextBlock.Tiles[0];
        const columnOffset = nextBlock.Id != 1 ? 1 : 0;
        positions.forEach(position => {
            nextPainter.DrawCell(rowOffset + position.Row, columnOffset + position.Column, ColorScheme[nextBlock.Id], true);
        });
        rowOffset += 3;
    })
}

function DrawHoldBlock(block) {
    if (!block) {
        holdPainter.Clear();
        return;
    }

    holdPainter.Clear();

    const positions = block.Tiles[0];
    const columnOffset = block.Id != 1 ? 1 : 0;
    positions.forEach(position => {
        holdPainter.DrawCell(position.Row, columnOffset + position.Column, ColorScheme[block.Id], true);
    });
}

const backgroundCanvas = document.querySelector('#background-canvas');

const backgroundBoundaries = {
    x: 0,
    y: 0
}

let isBackgroundEnabled = true;
function ResizeBackgroundCanvasToFitScreen() {
    if (!isBackgroundEnabled) {
        return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    backgroundCanvas.width = width;
    backgroundCanvas.height = height;

    backgroundBoundaries.x = width;
    backgroundBoundaries.y = height;
}

addEventListener('resize', ResizeBackgroundCanvasToFitScreen, false);
ResizeBackgroundCanvasToFitScreen();

const backgroundPainter = new CanvasPainter('#background-canvas');

class BackgroundBlock {
    constructor(color, painter, position) {
        this.Color = color;
        this.Painter = painter;
        this.Position = position;
        this.Speed = randomIntFromInterval(2, 4);
    }

    Update() {
        this.Position.y += this.Speed;
    }

    Draw() {
        this.Painter.DrawBoxWithBorder(this.Position.x, this.Position.y, 25, 25, this.Color);
        this.Update();
    }

    IsInBounds(x, y) {
        return this.Position.x >= 0 && this.Position.x < x && this.Position.y >= -400 && this.Position.y < y;
    }
}

let backgroundBlocks = [];

const maxBackgroundBlocks = 120;

function SpawnNewBlocks(howMany) {
    for (let i = 0; i < howMany; i++) {
        const pos = {
            x: randomIntFromInterval(10, backgroundBoundaries.x - 10),
            y: randomIntFromInterval(-300, -100)
        };

        backgroundBlocks.push(new BackgroundBlock(ColorScheme[randomIntFromInterval(0, 7)], backgroundPainter, pos));
    }
}


function DrawBackgroundFrame() {
    if (!isBackgroundEnabled) {
        return;
    }

    backgroundPainter.Fill('#f1f1f1')
    backgroundBlocks = backgroundBlocks.filter(block => block.IsInBounds(backgroundBoundaries.x, backgroundBoundaries.y));

    SpawnNewBlocks(maxBackgroundBlocks - backgroundBlocks.length);

    backgroundBlocks.forEach(block => block.Draw());
    requestAnimationFrame(DrawBackgroundFrame)
}

requestAnimationFrame(DrawBackgroundFrame);

const toggleBackgroundCheckbox = document.querySelector('.stop-background-toggle');

toggleBackgroundCheckbox.addEventListener('change', (e) => changeBackgroundState(e.target.checked));

function changeBackgroundState(isEnabled) {
    if (isBackgroundEnabled == isEnabled) {
        return;
    }

    if (!isEnabled) {
        isBackgroundEnabled = false;
        return;
    }

    isBackgroundEnabled = true;
    requestAnimationFrame(DrawBackgroundFrame);
}