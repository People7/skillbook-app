// Splash screen display
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const landing = document.getElementById('landing');
  setTimeout(() => {
    splash?.remove();
    landing?.classList.add('show');
  }, 3000);
});
