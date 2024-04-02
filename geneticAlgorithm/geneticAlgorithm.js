const canvas = document.getElementById('geneticCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let points = [];
let centroids = [];

function printPoint(x, y, color ='black', thick = 5) {
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

function clearCanvas() {
    points.length = 0;
    centroids.length = 0;
    ctx.clearRect(0, 0, width, height);
}

function distance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function createInitialPopulation(points, populationSize) { //создаем начальную популяцию маршрутов 
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        let route = points.slice();
        for (let j = route.length - 1; j > 0; j--) {   //перемешиваем массив
            const k = Math.floor(Math.random() * (j + 1));
            const temp = route[j];
            route[j] = route[k];
            route[k] = temp;
        }
        population.push(route);
    }
    return population;
}

function calculateFitness(population) {   //пригоден ли маршрут в попкляции
    let fitnessScores = [];
    for (let i = 0; i < population.length; i++) {
        let route = population[i];
        let totalDistance = 0;
        for (let j = 0; j < route.length - 1; j++) {
            totalDistance += distance(route[j], route[j + 1]);
        }
        totalDistance += distance(route[route.length - 1], route[0]); //добавляем расстояние от последней точки к первой
        fitnessScores.push(1 / totalDistance) ;
    }
    return fitnessScores;
}

function selectParents(population, fitnessScores) {  //рандомно выбираем родителя
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

function crossover(parent1, parent2) { //скрещиваем родителей 
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

function geneticAlgorithm(points, populationSize, generations) {  //сам генетический алгоритм
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
            ctx.clearRect(0, 0, width, height);  //отрисовка маршрута
            ctx.beginPath();
            ctx.moveTo(bestRoute[0].x, bestRoute[0].y);
            for (let j = 1; j < bestRoute.length; j++) {
                ctx.lineTo(bestRoute[j].x, bestRoute[j].y);
            }
            ctx.lineTo(bestRoute[0].x, bestRoute[0].y)
            ctx.strokeStyle = 'black';
            ctx.stroke();
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
}

function findGenetic() { //размер популяции и кол-во поколений
    const populationSize = 100; 
    const generations = 100;  
    geneticAlgorithm(points, populationSize, generations);
}
