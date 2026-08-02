// Этот файл собирает страницу автоматически на основе списка WORKS из works.js.
// Трогать его не нужно, если просто добавляешь новые работы — правь только works.js.

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

function isVideoFile(path) {
  return /\.(mp4|webm|mov)$/i.test(path);
}

// Видео грузятся только когда карточка реально появляется на экране —
// иначе браузер попытается сразу скачать десятки mp4 и всё зависнет.
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) {
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      video.play().catch(() => {}); // catch — на случай если браузер временно блокирует автоплей
    } else {
      video.pause();
    }
  });
}, { rootMargin: "100px" });

function buildGallery() {
  const gallery = document.getElementById("gallery");
  const topnavLinks = document.getElementById("topnav-links");

  // Группируем работы по category, сохраняя порядок первого появления
  const categories = [];
  const grouped = {};
  WORKS.forEach((work) => {
    if (!grouped[work.category]) {
      grouped[work.category] = [];
      categories.push(work.category);
    }
    grouped[work.category].push(work);
  });

  categories.forEach((category) => {
    const id = slugify(category);

    // Ссылка в верхней навигации
    const link = document.createElement("a");
    link.href = "#" + id;
    link.textContent = category;
    topnavLinks.appendChild(link);

    // Секция с работами этой категории
    const section = document.createElement("section");
    section.className = "category-section";
    section.id = id;

    // Липкий заголовок секции — виден, пока листаешь именно эту категорию
    const heading = document.createElement("h2");
    heading.className = "section-title";
    heading.textContent = category;
    section.appendChild(heading);

    // Сетка карточек с работами
    const grid = document.createElement("div");
    grid.className = "grid";

    grouped[category].forEach((work) => {
      const figure = document.createElement("figure");
      figure.className = "card";
      figure.onclick = () => openLightbox(work);

      let media;
      if (isVideoFile(work.file)) {
        media = document.createElement("video");
        media.dataset.src = work.file; // src ставится позже, когда попадёт в кадр (см. videoObserver)
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        media.preload = "none";
        media.setAttribute("controlsList", "nodownload noremoteplayback");
        media.disablePictureInPicture = true;
        videoObserver.observe(media);
      } else {
        media = document.createElement("img");
        media.src = work.file;
        media.alt = work.title || category;
        media.loading = "lazy"; // не грузит всё сразу — только то, что видно на экране
      }

      figure.appendChild(media);

      if (work.title) {
        const caption = document.createElement("figcaption");
        caption.textContent = work.title;
        figure.appendChild(caption);
      }

      grid.appendChild(figure);
    });

    section.appendChild(grid);
    gallery.appendChild(section);
  });
}

// ===== Лайтбокс — увеличенный просмотр по клику на карточку =====
function openLightbox(work) {
  const content = document.getElementById("lightboxContent");
  content.innerHTML = "";

  let media;
  if (isVideoFile(work.file)) {
    media = document.createElement("video");
    media.src = work.file;
    media.autoplay = true;
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.setAttribute("controlsList", "nodownload noremoteplayback");
    media.disablePictureInPicture = true;
  } else {
    media = document.createElement("img");
    media.src = work.file;
    media.alt = work.title || work.category;
  }
  content.appendChild(media);
  content.onclick = (e) => e.stopPropagation(); // клик по самой картинке не закрывает лайтбокс

  document.getElementById("lightbox").classList.add("is-open");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("is-open");
  document.getElementById("lightboxContent").innerHTML = ""; // останавливает видео
}

buildGallery();
