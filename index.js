
// ==========================================================
// =================== Rendering Grid 📅📏 =================
// ==========================================================
const board = document.querySelector('#board');

var matrix = [];
let row;
let col;

function renderMap() {
    let width = 22;

    col = parseInt(board.clientWidth / width);
    row = parseInt(board.clientHeight / width);

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
}

renderMap();





// ==========================================================
// ================= AUXILLARY METHODS ⚙️🦾 ================
// ==========================================================

//check outBound of matrix ✔️❌
const isValid = (x, y) => {
    return (x >= 0 && y >= 0 && x < row && y < col);
}

const getRandomCordinate = () => {
    let x = parseInt(Math.random() * row);
    let y = parseInt(Math.random() * col);
    return { x, y };
}

//method for setting target and source 🎯⛳
const set = (className, x = -1, y = -1) => {
    if (isValid(x, y)) {
        matrix[x][y].classList.add(className);
        return { x, y };
    }
    else {
        cordinate = getRandomCordinate();
        matrix[cordinate.x][cordinate.y].classList.add(className);
        return cordinate
    }
}

let source = set('source');
let target = set('target');





// ==========================================================
// ====================== CLICK EVENTS ======================
// ==========================================================

const clearNavOption = () => {
    navOptions.forEach((option) => {
        option.classList.remove('active');
    })
    document.querySelectorAll('.drop-menu').forEach((menu) => {
        menu.classList.remove('active');
    })
}


//NAVIGATION click 🔵👆
const navOptions = document.querySelectorAll('.nav-menu>li>a');

document.querySelectorAll('.drop-menu').forEach((menu) => {
    menu.classList.remove('active');
})

navOptions.forEach((option) => {
    option.addEventListener('click', () => {
        //clearify
        clearNavOption();

        //adding 
        option.classList.add('active');

        if (option.classList.contains('drop-toggle')) {
            const dropMenu = option.nextElementSibling;
            dropMenu.classList.add('active');
        }
    })
})


//OUTSIZE CLICK 🚀👆
document.addEventListener('click', (event) => {
    if (!document.querySelector('.nav-menu').contains(event.target)) {
        clearNavOption();
    }
})


//'dropMenu' OPTION CLICK 📃👆
const dropMenus = document.querySelectorAll('.drop-menu');
const dropOptions = document.querySelectorAll('.drop-menu a');
var algorithm = '';
dropOptions.forEach((option) => {
    option.addEventListener('click', () => {
        //clearify
        dropOptions.forEach((option) => {
            option.classList.remove('active');
        })
        dropMenus.forEach((dropmenu) => {
            dropmenu.classList.remove('active');
        })

        //adding
        option.classList.add('active');

        if (document.querySelector('#algo').contains(option)) {
            let text = option.innerText;
            algorithm = text.split(' ')[0];
            visualizeBtn.innerText = `Visualize ${algorithm}`;
        }
    })
})








// ==========================================================
// ================= BOARD INTERATION 🎨🖌️ =================
// ==========================================================

const cells = document.querySelectorAll('.col');
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
            const x = Number(cordinate[0]);
            const y = Number(cordinate[1]);
            matrix[x][y].setAttribute('class', 'col wall');
        }


    }

    cell.addEventListener('pointerdown', pointDown);
    cell.addEventListener('pointermove', pointMove);
    cell.addEventListener('pointerup', pointUp);
    cell.addEventListener('click', () => {
        cell.classList.toggle('wall');
    })
})







// ==========================================================
// ============== BUTTONS INTERATION 🟡👆 ==================
// ==========================================================
const visualizeBtn = document.getElementById('visualize');
const clearPathBtn = document.querySelector('#clear-path');
const clearBoardBtn = document.querySelector('#clear-board');

const clearPath = () => {
    cells.forEach((cell) => {
        cell.classList.remove('visited', 'path');
    })
}
const clearBoard = () => {
    clearPath();
    cells.forEach((cell) => {
        cell.classList.remove('wall');
    })
}

clearPathBtn.addEventListener('click', clearPath);
clearBoardBtn.addEventListener('click', clearBoard);
visualizeBtn.addEventListener('click', () => {
    clearPath();
    switch (algorithm) {
        case '': BFS(); break;
        case 'BFS': BFS(); break;
        case 'Greedy': greedy(); break;
        case 'Dijkstra\'s': Dijkstra(); break;
        case 'A*': Astar(); break;
        default: break;
    }

});








// ==========================================================
// =================== ALGORITHMS ⚙️🦾 =====================
// ==========================================================

function drawPath(parents, node) {
    if (node === source || node === undefined) return;
    const { x, y } = node;
    matrix[x][y].classList.add('path');
    node = parents.get(`${x}-${y}`);
    // setTimeout(() => drawPath(parents, node), 50);
    requestAnimationFrame(() => drawPath(parents, node));
}

