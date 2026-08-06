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

    grouped[category].forEach((work, index) => {
      const figure = document.createElement("figure");
      figure.className = "card";
      figure.onclick = () => openLightbox(grouped[category], index);

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

      // Если thumb (заранее сохранённое превью) не нашёлся на сервере —
      // карточка не остаётся пустой: пробуем показать сам оригинальный
      // файл (gif/png). Видео так показать нельзя (img не проигрывает mp4),
      // поэтому для видео без превью просто помечаем "нет превью".
      let triedFallback = false;
      img.onerror = () => {
        const canFallbackToFile =
          !triedFallback && work.thumb && !isVideoFile(work.file) && img.src.indexOf(work.file) === -1;
        if (canFallbackToFile) {
          triedFallback = true;
          img.src = work.file;
          return;
        }
        img.style.display = "none";
        frame.classList.add("is-broken");
        console.warn("Не загрузилось превью (и оригинал тоже):", work);
      };

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

// ===== Лайтбокс — увеличенный просмотр по клику, с перелистыванием влево/вправо.
// Только тут грузится оригинальный файл (полная гифка/видео), а не превью. =====
let lightboxItems = [];
let lightboxIndex = 0;

function openLightbox(items, index) {
  lightboxItems = items;
  lightboxIndex = index;
  renderLightboxMedia();
  document.getElementById("lightbox").classList.add("is-open");
}

function renderLightboxMedia() {
  const work = lightboxItems[lightboxIndex];
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
    media.alt = work.title || work.category || "";
    media.draggable = false;
  }
  content.appendChild(media);
  content.onclick = (e) => e.stopPropagation(); // клик по самой картинке не закрывает лайтбокс

  // Стрелки показываем, только если реально есть куда листать
  const showArrows = lightboxItems.length > 1;
  document.querySelectorAll(".lightbox-arrow").forEach((btn) => {
    btn.style.display = showArrows ? "flex" : "none";
  });
}

function navigateLightbox(direction) {
  if (!lightboxItems.length) return;
  lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
  renderLightboxMedia();
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("is-open");
  document.getElementById("lightboxContent").innerHTML = ""; // останавливает видео
}

// Стрелки клавиатуры — тоже листают лайтбокс, когда он открыт
document.addEventListener("keydown", (e) => {
  const lightboxOpen = document.getElementById("lightbox").classList.contains("is-open");
  if (!lightboxOpen) return;
  if (e.key === "ArrowLeft") navigateLightbox(-1);
  if (e.key === "ArrowRight") navigateLightbox(1);
  if (e.key === "Escape") closeLightbox();
});

// ===== Избранные проекты — чередующиеся редакторские блоки (зигзаг) =====
function renderFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (typeof PROJECTS === "undefined") return; // если projects.js не подключён — просто пропускаем блок

  PROJECTS.forEach((project, i) => {
    const row = document.createElement("div");
    row.className = "feature-row" + (i % 2 === 1 ? " feature-row--reverse" : "");

    // --- Картинка ---
    const media = document.createElement("div");
    media.className = "feature-media";
    media.onclick = () => openProject(project);

    const img = document.createElement("img");
    img.src = project.cover;
    img.alt = project.title;
    img.loading = "lazy";
    img.draggable = false;
    img.onerror = () => {
      img.style.display = "none";
      media.classList.add("is-broken");
      console.warn("Не загрузилась обложка проекта:", img.src, project);
    };
    media.appendChild(img);

    // --- Текст ---
    const text = document.createElement("div");
    text.className = "feature-text";

    const title = document.createElement("h3");
    title.textContent = project.title;
    text.appendChild(title);

    const tagline = document.createElement("p");
    tagline.className = "feature-tagline";
    tagline.textContent = project.tagline;
    text.appendChild(tagline);

    // Необязательные поля — показываются только если заполнены в projects.js
    const metaFields = [
      ["Role", project.role],
      ["Tools", project.tools],
      ["Year", project.year],
      ["Platform", project.platform],
    ].filter(([, value]) => value);

    if (metaFields.length) {
      const meta = document.createElement("ul");
      meta.className = "feature-meta";
      metaFields.forEach(([label, value]) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${label}</span>${value}`;
        meta.appendChild(li);
      });
      text.appendChild(meta);
    }

    if (project.tags && project.tags.length) {
      const tags = document.createElement("div");
      tags.className = "ticket-tags";
      project.tags.forEach((t) => {
        const tag = document.createElement("span");
        tag.textContent = t;
        tags.appendChild(tag);
      });
      text.appendChild(tags);
    }

    const more = document.createElement("button");
    more.className = "feature-more";
    more.textContent = "View case study →";
    more.onclick = () => openProject(project);
    text.appendChild(more);

    row.appendChild(media);
    row.appendChild(text);
    grid.appendChild(row);
  });
}

function openProject(project) {
  const content = document.getElementById("projectModalContent");
  content.innerHTML = "";

  // Общий список для лайтбокса: обложка + все картинки галереи проекта,
  // чтобы можно было пролистать все картинки проекта подряд
  const projectLightboxItems = [
    { file: project.cover, title: project.title },
    ...(project.gallery || []).map((src) => ({ file: src, title: project.title })),
  ];

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
  cover.style.cursor = "pointer";
  cover.onclick = () => openLightbox(projectLightboxItems, 0);
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
    project.gallery.forEach((src, i) => {
      const im = document.createElement("img");
      im.src = src;
      im.loading = "lazy";
      im.draggable = false;
      im.style.cursor = "pointer";
      // +1 потому что в projectLightboxItems первым идёт обложка (индекс 0)
      im.onclick = () => openLightbox(projectLightboxItems, i + 1);
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
