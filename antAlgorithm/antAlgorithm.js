const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

let points = []

function printPoint(x, y) {
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = 'black'
    ctx.fill()
    ctx.closePath()
}

canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    printPoint(x, y)

    points.push({ x, y })
})

function clearCanvas() {
    points.length = 0
    ctx.clearRect(0, 0, width, height)
}

function findWay() {
    const antsCount = 10
    const iterations = 100
    const evaporationRate = 0.5
    const alpha = 1
    const beta = 1

    let pheromones = initializePheromones();

    for (let iteration = 0; iteration < iterations; iteration++) {
        for (let ant = 0; ant < antsCount; ant++) {
            let path = findPath(pheromones, alpha, beta)

            updatePheromones(pheromones, path)
        }

        evaporatePheromones(pheromones, evaporationRate)
    }

    drawPath(findPath(pheromones))
}

function initializePheromones() {
    let pheromones = []
    for (let i = 0; i < points.length; i++) {
        pheromones[i] = []
        for (let j = 0; j < points.length; j++) {
            pheromones[i][j] = 1
        }
    }
    return pheromones
}

function getHypot(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}

function findPath(pheromones, alpha, beta) {
    let antPath = []
    let startPoint = Math.floor(Math.random() * points.length)
    antPath.push(startPoint)

    while (antPath.length < points.length) {
        let probabilities = []
        let probabilitiesSum = 0

        for (let i = 0; i < points.length; i++) {
            if (!antPath.includes(i)) {
                let pheromone = pheromones[startPoint][i]
                let distance = getHypot(points[startPoint], points[i])
                let probability = Math.pow(pheromone, alpha) * Math.pow(1 / distance, beta)
                probabilities.push({ index: i, probability: probability })
                probabilitiesSum += probability
            }
        }

        let randomValue = Math.random() * probabilitiesSum
        let cumulativeProbability = 0
        let chosenIndex
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i].probability
            if (cumulativeProbability >= randomValue) {
                chosenIndex = probabilities[i].index
                break
            }
        }

        antPath.push(chosenIndex)
        startPoint = chosenIndex
    }

    return antPath
}

function updatePheromones(pheromones, path) {
    const pheromoneDeposit = 100

    for (let i = 0; i < path.length - 1; i++) {
        let from = path[i]
        let to = path[i + 1]
        pheromones[from][to] += pheromoneDeposit / getHypot(points[from], points[to])
        pheromones[to][from] = pheromones[from][to]
    }
}

function evaporatePheromones(pheromones, evaporationRate) {
    for (let i = 0; i < pheromones.length; i++) {
        for (let j = 0; j < pheromones.length; j++) {
            pheromones[i][j] *= evaporationRate
        }
    }
}

function findPath(pheromones) {
    let bestPath = []
    let bestPathLength = 1e5

    for (let i = 0; i < points.length; i++) {
        let currentPoint = i
        let visited = Array(points.length).fill(false)
        let path = [currentPoint]
        let length = 0

        while (path.length < points.length) {
            visited[currentPoint] = true
            let nextPoint = null
            let maxPheromone = -1

            for (let j = 0; j < points.length; j++) {
                if (!visited[j] && pheromones[currentPoint][j] > maxPheromone) {
                    maxPheromone = pheromones[currentPoint][j]
                    nextPoint = j
                }
            }

            path.push(nextPoint)
            length += getHypot(points[currentPoint], points[nextPoint])
            currentPoint = nextPoint
        }

        length += getHypot(points[currentPoint], points[i])

        if (length < bestPathLength) {
            bestPath = [...path, i]
            bestPathLength = length
        }
    }

    return bestPath
}

function drawPath(bestPath) {
    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.moveTo(points[bestPath[0]].x, points[bestPath[0]].y)

    for (let i = 1; i < bestPath.length; i++) {
        ctx.lineTo(points[bestPath[i]].x, points[bestPath[i]].y)
    }

    ctx.lineTo(points[bestPath[0]].x, points[bestPath[0]].y)
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.stroke()

    points.forEach(point => {
        printPoint(point.x, point.y)
    })
}