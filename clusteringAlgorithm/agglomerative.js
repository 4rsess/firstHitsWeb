import { points, printPoint, getHypot, clustersCount } from "./main.js";

export function agglomerativeClustering() {
    let colors = ['red', 'orange', 'yellow', 'green', '#89CFEF', 'blue']
    let clusters = points.map(point => ({ points: [point], centroid: point }))

    while (clusters.length > clustersCount) {
        let closestClustersIndexes = findClosestClusters(clusters)    
        clusters = mergeClusters(clusters, closestClustersIndexes)
    }

    clusters.forEach((cluster, index) => {
        let color = colors[index % colors.length]
        cluster.points.forEach(point => {
            printPoint(point.x, point.y, color)
            printPoint(point.x, point.y, 'white', 4)
        })
    })
}

function findClosestClusters(clusters) {
    let minDistance = Infinity;
    let closestClusters = [];

    for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
            let distance = getHypot(clusters[i].centroid, clusters[j].centroid)
            if (distance < minDistance) {
                minDistance = distance
                closestClusters = [i, j]
            }
        }
    }

    return closestClusters;
}

function mergeClusters(clusters, indexes) {
    let cluster1 = clusters[indexes[0]]
    let cluster2 = clusters[indexes[1]]

    let newCentroid = {
        x: (cluster1.centroid.x + cluster2.centroid.x) / 2,
        y: (cluster1.centroid.y + cluster2.centroid.y) / 2
    };

    let newCluster = {
        points: [...cluster1.points, ...cluster2.points],
        centroid: newCentroid
    };

    clusters.splice(indexes[1], 1)
    clusters.splice(indexes[0], 1, newCluster)

    return clusters
}