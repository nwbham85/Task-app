// Select HTML elements
const button = document.querySelector('.btn');
const counter = document.querySelector('.counter');

// Give the counter an initial value
counter.value = 0;

button.addEventListener('click', async () => {
    const newCount = Number(counter.value) + 1;

    // Update the page
    counter.value = newCount;

    try {
        const response = await fetch('/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                count: newCount,
                group: counter.dataset.group
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        console.log('Saved item:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
});