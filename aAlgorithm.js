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

function generateMap() {
    const n = parseInt(mapSizeInput.value);
    mapContainer.innerHTML = '';
    startCell = null;
    endCell = null;

    for (let i = 0; i < n; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (Math.random() > 0.6) {
                cell.classList.add('obstacle');
            }

            cell.addEventListener('click', () => toggleCell(cell));
            row.appendChild(cell);
        }
        mapContainer.appendChild(row);
    }
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
    const rows = Array.from(document.querySelectorAll('.row'));
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    const cells = Array.from(randomRow.querySelectorAll('.cell'));
    return cells[Math.floor(Math.random() * cells.length)];
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
  
    while (openSet.length > 0) {
      // Нахождение ячейки с наименьшим f-score
      let current = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i];
        }
      }
  
      // Если текущая ячейка является конечной, то мы нашли путь
      if (current === endCell) {
        reconstructPath(current);
        return;
      }
  
      // Перемещение текущей ячейки из openSet в closedSet
      openSet = openSet.filter(cell => cell !== current);
      closedSet.push(current);
  
      // Рассмотрение соседей текущей ячейки
      const neighbors = getNeighbors(current);
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
  
        // Проверка, не находится ли сосед в closedSet
        if (closedSet.includes(neighbor)) {
          continue;
        }
  
        // Вычисление g-score соседа
        const gScore = current.g + 1;
  
        // Если сосед не в openSet или g-score соседа больше, чем через текущую ячейку
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
    }
  }

  function getNeighbors(cell) {
    const neighbors = [];
    const cellIndex = getCellIndex(cell);
  
    // Верхняя ячейка
    if (cellIndex.row > 0) {
      const neighbor = mapContainer.children[cellIndex.row - 1].children[cellIndex.col];
      if (!neighbor.classList.contains('obstacle') && neighbor !== startCell) {
        neighbors.push(neighbor);
      }
    }
  
    // Правая ячейка
    if (cellIndex.col < mapContainer.children[0].children.length - 1) {
      const neighbor = mapContainer.children[cellIndex.row].children[cellIndex.col + 1];
      if (!neighbor.classList.contains('obstacle') && neighbor !== startCell) {
        neighbors.push(neighbor);
      }
    }
  
    // Нижняя ячейка
    if (cellIndex.row < mapContainer.children.length - 1) {
      const neighbor = mapContainer.children[cellIndex.row + 1].children[cellIndex.col];
      if (!neighbor.classList.contains('obstacle') && neighbor !== startCell) {
        neighbors.push(neighbor);
      }
    }
  
    // Левая ячейка
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
  
    // Отрисовка пути
    for (let i = 0; i < path.length - 1; i++) {
      setTimeout(() => {
        if (path[i] !== endCell) {
          path[i].style.backgroundColor = 'turquoise';
        }
      }, 500 * i);
    }
  }
  
generateMap();