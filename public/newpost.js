const form = document.querySelector('.form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.querySelector('#firstName').value.trim();
    const firstLetter = document.querySelector('#firstLetter').value.trim();
    const email = document.querySelector('#email').value.trim();
    const phone = document.querySelector('#phone').value.trim();
    const driver = document.querySelector('#driver').value.trim();
    const relationship = document.querySelector('input[name="relationship"]:checked')?.value;
    const state = document.querySelector('input[name="state"]:checked')?.value;
    const success = document.querySelector('.success');
    let errors = [];

    if (!firstName || firstName.length < 2) {
        errors.push('First name is required.');
    }

    if (!firstLetter || !/^[A-Za-z]$/.test(firstLetter)) {
        errors.push('First letter must be one letter.');
    }

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    const data = {
        firstName,
        firstLetter,
        email,
        phone,
        driver,
        relationship,
        state
    };

    const res = await fetch('http://localhost:3000/api/newpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log(result);

    // post created message after submit
    

        // Show success message
        success.style.display = 'block';

        // Hide it after 3 seconds
        setTimeout(() => {
            success.style.display = 'none';
        }, 3000);

});