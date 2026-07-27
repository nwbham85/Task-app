
// select html element

const button = document.querySelector('.btn');
const counter = document.querySelector('.counter');

button.addEventListener('click', (e) => {
    let startingCount;
    counter.value = Number(counter.value) + 1;

    console.log(counter.dataset.group);

    // POST counter value to /test
    try {
        const response = await fetch('/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                counter
            }),
        });

        const data = await response.json(); // Optional: Parse response payload
        console.log('Success:', data);
    } catch (error) {
        console.log('Error:', error);
}
    
    
});