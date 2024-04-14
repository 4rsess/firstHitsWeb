import { points, getHypot, ctx, eps, minPoints } from "./main.js";

export function dbscan() {
    let colors = ['cyan', '#622A0F', '#00A86B', '#E0115F', '#E4CD05', '#C7EA46']
    let clusters = []
    let visited = []
    let noise = []

    for (let i = 0; i < points.length; i++) {
        let currentPoint = points[i]
        if (visited.includes(currentPoint)) {
            continue
        }

        visited.push(currentPoint)
        let neighbours = findNeighbours(currentPoint)

        if (neighbours.length < minPoints) {
            noise.push(currentPoint)
            continue
        }

        let cluster = [currentPoint]
        clusters.push(cluster)
        
        let checks = [...neighbours]
        while (checks.length > 0) {
            let checkPoint = checks.shift()
            visited.push(checkPoint)
            
            let checkPointNeighbors = findNeighbours(checkPoint)

            if (checkPointNeighbors.length >= minPoints) {
                for (let j = 0; j < checkPointNeighbors.length; j++) {
                    if (!visited.includes(checkPointNeighbors[j])) {
                        checks.push(checkPointNeighbors[j])
                        visited.push(checkPointNeighbors[j])
                    }
                }
            }

            if (!noise.includes(checkPoint)) {
                cluster.push(checkPoint)
            }
        }
    }

    for (let i = 0; i < clusters.length; i++) {
        for (let j = 0; j < clusters[i].length; j++) {
            let index = points.indexOf(clusters[i][j])
            drawX(points[index].x, points[index].y, colors[i])
        }
    }

    noise.forEach (point => {
        drawX(point.x, point.y)
    })
}

function findNeighbours(point) {
    let neighbours = []

    for (let i = 0; i < points.length; i++) {
        if (point === points[i]) {
            continue
        }

        let distance = getHypot(point, points[i])
        
        if (distance < eps) {
            neighbours.push(points[i])
        }
    }
    
    return neighbours
}

function drawX(x, y, color = 'black') {
    ctx.beginPath()
    ctx.strokeStyle = color

    ctx.moveTo(x - 7, y - 7)
    ctx.lineTo(x + 7, y + 7)

    ctx.moveTo(x + 7, y - 7)
    ctx.lineTo(x - 7, y + 7)

    ctx.stroke()
}