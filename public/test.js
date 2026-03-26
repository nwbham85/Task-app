export const test = {
  init() {
    const button = document.querySelector('#loadTest');
    const output = document.querySelector('.output');

    if (!button || !output) return;

    button.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/test');

        console.log(response);
        console.log('ok', response.ok);

        if (!response.ok) {
          throw new Error(`http error: ${response.status}`);
        }

        const data = await response.json();
        console.log('data', data);

        output.textContent = `${data.message} (${data.data.length} items)`;
      } catch (err) {
        console.error('Fetch failed', err);
        output.textContent = 'Error loading data.';
      }
    });
  }
};