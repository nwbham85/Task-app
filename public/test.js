const itemContainer = document.querySelector('.item-container');
const divInventory = document.querySelector('.inventory');
const countSpan = document.querySelector('.count');

const MAX_INVENTORY = 4;

// Make sure the required elements exist
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

updateInventoryCount();

// ADD ITEM
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
        id: itemClicked.dataset.id,
        name: itemClicked.textContent.trim()
    };

    try {
        const response = await fetch('/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });

        const contentType =
            response.headers.get('content-type');

        let data;

        if (
            contentType &&
            contentType.includes('application/json')
        ) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const message =
                data?.message ||
                data?.error ||
                data ||
                'We could not save the item.';

            throw new Error(message);
        }

        // Only move the item after the server saves it
        divInventory.appendChild(itemClicked);
        updateInventoryCount();

        console.log('Item saved:', data);
    } catch (error) {
        console.error('POST /test failed:', error);
        alert(error.message);
    }
});

// REMOVE ITEM
divInventory.addEventListener('click', (event) => {
    const itemClicked = event.target.closest('.item');

    if (!itemClicked) {
        return;
    }

    itemContainer.appendChild(itemClicked);
    updateInventoryCount();
});