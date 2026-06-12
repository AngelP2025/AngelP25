document.addEventListener('DOMContentLoaded', () => {
  // --- Dropdown menu ---
  const dropdownButton = document.querySelector('.menu-button');
  const dropdownContent = document.querySelector('.dropdown-content');

  if (dropdownButton && dropdownContent) {
    dropdownButton.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdownContent.classList.toggle('show');
    });
  }

  // --- Toggle submenu ---
  function toggleSubmenu(event) {
    event.preventDefault();
    const container = event.currentTarget.parentElement;

    document.querySelectorAll('.submenu-container').forEach(el => {
      if (el !== container) {
        el.classList.remove('active');
      }
    });

    container.classList.toggle('active');
  }

  document.querySelectorAll('.submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', toggleSubmenu);
  });

  // --- Cierra menús y submenús al hacer clic fuera ---
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.submenu-container')) {
      document.querySelectorAll('.submenu-container').forEach(el => el.classList.remove('active'));
    }
    if (!e.target.closest('.dropdown-content') && !e.target.closest('.menu-button')) {
      if (dropdownContent) dropdownContent.classList.remove('show');
    }
  });

  // --- Imagen y Canvas ---
  const img = document.getElementById('foto');
  const canvas = document.getElementById('canvas');

  if (img && canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;

    img.addEventListener('click', () => {
      img.classList.toggle('zoomed');
      canvas.classList.toggle('zoomed');

      // Posicionar y ajustar tamaño del canvas
      const rect = img.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.position = 'absolute';
      canvas.style.top = `${rect.top + window.scrollY}px`;
      canvas.style.left = `${rect.left + window.scrollX}px`;
      canvas.style.pointerEvents = 'auto';
    });

    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    canvas.addEventListener('mouseup', () => {
      drawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
      drawing = false;
    });
  }

  // --- Audio personalizado ---
  const audio = document.querySelector('audio');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const seekBar = document.getElementById('seekBar');
  const currentTime = document.getElementById('currentTime');
  const duration = document.getElementById('duration');

  if (audio && playPauseBtn && seekBar && currentTime && duration) {
    playPauseBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        playPauseBtn.classList.remove("play");
        playPauseBtn.classList.add("pause");
      } else {
        audio.pause();
        playPauseBtn.classList.remove("pause");
        playPauseBtn.classList.add("play");
      }
    });

    audio.addEventListener("timeupdate", () => {
      seekBar.value = (audio.currentTime / audio.duration) * 100;
      currentTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      duration.textContent = formatTime(audio.duration);
    });

    seekBar.addEventListener("input", () => {
      audio.currentTime = (seekBar.value / 100) * audio.duration;
    });
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  }
});
const foto = document.getElementById('foto');
const perfil = document.querySelector('.perfil');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

foto.addEventListener('mousedown', e => {
  isDragging = true;
  const rect = foto.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  foto.style.cursor = 'grabbing';
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  foto.style.cursor = 'grab';
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;

  const perfilRect = perfil.getBoundingClientRect();

  let newLeft = e.clientX - perfilRect.left - offsetX;
  let newTop = e.clientY - perfilRect.top - offsetY;

  // Limita que la imagen no se salga del contenedor
  newLeft = Math.min(Math.max(0, newLeft), perfil.clientWidth - foto.clientWidth);
  newTop = Math.min(Math.max(0, newTop), perfil.clientHeight - foto.clientHeight);

  foto.style.left = newLeft + 'px';
  foto.style.top = newTop + 'px';
});















