const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
let points = [];

function printPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    printPoint(x, y);

    points.push({ x, y });
});

function clearCanvas() {
    points.length = 0;
    ctx.clearRect(0, 0, width, height);
}

function calculateDistances(points) {
    const graph = [];
    for (let i = 0; i < points.length; i++) {
        graph[i] = [];
        for (let j = 0; j < points.length; j++) {
            if (i === j) {
                graph[i][j] = Infinity;
            } else {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                graph[i][j] = Math.sqrt(dx * dx + dy * dy);
            }
        }
    }
    return graph;
}

function initializePheromone(numPoints) {
    const pheromone = [];
    for (let i = 0; i < numPoints; i++) {
        pheromone[i] = [];
        for (let j = 0; j < numPoints; j++) {
            pheromone[i][j] = 0.1;
        }
    }
    return pheromone;
}

async function findWayAndDraw() {
    let numAnts = parseInt(document.getElementById('numAnts').value);
    let numIterations = parseInt(document.getElementById('numIterations').value);
    let evaporationRate = parseInt(document.getElementById('evaporationRate').value);
    const alpha = 1;
    const beta = 2;
    
    const graph = calculateDistances(points);
    let pheromone = initializePheromone(points.length);
    let bestPath = [];

    for (let iteration = 0; iteration < numIterations; iteration++) {
        for (let ant = 0; ant < numAnts; ant++) {
            const path = generateAntPath(graph, pheromone, alpha, beta);
            const pathLength = calculatePathLength(graph, path);
            updatePheromone(pheromone, path, pathLength);
            if (!bestPath.length || pathLength < calculatePathLength(graph, bestPath)) {
                bestPath = path.slice();
            }
        }
        updatePheromoneGlobal(pheromone, evaporationRate);
        drawBestPath(bestPath);
        await sleep(150);
    }

    drawBestPath(bestPath);
}

function sleep(ms) {
    return new Promise(findWayAndDraw => setTimeout(findWayAndDraw, ms));
}

function generateAntPath(graph, pheromone, alpha, beta) {
    const path = [];
    const visited = new Set();
    let current = Math.floor(Math.random() * graph.length);
    path.push(current);
    visited.add(current);

    while (visited.size < graph.length) {
        const probabilities = calculateProbabilities(graph, pheromone, current, visited, alpha, beta);
        const next = selectNextNode(probabilities);
        path.push(next);
        visited.add(next);
        current = next;
    }

    path.push(path[0]);
    return path;
}

function calculateProbabilities(graph, pheromone, current, visited, alpha, beta) {
    const probabilities = [];
    let total = 0;

    for (let i = 0; i < graph.length; i++) {
        if (!visited.has(i)) {
            const pheromoneValue = pheromone[current][i];
            const heuristic = 1 / graph[current][i];
            const probability = Math.pow(pheromoneValue, alpha) * Math.pow(heuristic, beta);
            probabilities.push({ node: i, probability });
            total += probability;
        }
    }

    probabilities.forEach(prob => {
        prob.probability /= total;
    });

    return probabilities;
}

function selectNextNode(probabilities) {
    const random = Math.random();
    let sum = 0;

    for (let i = 0; i < probabilities.length; i++) {
        sum += probabilities[i].probability;
        if (random <= sum) {
            return probabilities[i].node;
        }
    }

    return probabilities[probabilities.length - 1].node;
}

function calculatePathLength(graph, path) {
    let length = 0;
    for (let i = 0; i < path.length - 1; i++) {
        length += graph[path[i]][path[i + 1]];
    }
    return length;
}

function updatePheromone(pheromone, path, pathLength) {
    const pheromoneDeposit = 1 / pathLength;
    for (let i = 0; i < path.length - 1; i++) {
        pheromone[path[i]][path[i + 1]] += pheromoneDeposit;
    }
}

function updatePheromoneGlobal(pheromone, evaporationRate) {
    for (let i = 0; i < pheromone.length; i++) {
        for (let j = 0; j < pheromone[i].length; j++) {
            pheromone[i][j] *= evaporationRate;
        }
    }
}

function drawBestPath(bestPath) {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(points[bestPath[0]].x, points[bestPath[0]].y);
    for (let i = 1; i < bestPath.length; i++) {
        const pointIndex = bestPath[i];
        ctx.lineTo(points[pointIndex].x, points[pointIndex].y);
    }
    ctx.lineTo(points[bestPath[0]].x, points[bestPath[0]].y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    points.forEach(point => {
        printPoint(point.x, point.y);
    });
}

function findWay() {
    findWayAndDraw();
}