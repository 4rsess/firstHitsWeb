const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

let colors = ['red', 'green', 'blue', 'grey', 'purple', 'yellow']
let points = []
let centroids = []
let tempCentroids = []
let clustersCount = 3
let centroidsMoved = true

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
    points.length = 0
    centroids.length = 0
    ctx.clearRect(0, 0, width, height)
}

function findClusters() {
    generateCentroids()
    tempCentroids = centroids

    while(centroidsMoved) {
        centroidsMoved = false
        updateCentroids()
    }

    centroidsMoved = true

    for (let i = 0; i < tempCentroids.length; i++) {
        printPoint(tempCentroids[i].x, tempCentroids[i].y, colors[i], 8)
    }
}

function generateCentroids() {
    if (centroids.length > 0) {
        centroids.length = 0

        ctx.clearRect(0, 0, width, height)

        points.forEach (point => {
            printPoint(point.x, point.y)
        })
    }

    for (let i = 0; i < clustersCount; i++) {
        let x = Math.random() * width
        let y = Math.random() * height
        
        printPoint(x, y, colors[i])

        centroids.push( { x, y } )
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
        newPoints.push( {x, y, color} )
    }

    points = newPoints

    for (let i = 0; i < centroids.length; i++) {
        printPoint(centroids[i].x, centroids[i].y, colors[i], 8)
    }
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

function getHypot(point, centroid) {
    return Math.sqrt(Math.pow((point.x - centroid.x), 2) + Math.pow((point.y - centroid.y), 2))
}