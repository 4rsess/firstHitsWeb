function parseCSV(csv) {
    const lines = csv.split("\n").slice(1); 
    const headers = csv.split("\n")[0].split(",").map(header => header.trim());  //получение заголовков и удаление лишних пробелов
    const rootNode = { title: headers[0], children: [] };  //создание корневого узла дерева

    for (const line of lines) {
        let currentNode = rootNode;
        const columns = line.split(",");  //разбиение строки на колонки

        for (let j = 0; j < columns.length; j++) { 
            const column = columns[j];
            //поиск существующего узла
            let existingChild = currentNode.children.find(child => child.title === headers[j] && child.value === column);
            
            if (!existingChild) {
                existingChild = { title: headers[j], value: column, children: [] };
                currentNode.children.push(existingChild); //добавление нового узла к родителю
            }
            currentNode = existingChild; 
        }
    }
    return rootNode.children;
}

function renderTree(data, parentElement = document.querySelector('#tree')) {
    const ulElement = document.createElement('ul'); 
    parentElement.appendChild(ulElement);
    
    for (const item of data) { //обход узлов
        const liElement = document.createElement('li');  //создание и добавление к списку
        liElement.textContent = `${item.title}: ${item.value}`; 
        ulElement.appendChild(liElement);

        if (item.children) {
            renderTree(item.children, liElement); 
        }
    }
}

function highlightNodes(data, searchData, parentElement = document.querySelector('#tree'), currentIndex = 0, path = []) {
    const ulElement = document.createElement('ul');
    parentElement.appendChild(ulElement);
    
    for (const item of data) {
        const liElement = document.createElement('li'); 
        liElement.textContent = `${item.title}: ${item.value}`; 
        ulElement.appendChild(liElement); 

        if (item.value === searchData[currentIndex]) {//соответствие значения текущего узла искомого значению
            liElement.style.backgroundColor = 'green';
            currentIndex++; 
        }
  
        if (item.children) {
            path = highlightNodes(item.children, searchData, ulElement, currentIndex, [...path, item.value]); 
        } else {
            //вывод пути к текущему узлу, если узел не имеет узлов
            console.log("Path: ", [...path, item.value].join(" -> ")); 
        }
    }

    return path;
}

document.querySelector('#buildTreeBtn').addEventListener('click', function () {
    const fileInput = document.querySelector('#csvFileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        //устанавливаем обработчик, получаем содержимое и устанавливаем структуру дерева
        reader.onload = function (event) { 
            const csvData = event.target.result;
            const data = parseCSV(csvData);
            document.querySelector('#tree').innerHTML = '';
            renderTree(data);
        };
        reader.readAsText(file);
    } else {
        alert('Пожалуйста, выберите файл CSV');
    }
});

document.querySelector('#searchBtn').addEventListener('click', function () {
    const searchData = document.querySelector('#csvSearch').value.split(",");
    const fileInput = document.querySelector('#csvFileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const csvData = event.target.result;
            const data = parseCSV(csvData);
            document.querySelector('#tree').innerHTML = '';
            const path = highlightNodes(data, searchData);
            console.log("Path: ", path.join(" -> "));
        };
        reader.readAsText(file);
    } else {
        alert('Пожалуйста, выберите данные CSV');
    }
});
