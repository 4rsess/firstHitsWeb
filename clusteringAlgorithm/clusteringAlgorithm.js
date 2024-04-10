const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

let colors = ['red', 'green', 'blue', 'grey', 'purple', 'yellow']
let eps = parseInt(document.getElementById('eps').value)
let minPoints = parseInt(document.getElementById('minPoints').value)
let clustersCount = parseInt(document.getElementById('clustersCount').value)
let points = []
let centroids = []

function printPoint(x, y, color ='black', thick = 3) {
    ctx.beginPath()
    ctx.arc(x, y, thick, 0, Math.PI * 2)
    ctx.fillStyle = color
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
    points = []
    ctx.clearRect(0, 0, width, height)
}

function findClusters() {
    kMeans()
}

function dbscan() {
    let clusters = []
    let visited = new Set()
    let noise = new Set()

    for (let i = 0; i < points.length; i++) { 
        const nowPoint = points[i]
        if (visited.has(nowPoint)){
            continue
        }

        visited.add(nowPoint)
        const neighbors = findNeighbors(nowPoint, points, eps)

        if (neighbors.length < minPoints) { 
            noise.add(nowPoint)
            continue
        }
        const cluster = [nowPoint]
        clusters.push(cluster)

        let checks = new Set(neighbors)
        while (checks.size > 0) { 
            const checkPoint = checks.values().next().value
            visited.add(checkPoint)

            const checkPointNeighbors = findNeighbors(checkPoint, points, eps)

            if (checkPointNeighbors.length >= minPoints){
                checkPointNeighbors.forEach(j =>{
                    if (!visited.has(j)) {
                        checks.add(j)
                        visited.add(j)
                    }
                });
            }

            if (!noise.has(checkPoint)) {
                cluster.push(checkPoint)
            }
            checks.delete(checkPoint)
        }
    }
    
    for (let i = 0; i < clusters.length; i++) {
        for (let j = 0; j < clusters[i].length; j++) { 
            let index = points.indexOf(clusters[i][j])
            printPoint(points[index].x, points[index].y, colors[i])
        }
    }
}

function findNeighbors(point) { 
    let neighbors = []

    for (let i = 0; i < points.length; i++) { 
        if (point === points[i]) {
            continue
        }
        let distance = getHypot(point, points[i])
        if (distance < eps) {
            neighbors.push(points[i])
        }
    }
    return neighbors
}

function kMeans() {
    generateCentroids()
    let centroidsMoved = true

    while(centroidsMoved) {
        centroidsMoved = false
        updateCentroids()
    }

    centroidsMoved = true
}

function generateCentroids() {
    if (centroids.length > 0) {
        centroids = []

        ctx.clearRect(0, 0, width, height)

        points.forEach(point => {
            printPoint(point.x, point.y)
        })
    }

    centroids.push(points[Math.floor(Math.random() * points.length)])
    printPoint(centroids[0].x, centroids[0].y, colors[0])

    let sumDistances = []

    for (let i = 1; i < clustersCount; i++) {
        sumDistances.length = 0

        let sum = 0;
        points.forEach (point =>  {
            let minDistance = 1e5
            centroids.forEach (centroid => {
                let distance = getHypot(point, centroid)
                minDistance = Math.min(minDistance, distance)
            })
            sum += Math.pow(minDistance , 2)
            sumDistances.push({ point, sum })
        })

        let randomValue = Math.random() * sum

        let selectedPoint
        for (let { point, sum } of sumDistances) {
            if (randomValue <= sum) {
                selectedPoint = point
                break
            }
        }

        centroids.push(selectedPoint)
        printPoint(selectedPoint.x, selectedPoint.y, colors[i])
    }

    correlatePointsToCentroids()
}

function correlatePointsToCentroids() {
    ctx.clearRect(0, 0, width, height)

    let newPoints = []

    for (let i = 0; i < points.length; i++) {
        let closeCentroidIndex
        let distance = 1e5

        for (let j = 0; j < clustersCount; j++) {
            let currentDistance = getHypot(points[i], centroids[j])
            if (currentDistance < distance) {
                distance = currentDistance
                closeCentroidIndex = j
            }
        }

        let x = points[i].x
        let y = points[i].y
        let color = colors[closeCentroidIndex]

        printPoint(x, y, color)
        newPoints.push({ x, y, color })
    }

    points = newPoints
}

function updateCentroids() {
    let newCentroids = []

    for (let i = 0; i < clustersCount; i++) {
        let clusterPoints = points.filter(point => point.color === colors[i])
        
        if (clusterPoints.length !== 0) {
            let sumX = 0
            let sumY = 0
            let length = clusterPoints.length
            
            for (let j = 0; j < length; j++) {        
                sumX += clusterPoints[j].x
                sumY += clusterPoints[j].y       
            }
            
            let newX = sumX / length
            let newY = sumY / length
            
            if (centroids[i].x !== newX || centroids[i].y !== newY) {
                centroidsMoved = true
            }

            newCentroids.push({ x: newX, y: newY })
        } else {
            newCentroids.push(centroids[i])
        }
    }

    centroids = newCentroids
    correlatePointsToCentroids()
}

function getHypot(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)
}