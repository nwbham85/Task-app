// ============================================
// TEAM SETTINGS MODAL
// ============================================

const teamSettingsModal = document.getElementById('teamSettingsModal');
const teamSettingsIcon = document.querySelector('.teamSettings-icon');
const closeTeamSettingsBtn = document.getElementById('closeTeamSettings');

// Open team settings modal
if (teamSettingsIcon) {
  teamSettingsIcon.addEventListener('click', () => {
    teamSettingsModal.classList.add('open');
  });
}

// Close team settings modal
if (closeTeamSettingsBtn) {
  closeTeamSettingsBtn.addEventListener('click', () => {
    teamSettingsModal.classList.remove('open');
  });
}

// Close on outside click
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
  if (e.target === teamSettingsModal) {
    teamSettingsModal.classList.remove('open');
  }
});