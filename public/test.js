const itemContainer = document.querySelector('.item-container');
const divInventory = document.querySelector('.inventory');
const countSpan = document.querySelector('.count');

const MAX_INVENTORY = 4;

if (!itemContainer || !divInventory || !countSpan) {
    throw new Error(
        'Missing .item-container, .inventory, or .count element.'
    );
}

function updateInventoryCount() {
    const currentCount =
        divInventory.querySelectorAll('.item').length;

    countSpan.textContent =
        `(${currentCount}/${MAX_INVENTORY})`;
}

// Find the matching HTML item for a database record
function findAvailableItem(savedItem) {
    const items = itemContainer.querySelectorAll('.item');

    return [...items].find((item) => {
        const itemCount = Number(item.dataset.size);
        const itemGroup = item.textContent.trim();

        return (
            itemCount === savedItem.count &&
            itemGroup === savedItem.group
        );
    });
}

// Load saved inventory from the server
async function loadInventory() {
    try {
        const response = await fetch('/test');

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Could not load inventory.'
            );
        }

        for (const savedItem of result.data) {
            if (
                divInventory.querySelectorAll('.item').length >=
                MAX_INVENTORY
            ) {
                break;
            }

            const matchingItem = findAvailableItem(savedItem);

            if (!matchingItem) {
                continue;
            }

            // Store MongoDB's document ID on the HTML element
            matchingItem.dataset.recordId = savedItem._id;

            divInventory.appendChild(matchingItem);
        }

        updateInventoryCount();
    } catch (error) {
        console.error('GET /test failed:', error);
    }
}

// Add item
itemContainer.addEventListener('click', async (event) => {
    const itemClicked = event.target.closest('.item');

    if (!itemClicked) {
        return;
    }

    const currentCount =
        divInventory.querySelectorAll('.item').length;

    if (currentCount >= MAX_INVENTORY) {
        alert('Inventory is full!');
        return;
    }

    const itemData = {
        count: Number(itemClicked.dataset.size),
        group: itemClicked.textContent.trim()
    };

    try {
    const response = await fetch('/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    });

    // Read the response as text first
    const responseText = await response.text();

    console.log('Response status:', response.status);
    console.log('Response content type:', response.headers.get('content-type'));
    console.log('Raw server response:', responseText);

    let result = {};

    if (responseText) {
        try {
            result = JSON.parse(responseText);
        } catch {
            throw new Error(
                `Server returned non-JSON data: ${responseText.slice(0, 200)}`
            );
        }
    }

    if (!response.ok) {
        throw new Error(
            result.message || `Request failed with status ${response.status}`
        );
    }

    itemClicked.dataset.recordId = result.data._id;
    divInventory.appendChild(itemClicked);
    updateInventoryCount();

    console.log('Item saved:', result.data);
} catch (error) {
    console.error('POST /test failed:', error);
    alert(error.message);
}
});

// Removal currently changes only the browser
divInventory.addEventListener('click', (event) => {
    const itemClicked = event.target.closest('.item');

    if (!itemClicked) {
        return;
    }

    itemContainer.appendChild(itemClicked);
    updateInventoryCount();
});

// Restore inventory when the page opens
loadInventory();