
        const API_URL = 'http://localhost:3000/api/cars';
        // You'll need to replace this with your actual API key from the server console
        const API_KEY = 'your-api-key-here';
        
        document.getElementById('carSearchForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const filters = {};
            
            // Build filters object from form data
            for (let [key, value] of formData.entries()) {
                if (value.trim()) {
                    filters[key] = value.trim();
                }
            }
            
            await searchCars(filters);
        });
        
        async function searchCars(filters) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div class="loading">Searching for cars...</div>';
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY
                    },
                    body: JSON.stringify(filters)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                displayResults(data);
            } catch (error) {
                resultsDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
            }
        }
        
        function displayResults(data) {
            const resultsDiv = document.getElementById('results');
            
            if (data.count === 0) {
                resultsDiv.innerHTML = `
                    <div class="results-header">
                        <h2>No cars found</h2>
                    </div>
                    <p style="text-align: center; padding: 20px; color: #666;">Try adjusting your search criteria.</p>
                `;
                return;
            }
            
            const resultsHTML = `
                <div class="results-header">
                    <h2>Search Results</h2>
                    <span>${data.count} car${data.count !== 1 ? 's' : ''} found</span>
                </div>
                <div class="car-grid">
                    ${data.data.map(car => `
                        <div class="car-card">
                            <div class="car-title">${car.make} ${car.model}</div>
                            <div class="car-details">
                                <div class="car-detail">
                                    <span class="detail-label">Year:</span>
                                    <span class="detail-value">${car.year}</span>
                                </div>
                                <div class="car-detail">
                                    <span class="detail-label">Miles:</span>
                                    <span class="detail-value">${car.miles.toLocaleString()}</span>
                                </div>
                                <div class="car-detail">
                                    <span class="detail-label">Distance:</span>
                                    <span class="detail-value">${car.distance} mi away</span>
                                </div>
                            </div>
                            <div class="price">$${car.price.toLocaleString()}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            resultsDiv.innerHTML = resultsHTML;
        }
        
        function clearForm() {
            document.getElementById('carSearchForm').reset();
            const resultsDiv = document.getElementById('results');
            resultsDiv.style.display = 'none';
        }

        
document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.querySelector('.nav-link.signup');
    if (signupBtn) {
        signupBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Check if modal already exists
            if (!document.getElementById('modalOverlay')) {
    // Fetch modal HTML
    const response = await fetch('account_popup.html');
    const html = await response.text();

    const container = document.createElement('div');
    container.innerHTML = html;

    // Append modal overlay
    const modalOverlay = container.querySelector('#modalOverlay');
    document.body.appendChild(modalOverlay);

    // Append scripts and wait for them to load
    const scripts = container.querySelectorAll('script');

    // Wrap in Promise.all to wait for external scripts to load
    await Promise.all(Array.from(scripts).map(script => {
        return new Promise((resolve) => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
                newScript.onload = () => resolve();
                document.body.appendChild(newScript);
            } else {
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
                resolve();
            }
        });
    }));

    // Now all scripts are loaded/executed, call openModal
    openModal('signup');
} else {
    // If modal already exists, just open it
    openModal('signup');
}

        });
    }
});
