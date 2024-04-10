const mapSizeInput = document.getElementById('mapSize');
const addObstacleBtn = document.getElementById('addObstacleBtn');
const addStartBtn = document.getElementById('addStartBtn');
const addEndBtn = document.getElementById('addEndBtn');
const mapContainer = document.getElementById('map');
let startCell;
let endCell;
let openSet = [];
let closedSet = [];
let path = [];

function generateModifiedPrimMaze(width, height) {
    let maze = [];
    for (let h = 0; h < height; h++) {
        let row = [];
        for (let w = 0; w < width; w++) {
            row.push(1);
        }
        maze.push(row);
    }

    //выбираем случайную ячейку с нечетными координатами и очищаем ее.
    let x = getRandomOddNumber(width);
    let y = getRandomOddNumber(height);
    maze[y][x] = 0; 
    //создаем массив и добавляем координаты ячейки для проверки в массив
    let toCheck = [];
    if (y - 2 >= 0) {
        toCheck.push({ x: x, y: y - 2 });
    }
    if (y + 2 < height) {
        toCheck.push({ x: x, y: y + 2 });
    }
    if (x - 2 >= 0) {
        toCheck.push({ x: x - 2, y: y });
    }
    if (x + 2 < width) {
        toCheck.push({ x: x + 2, y: y });
    }

    //очищаем рандомную клетку
    while (toCheck.length > 0) {
        let index = getRandomNumber(toCheck.length);
        let cell = toCheck[index];
        x = cell.x;
        y = cell.y;
        maze[y][x] = 0;
        toCheck.splice(index, 1);

        //очищенную ячейку соединяем с другой чистой, далее очищенные пространства соединяем вместе
        let directions = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
        while (directions.length > 0) {
            let dirIndex = getRandomNumber(directions.length);
            let direction = directions[dirIndex];
            let nx = x + 2 * direction.dx;
            let ny = y + 2 * direction.dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx] === 1) {
                maze[y + direction.dy][x + direction.dx] = 0;
                break;
            }
            directions.splice(dirIndex, 1);
        }
           //добавляем соседние стенки в массив для проверки
        if (y - 2 >= 0 && maze[y - 2][x] === 1) {
            toCheck.push({ x: x, y: y - 2 });
        }
        if (y + 2 < height && maze[y + 2][x] === 1) {
            toCheck.push({ x: x, y: y + 2 });
        }
        if (x - 2 >= 0 && maze[y][x - 2] === 1) {
            toCheck.push({ x: x - 2, y: y });
        }
        if (x + 2 < width && maze[y][x + 2] === 1) {
            toCheck.push({ x: x + 2, y: y });
        }
    }

    return maze;
}

