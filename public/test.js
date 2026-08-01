const itemContainer = document.querySelector('.item-container');
const divInventory = document.querySelector('.inventory');
const countSpan = document.querySelector('.count'); // Added dot (.) for class selector

const MAX_INVENTORY = 4; // Set your max capacity limit here

// Helper function to update the DOM count display
function updateInventoryCount() {
    // Count how many .item elements are inside divInventory
    const currentCount = divInventory.querySelectorAll('.item').length;
    countSpan.textContent = `(${currentCount}/${MAX_INVENTORY})`;
}

// Initial update on page load
updateInventoryCount();

// 1. ADD ITEM TO INVENTORY
itemContainer.addEventListener('click', async (e) => {
    const itemClicked = e.target.closest('.item');
    if (!itemClicked) return; // Exit if user clicked the background container

    const currentCount = divInventory.querySelectorAll('.item').length;

    // Check if full before adding
    if (currentCount >= MAX_INVENTORY) {
        alert('Inventory is full!');
        return;
    }

    divInventory.appendChild(itemClicked);
    updateInventoryCount();

    //post to /test
    try {
        const response = await fetch('/test' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id:itemClicked.dataset.id,
                name: itemClicked.textContent.trim()
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                data.error ||
                'we could not post'
            );
        }
    }catch(error) {
        console.log(error);
    }
});

// 2. REMOVE ITEM FROM INVENTORY (RETURN TO SHOP/CONTAINER)
divInventory.addEventListener('click', (e) => {
    const itemClicked = e.target.closest('.item');
    
    // Exit if user clicked the <h4> heading, count span, or background
    if (!itemClicked) return; 

    itemContainer.appendChild(itemClicked);
    updateInventoryCount();
});