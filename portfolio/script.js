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

// ===== Избранные проекты — карточки-"билеты" вверху страницы =====
function renderFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (!window.PROJECTS) return; // если projects.js не подключён — просто пропускаем блок

  PROJECTS.forEach((project) => {
    const card = document.createElement("div");
    card.className = "ticket-card";
    card.onclick = () => openProject(project);

    const cover = document.createElement("div");
    cover.className = "ticket-cover";
    const img = document.createElement("img");
    img.src = project.cover;
    img.alt = project.title;
    img.loading = "lazy";
    img.draggable = false;
    cover.appendChild(img);

    const tear = document.createElement("div");
    tear.className = "ticket-tear";

    const info = document.createElement("div");
    info.className = "ticket-info";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const tagline = document.createElement("p");
    tagline.textContent = project.tagline;

    info.appendChild(title);
    info.appendChild(tagline);

    if (project.tags && project.tags.length) {
      const tags = document.createElement("div");
      tags.className = "ticket-tags";
      project.tags.forEach((t) => {
        const tag = document.createElement("span");
        tag.textContent = t;
        tags.appendChild(tag);
      });
      info.appendChild(tags);
    }

    card.appendChild(cover);
    card.appendChild(tear);
    card.appendChild(info);
    grid.appendChild(card);
  });
}

function openProject(project) {
  const content = document.getElementById("projectModalContent");
  content.innerHTML = "";

  const closeBtn = document.createElement("button");
  closeBtn.className = "project-close";
  closeBtn.textContent = "×";
  closeBtn.onclick = closeProject;
  content.appendChild(closeBtn);

  const cover = document.createElement("img");
  cover.className = "project-cover";
  cover.src = project.cover;
  cover.alt = project.title;
  cover.draggable = false;
  content.appendChild(cover);

  const title = document.createElement("h2");
  title.textContent = project.title;
  content.appendChild(title);

  const tagline = document.createElement("p");
  tagline.className = "project-tagline";
  tagline.textContent = project.tagline;
  content.appendChild(tagline);

  if (project.tags && project.tags.length) {
    const tags = document.createElement("div");
    tags.className = "ticket-tags";
    project.tags.forEach((t) => {
      const tag = document.createElement("span");
      tag.textContent = t;
      tags.appendChild(tag);
    });
    content.appendChild(tags);
  }

  const desc = document.createElement("p");
  desc.className = "project-desc";
  desc.textContent = project.description;
  content.appendChild(desc);

  if (project.gallery && project.gallery.length) {
    const gal = document.createElement("div");
    gal.className = "project-gallery";
    project.gallery.forEach((src) => {
      const im = document.createElement("img");
      im.src = src;
      im.loading = "lazy";
      im.draggable = false;
      gal.appendChild(im);
    });
    content.appendChild(gal);
  }

  if (project.link) {
    const link = document.createElement("a");
    link.className = "project-link";
    link.href = project.link;
    link.target = "_blank";
    link.textContent = project.linkLabel || "View project";
    content.appendChild(link);
  }

  document.getElementById("projectModal").classList.add("is-open");
}

function closeProject() {
  document.getElementById("projectModal").classList.remove("is-open");
}

renderFeatured();

buildGallery();