function getRandomOddNumber(max) {
    let number;
    do {
        number = Math.floor(Math.random() * max);
    } while (number % 2 === 0);
    return number;
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

function generateMap() {
  const n = parseInt(mapSizeInput.value);
  mapContainer.innerHTML = '';
  startCell = null;
  endCell = null;

  let maze = generateModifiedPrimMaze(n, n);

  //добавляем стенки по краям 
  for (let i = 0; i < n; i++) {
      maze[i][0] = 1; 
      maze[i][n - 1] = 1; 
  }
  for (let j = 0; j < n; j++) {
      maze[0][j] = 1; 
      maze[n - 1][j] = 1; 
  }

  //рисуем лабиринт
  for (let i = 0; i < n; i++) {
      const row = document.createElement('div');
      row.classList.add('row');
      for (let j = 0; j < n; j++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          if (maze[i][j] === 1) {
              cell.classList.add('obstacle');
          }
          cell.addEventListener('click', () => toggleCell(cell));
          row.appendChild(cell);
      }
      mapContainer.appendChild(row);
  }

  //случайные ячейки для начальной и конечной точек
  startCell = getRandomCell();
  startCell.classList.add('start');
  startCell.style.backgroundColor = 'red';
  startCell.textContent = "start";

  endCell = getRandomCell();
  endCell.classList.add('end');
  endCell.style.backgroundColor = 'green';
  endCell.textContent = "end";
}


function getRandomCell() {
    let randomCell;
    do {
        const rows = Array.from(document.querySelectorAll('.row'));
        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        const cells = Array.from(randomRow.querySelectorAll('.cell'));
        randomCell = cells[Math.floor(Math.random() * cells.length)];
    } while (randomCell.classList.contains('obstacle') || randomCell.classList.contains('start') || randomCell.classList.contains('end'));

    return randomCell;
}

function toggleCell(cell) {
    if (addStartBtn.classList.contains('active')) {
        if (cell === startCell) {
            cell.classList.remove('start');
            cell.style.backgroundColor = '';
            cell.textContent = '';
            startCell = null;
        } else {
            if (startCell) {
                startCell.classList.remove('start');
                startCell.textContent = '';
            }
            startCell = cell;
            startCell.classList.add('start');
            startCell.style.backgroundColor = 'red';
            startCell.textContent = "start";
        }
    } else if (addEndBtn.classList.contains('active')) {
        if (cell === endCell) {
            cell.classList.remove('end');
            cell.style.backgroundColor = '';
            cell.textContent = '';
            endCell = null;
        } else {
            if (endCell) {
                endCell.classList.remove('end');
                endCell.textContent = '';
            }
            endCell = cell;
            endCell.classList.add('end');
            endCell.style.backgroundColor = 'green';
            endCell.textContent = "end";
        }
    } else if (addObstacleBtn.classList.contains('active')) {
        cell.classList.toggle('obstacle');
    }
}

addObstacleBtn.addEventListener('click', () => {
    addObstacleBtn.classList.toggle('active');
    addStartBtn.classList.remove('active');
    addEndBtn.classList.remove('active');
});

addStartBtn.addEventListener('click', () => {
    addStartBtn.classList.toggle('active');
    addEndBtn.classList.remove('active');
    addObstacleBtn.classList.remove('active');
});

addEndBtn.addEventListener('click', () => {
    addEndBtn.classList.toggle('active');
    addStartBtn.classList.remove('active');
    addObstacleBtn.classList.remove('active');
});

function findPath() {
    aStar();
}

function getCellIndex(cell) {
    const row = cell.parentElement;
    const rowIndex = Array.from(mapContainer.children).indexOf(row);
    const colIndex = Array.from(row.children).indexOf(cell);
    return { row: rowIndex, col: colIndex };
}

function aStar() {
    openSet.push(startCell);

    let interval = setInterval(() => {
        if (openSet.length > 0) {
            //нахождение ячейки с наименьшим fscore
            let current = openSet[0];
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < current.f) {
                    current = openSet[i];
                }
            }

            //если текущая ячейка является конечной, то мы нашли путь
            if (current === endCell) {
                reconstructPath(current);
                clearInterval(interval);
                return;
            }

            //перемещение текущей ячейки из openset в closedset
            openSet = openSet.filter(cell => cell !== current);
            closedSet.push(current);

            //проверка соседей текущей ячейки
            const neighbors = getNeighbors(current);
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];

                //проверка на соседа в closedSet
                if (closedSet.includes(neighbor)) {
                    continue;
                }

                //вычисление gscore соседа
                const gScore = current.g + 1;

                if (!openSet.includes(neighbor) || gScore < neighbor.g) {
                    neighbor.g = gScore;
                    neighbor.h = calculateHeuristic(neighbor, endCell);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }

            //отрисовка текущей ячейки и соседей
            current.style.backgroundColor = 'yellow';
            neighbors.forEach(neighbor => {
                if (!neighbor.classList.contains('start') && !neighbor.classList.contains('end')) {
                    neighbor.style.backgroundColor = 'lightyellow';
                }
            });
        } else {
            clearInterval(interval);
            alert('Путь не найден, попробуйте ещё раз!');
        }
    }, 20);
}

function getNeighbors(cell) {
    const neighbors = [];
    const cellIndex = getCellIndex(cell);

    //верхняя ячейка
    if (cellIndex.row > 0) {
        const neighbor = mapContainer.children[cellIndex.row - 1].children[cellIndex.col];
        if (!neighbor.classList.contains('obstacle') && neighbor !== startCell) {
            neighbors.push(neighbor);
        }
    }

    //правая ячейка
    if (cellIndex.col < mapContainer.children[0].children.length - 1) {
        const neighbor = mapContainer.children[cellIndex.row].children[cellIndex.col + 1];
        if (!neighbor.classList.contains('obstacle') && neighbor !== startCell) {
            neighbors.push(neighbor);
        }
    }

    //нижняя ячейка
    if (cellIndex.row < mapContainer.children.length - 1) {
        const neighbor = mapContainer.children[cellIndex.row + 1].children[cellIndex.col];
        if (!neighbor.classList.contains('obstacle') && neighbor !== startCell) {
            neighbors.push(neighbor);
        }
    }

    //левая ячейка
    if (cellIndex.col > 0) {
        const neighbor = mapContainer.children[cellIndex.row].children[cellIndex.col - 1];
        if (!neighbor.classList.contains('obstacle') && neighbor !== startCell) {
            neighbors.push(neighbor);
        }
    }

    return neighbors;
}

function calculateHeuristic(cell1, cell2) {
    const cell1Index = getCellIndex(cell1);
    const cell2Index = getCellIndex(cell2);
    return Math.abs(cell1Index.row - cell2Index.row) + Math.abs(cell1Index.col - cell2Index.col);
}

function reconstructPath(current) {
    path.push(current);
    while (current.parent) {
        current = current.parent;
        path.unshift(current);
    }

    //отрисовка пути
    for (let i = 0; i < path.length - 1; i++) {
        setTimeout(() => {
            if (path[i] !== endCell) {
                path[i].style.backgroundColor = 'red';
            }
        }, 80 * i);
    }
}

document.querySelector('.bottontab1').addEventListener('click', () => {

  generateMap();
});

