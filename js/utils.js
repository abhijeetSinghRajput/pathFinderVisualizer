//check outBound of matrix 
function isValid(x, y) {
    return (x >= 0 && y >= 0 && x < row && y < col);
}

//method for setting target and source
let source;
let target;
function set(className, x = -1, y = -1) {
    if (isValid(x, y)) {
        matrix[x][y].classList.add(className);
    }
    else {
        x = Math.floor(Math.random() * row);
        y = Math.floor(Math.random() * col);
        matrix[x][y].classList.add(className);
    }
    return { x, y };
}

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

function backtrack(parents, target) {
    let arr = [];
    while (target) {
        arr.push(matrix[target.x][target.y]);
        if (target == source) return arr;
        target = parents.get(`${target.x}-${target.y}`);
    }
    return arr;
}

function getNeighbours(current){
    return [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
    ];
}

function heuristicValue(node) {
    return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
}

// ==========================================================
// ==================== ANIMATION ⚙️🦾 =====================
// ==========================================================
let timeoutIds = [];
function clearPreviousTimeouts() {
    for (let id of timeoutIds) {
        clearTimeout(id);
    }
    timeoutIds = [];
}

function animate(list, className, delay) {
    clearPreviousTimeouts(); 
    if(algorithm == 'Bi' && className == 'visited'){
        delay /= 1.5;
    }
    for (let i = 0; i < list.length; i++) {
        let timeoutId = setTimeout(() => {
            if (className === 'wall') {
                list[i].setAttribute('class', `col ${className}`);
            } else {
                list[i].classList.remove('visited', 'unvisited', 'path');
                list[i].classList.add(className);
            }

            // After searching is done, animate the path
            if (className === 'visited' && i === list.length - 1) {
                animate(pathToAnimate, 'path', delay);
            }
        }, (className === 'path') ? i * (delay + 20) : i * delay);

        timeoutIds.push(timeoutId);  
    }
}



class PriorityQueue {
    constructor() {
        this.elements = [];
        this.length = 0;
    }
    push(data) {
        this.elements.push(data);
        this.length++;
        this.upHeapify(this.length - 1);
    }
    pop() {
        this.swap(0, this.length - 1);
        const popped = this.elements.pop();
        this.length--;
        this.downheapify(0);
        return popped;
    }

    upHeapify(i) {
        if (i === 0) return;
        const parent = Math.floor((i - 1) / 2);
        if (this.elements[i].cost < this.elements[parent].cost) {
            this.swap(parent, i);
            this.upHeapify(parent);
        }
    }
    downheapify(i) {
        let minNode = i;
        const leftChild = (2 * i) + 1;
        const rightChild = (2 * i) + 2;

        if (leftChild < this.length && this.elements[leftChild].cost < this.elements[minNode].cost) {
            minNode = leftChild;
        }
        if (rightChild < this.length && this.elements[rightChild].cost < this.elements[minNode].cost) {
            minNode = rightChild;
        }

        if (minNode !== i) {
            this.swap(minNode, i);
            this.downheapify(minNode);
        }
    }
    isEmpty() {
        return this.length === 0;
    }
    swap(x, y) {
        [this.elements[x], this.elements[y]] = [this.elements[y], this.elements[x]];
    }
}
