window.addEventListener('DOMContentLoaded', event => {
  const myMenu = document.querySelector('.my-menu');

  windowResizeHandle();

  document.querySelector('.toggleMenuOption').addEventListener('click', event => {
    myMenu?.classList.toggle('my-menu-small');
    window.removeEventListener('resize', windowResizeHandle);
  });

  window.addEventListener('resize', windowResizeHandle);

  function windowResizeHandle() {
    myMenu?.classList[window.innerWidth <= 800 ? 'add' : 'remove']('my-menu-small');
  }

  [...document.querySelectorAll('[data-bs-toggle="tooltip"]')].map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
});