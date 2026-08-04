// Этот файл собирает страницу автоматически на основе списка WORKS из works.js.
// Трогать его не нужно, если просто добавляешь новые работы — правь только works.js.

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

function isVideoFile(path) {
  return /\.(mp4|webm|mov)$/i.test(path);
}

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

      // В СЕТКЕ всегда показываем лёгкое статичное превью (thumb) —
      // а не оригинальную гифку/видео. Это единственное, что грузится
      // при открытии страницы. Если thumb почему-то не указан — берём
      // оригинал как запасной вариант (например, для новых работ,
      // для которых превью ещё не сделано).
      const img = document.createElement("img");
      img.src = work.thumb || work.file;
      img.alt = work.title || category;
      img.loading = "lazy";
      img.draggable = false;

      const frame = document.createElement("div");
      frame.className = "thumb-frame";
      frame.appendChild(img);

      // Маленькая иконка "▶" поверх превью, если это видео/гифка —
      // чтобы было понятно, что по клику откроется анимация
      if (isVideoFile(work.file) || /\.gif$/i.test(work.file)) {
        const badge = document.createElement("span");
        badge.className = "play-badge";
        badge.textContent = "▶";
        frame.appendChild(badge);
      }

      figure.appendChild(frame);

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

// ===== Лайтбокс — увеличенный просмотр по клику. Только тут грузится
// оригинальный файл (полная гифка/видео), а не превью. =====
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
    media.draggable = false;
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
