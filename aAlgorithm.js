const mapSizeInput = document.getElementById('mapSize');
const generateMapBtn = document.getElementById('generateMapBtn');
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

            if (Math.random() < 0.2 + Math.random() * 0.3) {
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

function toggleCell(cell) {
    cell.classList.toggle('obstacle');
}

function getRandomCell() {
    const rows = Array.from(document.querySelectorAll('.row'));
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    const cells = Array.from(randomRow.querySelectorAll('.cell'));
    return cells[Math.floor(Math.random() * cells.length)];
}

generateMap();
