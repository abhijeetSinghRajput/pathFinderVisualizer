let searchToAnimate;
let pathToAnimate;
const visualizeBtn = document.getElementById('visualize');

visualizeBtn.addEventListener('click', () => {
    clearPath();
    searchToAnimate = [];
    pathToAnimate = [];
    switch (algorithm) {
        case '': BFS(); break;
        case 'BFS': BFS(); break;
        case 'Greedy': greedy(); break;
        case 'Dijkstra\'s': Dijkstra(); break;
        case 'A*': Astar(); break;
        case 'DFS':
            if (DFS(source)) pathToAnimate.push(matrix[source.x][source.y])
            break;
        default: break;
    }

    animate(searchToAnimate, 'visited', delay);
});





// ==========================================================
// ======================= BFS ⚙️🦾 ========================
// ==========================================================
function BFS() {
    const queue = [];
    const visited = new Set();
    const parent = new Map();
    queue.push(source);
    visited.add(`${source.x}-${source.y}`);

    while (queue.length > 0) {
        const current = queue.shift();

        if (current.x === target.x && current.y === target.y) {
            backtracking(parent, target);
            return;
        }
        searchToAnimate.push(matrix[current.x][current.y]);

        const neighbours = getNeighbours(current);

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
    }

}





// ==========================================================
// ===================== Dijkstra ⚙️🦾 =====================
// ==========================================================

function Dijkstra() {
    const pq = new PriorityQueue();
    const parent = new Map();
    const distance = [];

    for (let i = 0; i < row; i++) {
        const INF = [];
        for (let j = 0; j < col; j++) {
            INF.push(Infinity);
        }
        distance.push(INF);
    }

    distance[source.x][source.y] = 0;
    pq.push({ cordinate: source, cost: 0 });

    while (!pq.isEmpty()) {
        const { cordinate: current, cost: distanceSoFar } = pq.pop();
        searchToAnimate.push(matrix[current.x][current.y]);

        //you find the target
        if (current.x === target.x && current.y === target.y) {
            backtracking(parent, target);
            return;
        }

        const neighbours = getNeighbours(current);

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;

            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall')
            ) {
                //Assuming edge weight = 1, between adjacent vertices
                const edgeWeight = 1;
                const distanceToNeighbour = distanceSoFar + edgeWeight;

                if (distanceToNeighbour < distance[neighbour.x][neighbour.y]) {
                    distance[neighbour.x][neighbour.y] = distanceToNeighbour;
                    pq.push({ cordinate: neighbour, cost: distanceToNeighbour });
                    parent.set(key, current);
                }
            }
        }
    }
}





// ==========================================================
// ======================= Astar ⚙️🦾 ======================
// ==========================================================

function Astar() {
    const queue = new PriorityQueue();;
    const visited = new Set();//closedset
    const queued = new Set();//openset
    const parent = new Map();
    const gScore = [];

    for (let i = 0; i < row; i++) {
        const INF = [];
        for (let j = 0; j < col; j++) {
            INF.push(Infinity);
        }
        gScore.push(INF);
    }

    gScore[source.x][source.y] = 0;
    queue.push({ cordinate: source, cost: heuristicValue(source) });
    visited.add(`${source.x}-${source.y}`);

    while (queue.length > 0) {
        const { cordinate: current } = queue.pop();
        searchToAnimate.push(matrix[current.x][current.y]);

        //you find the target
        if (current.x === target.x && current.y === target.y) {
            backtracking(parent, target);
            return;
        }

        visited.add(`${current.x}-${current.y}`);

        const neighbours = getNeighbours(current);

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;

            if (isValid(neighbour.x, neighbour.y) &&
                !visited.has(key) &&
                !queued.has(key) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall')
            ) {

                //Assuming edge weight = 1, between adjacent vertices
                const edgeWeight = 1;
                const gScoreToNeighbour = gScore[current.x][current.y] + edgeWeight;
                const fScore = gScoreToNeighbour + heuristicValue(neighbour);

                if (gScoreToNeighbour < gScore[neighbour.x][neighbour.y]) {
                    gScore[neighbour.x][neighbour.y] = gScoreToNeighbour;

                    queue.push({ cordinate: neighbour, cost: fScore });
                    queued.add(key);//openset

                    parent.set(key, current);
                }
            }
        }
    }
}





// ==========================================================
// ====================== Greedy ⚙️🦾 ======================
// ==========================================================

function greedy() {
    const queue = new PriorityQueue();
    const visited = new Set();
    const parent = new Map();

    queue.push({ cordinate: source, cost: heuristicValue(source) });
    visited.add(`${source.x}-${source.y}`);

    while (queue.length > 0) {
        const { cordinate: current } = queue.pop();
        searchToAnimate.push(matrix[current.x][current.y]);

        //you find the target
        if (current.x === target.x && current.y === target.y) {
            backtracking(parent, target);
            return;
        }

        const neighbours = [
            { x: current.x - 1, y: current.y },//up
            { x: current.x, y: current.y + 1 },//right
            { x: current.x + 1, y: current.y },//bottom
            { x: current.x, y: current.y - 1 }//right
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;

            if (isValid(neighbour.x, neighbour.y) &&
                !visited.has(key) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall')
            ) {
                queue.push({ cordinate: neighbour, cost: heuristicValue(neighbour) });
                visited.add(key);
                parent.set(key, current);
            }
        }
    }
}





// ==========================================================
// ======================== DFS ⚙️🦾 =======================
// ==========================================================
const visited = new Set();
function DFS(current) {
    //base case
    if (current.x === target.x && current.y === target.y) {
        return true;
    }

    searchToAnimate.push(matrix[current.x][current.y]);
    visited.add(`${current.x}-${current.y}`);

    const neighbours = getNeighbours(current);

    for (const neighbour of neighbours) {
        if (isValid(neighbour.x, neighbour.y) &&
            !visited.has(`${neighbour.x}-${neighbour.y}`) &&
            !matrix[neighbour.x][neighbour.y].classList.contains('wall')) {
            if (DFS(neighbour)) {
                pathToAnimate.push(matrix[neighbour.x][neighbour.y]);
                return true;
            }

        }
    }

    return false;
}