function BFS() {
    const queue = [];
    const visited = new Set();
    const parent = new Map();
    queue.push(source);
    visited.add(`${source.x}-${source.y}`);

    function visualize() {
        if (queue.length <= 0) return;

        const current = queue.shift();

        if (current.x === target.x && current.y === target.y) {
            drawPath(parent, target);
            return;
        }
        matrix[current.x][current.y].classList.remove('unvisited');
        matrix[current.x][current.y].classList.add('visited');

        const neighbours = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            //shoulbe be valid
            //shouldn't be wall
            //shouldn't be visited
            const key = `${neighbour.x}-${neighbour.y}`;
            if (
                isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall') &&
                !visited.has(key)
            ) {
                visited.add(key);
                queue.push(neighbour);
                parent.set(key, current);
            }
        }
        requestAnimationFrame(visualize);

    }

    visualize();
}

function Dijkstra() {
    console.log('hello');
    const distances = new Map();
    const parent = new Map();
    const visited = new Set();

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const key = `${i}-${j}`;
            distances.set(key, Infinity);
        }
    }

    distances.set(`${source.x}-${source.y}`, 0);

    function visualize() {
        if (visited.size === row * col) return;

        let current;
        let minDistance = Infinity;

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                const key = `${i}-${j}`;
                if (!visited.has(key) && distances.get(key) < minDistance) {
                    minDistance = distances.get(key);
                    current = { x: i, y: j };
                }
            }
        }

        visited.add(`${current.x}-${current.y}`);

        if (current.x === target.x && current.y === target.y) {
            drawPath(parent, target);
            return;
        }

        matrix[current.x][current.y].classList.remove('unvisited');
        matrix[current.x][current.y].classList.add('visited');

        const neighbours = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;
            if (
                isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall')
            ) {
                const alt = distances.get(`${current.x}-${current.y}`) + 1;
                if (alt < distances.get(key)) {
                    distances.set(key, alt);
                    parent.set(key, current);
                }
            }
        }

        requestAnimationFrame(visualize);
    }

    visualize();
}

function Astar() {
    const openSet = [`${source.x}-${source.y}`];
    const closedSet = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const parent = new Map();

    gScore.set(`${source.x}-${source.y}`, 0);
    fScore.set(`${source.x}-${source.y}`, heuristic(source, target));

    function heuristic(node, target) {
        return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
    }

    function visualize() {
        if (openSet.length <= 0) return;

        let current;
        let minFScore = Infinity;

        for (const key of openSet) {
            const f = fScore.get(key);
            if (f < minFScore) {
                minFScore = f;
                current = key.split('-').map(Number);
            }
        }

        const [currentX, currentY] = current;

        if (currentX === target.x && currentY === target.y) {
            drawPath(parent, target);
            return;
        }

        openSet.splice(openSet.indexOf(`${currentX}-${currentY}`), 1);
        closedSet.add(`${currentX}-${currentY}`);

        matrix[currentX][currentY].classList.remove('unvisited');
        matrix[currentX][currentY].classList.add('visited');

        const neighbours = [
            { x: currentX + 1, y: currentY },
            { x: currentX - 1, y: currentY },
            { x: currentX, y: currentY + 1 },
            { x: currentX, y: currentY - 1 }
        ];

        for (const neighbour of neighbours) {
            const { x, y } = neighbour;
            const key = `${x}-${y}`;
            if (
                isValid(x, y) &&
                !matrix[x][y].classList.contains('wall') &&
                !closedSet.has(key)
            ) {
                const tentativeGScore = gScore.get(`${currentX}-${currentY}`) + 1;
                if (!openSet.includes(key)) {
                    openSet.push(key);
                } else if (tentativeGScore >= gScore.get(key)) {
                    continue;
                }

                parent.set(key, { x: currentX, y: currentY });
                gScore.set(key, tentativeGScore);
                fScore.set(key, gScore.get(key) + heuristic(neighbour, target));
            }
        }

        requestAnimationFrame(visualize);
    }

    visualize();
}


function greedy() {
    const priorityQueue = new PriorityQueue();
    const visited = new Set();
    const parent = new Map();
    const queued = new Set();

    priorityQueue.enqueue(source, 0);
    queued.add(`${source.x}-${source.y}`);

    function heuristic(node, target) {
        return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
    }

    function visualize() {
        if (priorityQueue.isEmpty()) return;

        const current = priorityQueue.dequeue();
        const { x, y } = current;
        queued.delete(`${x}-${y}`);

        if (x === target.x && y === target.y) {
            drawPath(parent, target);
            return;
        }

        visited.add(`${x}-${y}`);

        matrix[x][y].classList.remove('unvisited');
        matrix[x][y].classList.add('visited');

        const neighbours = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;
            if (
                isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall') &&
                !visited.has(key) &&
                !queued.has(key)
            ) {
                const priority = heuristic(neighbour, target);
                priorityQueue.enqueue(neighbour, priority);
                parent.set(key, { x, y });
                queued.add(key);
            }
        }
        requestAnimationFrame(visualize);
        // setTimeout(visualize, 200);
    }

    visualize();
}

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.sort();
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    sort() {
        this.elements.sort((a, b) => a.priority - b.priority);
    }
}
