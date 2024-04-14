import { dbscan } from './dbscan.js';
import { agglomerativeClustering } from './agglomerative.js';
import { kMeans } from './kMeans.js'

export const canvas = document.getElementById('canvas')
export const ctx = canvas.getContext('2d')
export const width = canvas.width
export const height = canvas.height
export let points = []
export let clustersCount
export let eps
export let minPoints

export function printPoint(x, y, color ='black', thick = 6) {
    ctx.beginPath()
    ctx.arc(x, y, thick, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
}

export function getHypot(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)
}

canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    printPoint(x, y)

    points.push({ x, y })
})


document.getElementById("findClusters").onclick = function() {
    ctx.clearRect(0, 0, width, height)

    clustersCount = parseInt(document.getElementById('clustersCount').value)
    minPoints = parseInt(document.getElementById('minPoints').value) - 1
    eps = parseInt(document.getElementById('eps').value)

    agglomerativeClustering()
    kMeans()
    dbscan()
}

document.getElementById("clearCanvas").onclick = function() {
    points = []
    ctx.clearRect(0, 0, width, height)
}