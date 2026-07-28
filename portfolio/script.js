// Этот файл собирает страницу автоматически на основе списка WORKS из works.js.
// Трогать его не нужно, если просто добавляешь новые работы — правь только works.js.

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
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

      const img = document.createElement("img");
      img.src = work.file;
      img.alt = work.title || category;
      img.loading = "lazy"; // не грузит всё сразу — только то, что видно на экране

      figure.appendChild(img);

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

buildGallery();
