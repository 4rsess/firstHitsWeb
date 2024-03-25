const mapSizeInput = document.getElementById('mapSize');
const addObstacleBtn = document.getElementById('addObstacleBtn');
const addStartBtn = document.getElementById('addStartBtn');
const addEndBtn = document.getElementById('addEndBtn');
const mapContainer = document.getElementById('map');
let startCell;
let endCell;

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

generateMap();
