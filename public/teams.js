const settingsIcon = document.getElementById('teamSettings');
const modal = document.getElementById('teamSettingsModal');
const closeBtn = document.getElementById('closeTeamSettings');
const addTeamBtn = document.getElementById('addTeamBtn');
const teamInput = document.getElementById('newTeamName');
const teamList = document.querySelector('.team-list');

// open the modal
settingsIcon.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// add new team dynamically

addTeamBtn.addEventListener('click', () => {
    const teamName = teamInput.value.trim();

    if(!teamName) return;

    const li = document.createElement('li');
    li.className = 'team-item';
    li.textContent = teamName;

    teamList.appendChild(li);

    teamInput.value = '';
    modal.style.display = 'none';
});

//close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// close modal when clicking backdrop

modal.addEventListener('click', () => {
    if(e.target === modal) {
        modal.style.display = 'none';
    }
});