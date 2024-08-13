// ==========================================================
// =================== Rendering Grid 📅📏 =================
// ==========================================================

const board = document.querySelector('#board');
let matrix;
let row;
let col;
let width = 22;
var cells = [];

const pixels = document.querySelectorAll('#pixel .drop-menu a');
pixels.forEach((pixel) => {
    pixel.addEventListener('click', () => {
        width = parseInt(pixel.innerText);
        const cells = document.querySelectorAll('.col');
        cells.forEach(cell => {
            document.documentElement.style.setProperty('--cell-width', `${width}px`);
        })

        renderBoard();
        source = set('source');
        target = set('target');
    });
});

function renderBoard() {
    matrix = [];
    col = parseInt(board.clientWidth / width);
    row = parseInt(board.clientHeight / width);
    if(window.innerWidth <= 662){
        row -= 1;
    }

    board.innerHTML = '';
    for (let i = 0; i < row; i++) {
        const rowElement = document.createElement('div');
        rowElement.setAttribute('id', `row-${i}`);
        rowElement.classList.add('row');
        let colList = [];
        for (let j = 0; j < col; j++) {
            const colElement = document.createElement('div');
            colElement.classList.add('col', 'unvisited');
            colElement.setAttribute('id', `${i}-${j}`);
            rowElement.appendChild(colElement);

            colList.push(colElement);
        }
        board.appendChild(rowElement);
        matrix.push(colList);
    }
    cells = document.querySelectorAll('.col');
    boardInteraction(cells);
}





// ==========================================================
// ================= BOARD INTERATION 🎨🖌️ =================
// ==========================================================

function boardInteraction(cells) {
    let draging = false;
    let drawing = false;
    let dragStart = null;
    cells.forEach((cell) => {
        const pointDown = (e) => {
            if (e.target.classList.contains('source')) {
                dragStart = 'source';
                draging = true;
            }
            else if (e.target.classList.contains('target')) {
                dragStart = 'target';
                draging = true;
            }
            else {
                drawing = true;
            }
        }

        const pointUp = () => {
            drawing = false;
            draging = false;
            dragStart = null;
            matrix[source.x][source.y].classList.remove('wall');
            matrix[target.x][target.y].classList.remove('wall');
        }

        const pointMove = (e) => {
            const triggerElement = document.elementFromPoint(e.clientX, e.clientY);
            if (triggerElement == null || !triggerElement.classList.contains('col')) return;
            cordinate = { ...triggerElement.id.split('-') };

            if (draging && dragStart) {

                cells.forEach(cell => {
                    cell.classList.remove(dragStart);
                })
                triggerElement.classList.add(dragStart);

                if (dragStart === 'source') {
                    source.x = Number(cordinate[0]);
                    source.y = Number(cordinate[1]);
                }
                else {
                    target.x = Number(cordinate[0]);
                    target.y = Number(cordinate[1]);
                }
            }


            else if (drawing) {
                if (triggerElement.classList.contains('source') || triggerElement.classList.contains('target'))
                    return;

                const x = Number(cordinate[0]);
                const y = Number(cordinate[1]);

                matrix[x][y].setAttribute('class', 'col wall');
            }
        }

        cell.addEventListener('pointerdown', pointDown);
        cell.addEventListener('pointermove', pointMove);
        cell.addEventListener('pointerup', pointUp);

        cell.addEventListener('click', () => {
            if (cell.classList.contains('source') || cell.classList.contains('target'))
                return;

            cell.classList.remove('visited', 'path');
            cell.classList.toggle('wall');
        })
    })

}
