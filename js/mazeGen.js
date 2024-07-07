
const generateMazeBtn = document.querySelector('#generate-maze');
generateMazeBtn.addEventListener('click', () => {
    clearBoard();
    wallToAnimate = [];

    recursiveDivisionMaze(0, row - 1, 0, col - 1, 'horizontal', false);
    animate(wallToAnimate, 'wall', fast_AnimateDelay);
});

function recursiveDivisionMaze(rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
    if (rowEnd < rowStart || colEnd < colStart) {
        return;
    }

    if (!surroundingWalls) {
        //Drawing top & bottom Boundary Wall
        for (let i = 0; i < col; i++) {
            if (matrix[0][i].classList.contains('source') || matrix[0][i].classList.contains('target'))
                continue;

            wallToAnimate.push(matrix[0][i]);

            if (matrix[row - 1][i].classList.contains('source') || matrix[row - 1][i].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[row - 1][i]);
        }

        //Drawing left & right Boundar wall
        for (let i = 0; i < row; i++) {
            if (matrix[i][0].classList.contains('source') || matrix[i][0].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[i][0]);

            if (matrix[i][col - 1].classList.contains('source') || matrix[i][col - 1].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[i][col - 1]);
        }
        surroundingWalls = true;
    }

    //=========== horizontal ======
    if (orientation === "horizontal") {
        let possibleRows = [];
        for (let i = rowStart; i <= rowEnd; i += 2) {
            if (i == 0 || i == row - 1) continue;
            possibleRows.push(i);
        }
        let possibleCols = [];
        for (let i = colStart - 1; i <= colEnd + 1; i += 2) {
            if (i <= 0 || i >= col - 1) continue;
            possibleCols.push(i);
        }

        let currentRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        let colRandom = possibleCols[Math.floor(Math.random() * possibleCols.length)];

        //drawing horizontal wall
        for (i = colStart - 1; i <= colEnd + 1; i++) {
            const cell = matrix[currentRow][i];
            if (!cell || i === colRandom || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;

            wallToAnimate.push(cell)
        }


        if (currentRow - 2 - rowStart > colEnd - colStart) {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls);
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls);
        } else {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
        }
    }

    //=========== vertical ======
    else if (orientation === 'vertical') {
        let possibleCols = [];
        for (let i = colStart; i <= colEnd; i += 2) {
            possibleCols.push(i);
        }
        let possibleRows = [];
        for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
            if (i <= 0 || i >= row - 1) continue;
            possibleRows.push(i);
        }

        let currentCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        let rowRandom = possibleRows[Math.floor(Math.random() * possibleRows.length)];

        //drawing vertical wall
        for (i = rowStart - 1; i <= rowEnd + 1; i++) {
            if (!matrix[i]) continue;

            const cell = matrix[i][currentCol];
            if (i === rowRandom || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;
            wallToAnimate.push(cell)
        }

        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls);
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
        }
    }
};