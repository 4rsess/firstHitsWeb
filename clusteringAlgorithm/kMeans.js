import { points, getHypot, ctx, clustersCount } from "./main.js";

let centroids = []
let colors = ['#FCA3B7', '#7852A9', '#877F7B', '#5097A4', '#795C32', '#3E424B']
let tmpPoints
let centroidsMoved

export function kMeans() {
    tmpPoints = points

    generateCentroids()
    
    centroids.Moved = true
    while(centroidsMoved) {
        centroidsMoved = false
        updateCentroids()
    }

    tmpPoints.sort((a, b) => a.color.localeCompare(b.color))

    let currentColor = null;
    
    ctx.beginPath();
    tmpPoints.forEach(point => {
        if (point.color !== currentColor) {
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = point.color;
            ctx.moveTo(point.x, point.y);
            currentColor = point.color;
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();
}

function generateCentroids() {
    if (centroids.length > 0) {
        centroids = []
    }

    centroids.push(tmpPoints[Math.floor(Math.random() * tmpPoints.length)])

    let sumDistances = []

    for (let i = 1; i < clustersCount; i++) {
        sumDistances.length = 0

        let sum = 0;
        tmpPoints.forEach (point =>  {
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
    }

    correlatePointsToCentroids()
}

function correlatePointsToCentroids() {
    let newPoints = []

    for (let i = 0; i < tmpPoints.length; i++) {
        let closeCentroidIndex
        let distance = 1e5

        for (let j = 0; j < clustersCount; j++) {
            let currentDistance = getHypot(tmpPoints[i], centroids[j])
            if (currentDistance < distance) {
                distance = currentDistance
                closeCentroidIndex = j
            }
        }

        let x = tmpPoints[i].x
        let y = tmpPoints[i].y
        let color = colors[closeCentroidIndex]

        newPoints.push({ x, y, color })
    }

    tmpPoints = newPoints
}

function updateCentroids() {
    let newCentroids = []

    for (let i = 0; i < clustersCount; i++) {
        let clusterPoints = tmpPoints.filter(point => point.color === colors[i])
        
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