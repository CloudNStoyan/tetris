class CanvasPainter {
    constructor(canvasSelector) {
        this.Canvas = document.querySelector(canvasSelector);
        this.Context = this.Canvas.getContext('2d');
    }

    Fill(color) {
        this.Context.fillStyle = color;
        this.Context.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
    }

    Clear() {
        this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
    }

    DrawBox(x, y, width, height, color) {
        this.Context.fillStyle = color;
        this.Context.fillRect(x, y, width, height);
    }

    DrawEmptyBox(x, y, width, height, color) {
        this.Context.fillStyle = color;
        this.Context.fillRect(x, y, 25, 25);

        const newX = (x + (width / 2));
        const newY = y + (height / 2);

        this.DrawPoint(newX, newY, 3, 'rgba(255,255,255, 0.2)', 'rgba(255,255,255, 0.2)');
    }

    DrawPoint(x, y, radius, borderColor, fillColor) {
        this.Context.strokeStyle = borderColor;
        this.Context.fillStyle = fillColor;
        this.Context.beginPath();
        this.Context.arc(x, y, radius, 0, 2 * Math.PI);
        this.Context.fill();
    }

    DrawBoxWithBorder(x, y, width, height, color) {
        this.Context.fillStyle = color;
        this.Context.fillRect(x, y, width, height);

        this.Context.strokeStyle = 'white';

        const borderThickness = 2;

        for (let i = 0; i < borderThickness; i++) {
            this.DrawLine(x, y + i, x + width, y + i); // from left to right (top border)
        }

        for (let i = 0; i < borderThickness; i++) {
            this.DrawLine(x + i, y, x + i, y + height); // from left to bottom (left border)
        }

        this.Context.strokeStyle = 'black';

        for (let i = 0; i < borderThickness; i++) {
            this.DrawLine((x + width) - i, y, (x + width) - i, y + height); // from right to bottom (right border)
        }

        for (let i = 0; i < borderThickness; i++) {
            this.DrawLine(x, (y + height) - i, x + width, (y + height) - i); // from bottom to right (bottom border)
        }
    }

    DrawLine(fromX, fromY, toX, toY) {
        this.Context.lineWidth = 1;
        this.Context.beginPath();
        this.Context.moveTo(fromX, fromY);
        this.Context.lineTo(toX, toY);
        this.Context.stroke();
    }

    DrawCell(row, column, color, hasBorder = false, isEmpty = false) {
        const gridPadding = 5;
        const cell = 25;
        const x = (column * cell) + gridPadding;
        const y = (row * cell) + gridPadding;

        if (hasBorder == true) {
            this.DrawBoxWithBorder(x, y, cell, cell, color);
            return;
        }

        if (isEmpty == true) {
            this.DrawEmptyBox(x, y, cell, cell, color);
            return;
        }

        this.DrawBox(x, y, cell, cell, color);
    }
}