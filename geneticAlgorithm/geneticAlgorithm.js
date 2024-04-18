const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let points = [];
let originalPoints = [];

function printPoint(x, y, color ='black', thick = 8) {
    ctx.beginPath();
    ctx.arc(x, y, thick, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    printPoint(x, y);

    points.push({ x, y });
})

function distance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function createInitialPopulation(points, populationSize) { //создаем начальную популяцию маршрутов 
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        let route = points.slice();
        for (let j = route.length - 1; j > 0; j--) {  //перемешиваем массив
            const k = Math.floor(Math.random() * (j + 1));
            const temp = route[j];
            route[j] = route[k];
            route[k] = temp;
        }
        population.push(route);
    }
    return population;
}

function calculateFitness(population) {  //пригоден ли маршрут в попкляции
    let fitnessScores = [];
    for (let i = 0; i < population.length; i++) {
        let route = population[i];
        let totalDistance = 0;
        for (let j = 0; j < route.length - 1; j++) {
            totalDistance += distance(route[j], route[j + 1]);
        }
        totalDistance += distance(route[route.length - 1], route[0]); //добавляем расстояние от последней точки к первой
        fitnessScores.push(1 / totalDistance);
    }
    return fitnessScores;
}

function selectParents(population, fitnessScores) { //выбираем родителя
    let totalFitness = fitnessScores.reduce((a, b) => a + b, 0);
    let probabilities = fitnessScores.map(score => score / totalFitness);
    let cumulativeProbabilities = [];
    probabilities.reduce((a, b, i) => cumulativeProbabilities[i] = a + b, 0);
    let parents = [];
    for (let i = 0; i < 2; i++) {
        const random = Math.random();
        const index = cumulativeProbabilities.findIndex(prob => prob >= random);
        parents.push(population[index]);
    }
    return parents;
}

function crossover(parent1, parent2) {  //скрещиваем родителей 
    const start = Math.floor(Math.random() * parent1.length);
    const end = Math.floor(Math.random() * (parent1.length - start)) + start;
    const child = parent1.slice(start, end);
    parent2.forEach(point => {
        if (!child.includes(point)) {
            child.push(point);
        }
    })
    return child;
}

function mutate(child) {  //мутируем потомков
    const index1 = Math.floor(Math.random() * child.length);
    let index2 = Math.floor(Math.random() * child.length);
    while (index2 === index1) {
        index2 = Math.floor(Math.random() * child.length);
    }
    const temp = child[index1];
    child[index1] = child[index2];
    child[index2] = temp;
    return child;
}

async function geneticAlgorithm(points, populationSize, generations) {//сам генетический алгоритм
    let population = createInitialPopulation(points, populationSize);
    let bestRoute = population[0];
    let bestFitness = 0;
    
    for (let i = 0; i < generations; i++) {
        let fitnessScores = calculateFitness(population);
        let maxFitnessIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
        let maxFitness = fitnessScores[maxFitnessIndex];
        
        if (maxFitness > bestFitness) {
            bestRoute = population[maxFitnessIndex];
            bestFitness = maxFitness;
        }
        
        //отображаем промежуточный маршрут перед итерацией
        if (i !== generations - 1) {
            let route = population[maxFitnessIndex];
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.moveTo(route[0].x, route[0].y);
            for (let j = 1; j < route.length; j++) {
                ctx.lineTo(route[j].x, route[j].y);
            }
            ctx.lineTo(route[0].x, route[0].y);
            ctx.strokeStyle = 'gray';
            ctx.stroke();
            originalPoints.forEach(point => {
                printPoint(point.x, point.y);
            });  // Ожидание 20 миллисекунд между отрисовками
            await new Promise(resolve => setTimeout(resolve, 20)); 
        }
        
        let newPopulation = [];
        for (let j = 0; j < populationSize / 2; j++) {
            let parents = selectParents(population, fitnessScores);
            let child = crossover(parents[0], parents[1]);
            if (Math.random() < 0.2) {
                child = mutate(child);
            }
            newPopulation.push(child);
        }
        population = newPopulation;
    }
    
        //отрисовка окончательного маршрута
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(bestRoute[0].x, bestRoute[0].y);
    for (let i = 1; i < bestRoute.length; i++) {
        ctx.lineTo(bestRoute[i].x, bestRoute[i].y);
    }
    ctx.lineTo(bestRoute[0].x, bestRoute[0].y);
    ctx.strokeStyle = 'green';
    ctx.stroke();
    originalPoints.forEach(point => {
        printPoint(point.x, point.y);
    });
}

    //сравнения массивов точек
function isEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].x !== arr2[i].x || arr1[i].y !== arr2[i].y) return false;
    }
    return true;
}

document.getElementById("findGenetic").onclick = function() {
    originalPoints = points.slice();
    populationSize = document.getElementById('populationSize').value;
    generations = document.getElementById('generations').value;
    geneticAlgorithm(originalPoints, populationSize, generations);
}

document.getElementById("clearCanvas").onclick = function() {
    points = []; 
    ctx.clearRect(0, 0, width, height);
}