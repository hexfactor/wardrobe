function resizeImage(file, maxWidth, maxHeight, callback) {
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var width = img.width;
        var height = img.height;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height * maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width * maxHeight / height);
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;

        // draw the image on the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // get the data URL
        var dataUrl = canvas.toDataURL('image/jpeg');

        callback(dataUrl);
    };

    img.src = URL.createObjectURL(file);
}

document.getElementById('addButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'flex';
});

// Add event listener for ESC press, then close the overlay
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.getElementById('overlay').style.display = 'none';
    }
});

document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
});

document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault();

    resizeImage(document.getElementById('imageUpload').files[0], 128, 128, function(resizedImage) {
        var item = {
            image: resizedImage,
            name: document.getElementById('name').value,
            color: document.getElementById('color').value,
            material: document.getElementById('material').value,
            piece: document.getElementById('category').value,
            washType: document.getElementById('washType').value,
            washTemperature: document.getElementById('washTemperature').value,
            dryType: document.getElementById('dryType').value,
            dryTemperature: document.getElementById('dryTemperature').value,
            uses: 0
        };

        var items = JSON.parse(localStorage.getItem('items')) || [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));

        document.getElementById('overlay').style.display = 'none';
        displayItems();
    });
});

function deleteItem(index) {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
}

function incrementItemUses(index) {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    items[index].uses++;
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
}

function decrementItemUses(index) {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    if (items[index].uses > 0) {
        items[index].uses--;
        localStorage.setItem('items', JSON.stringify(items));
        displayItems();
    }
}

function resetItemUses(index) {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    items[index].uses = 0;
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
}

function displayItems() {
    var items = JSON.parse(localStorage.getItem('items')) || [];
    var grid = document.getElementById('grid');
    grid.innerHTML = '';

    items.forEach(function(item) {
        var div = document.createElement('div');
        div.id = 'gridItem';
        div.innerHTML = `
            <img src="${item.image}">
            <div id="itemDetails">
                <h2>${item.name}</h2>
                <p>${item.color} ${item.material} ${item.piece}</p>
                <p>Washing: ${item.washTemperature} ${item.washType}</p>
                <p>Drying: ${item.dryTemperature} ${item.dryType}</p>
            </div>
        `;
        div.innerHTML += `
            <div id="itemButtons">
                <button id="decrementItemUsesBtn" onclick="decrementItemUses(${items.indexOf(item)})">−</button>
                <button id="itemUseCount" onclick="resetItemUses(${items.indexOf(item)})">${item.uses}</button>
                <button id="incrementItemUsesBtn" onclick="incrementItemUses(${items.indexOf(item)})">+</button>
                <button id="editItemBtn" onclick="editItem(${items.indexOf(item)})">&#9998;</button>
                <button id="deleteItemBtn" onclick="deleteItem(${items.indexOf(item)})">×</button>
            </div>
        `;
        grid.appendChild(div);
    });
}

displayItems();