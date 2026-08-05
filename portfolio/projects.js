// ===== ИЗБРАННЫЕ ПРОЕКТЫ (шапка портфолио, крупные карточки-"билеты") =====
// Чтобы добавить/изменить проект — скопируй один блок { ... }, поменяй поля.
// Порядок в этом списке = порядок карточек на странице.
//
// title       — название проекта
// tagline     — короткое подзаголовок-описание (1 строка)
// cover       — обложка карточки (путь к файлу, как в works.js)
// description — полное описание, показывается при клике (можно длинный текст)
// tags        — список меток-тегов (массив строк, можно пустой [])
// gallery     — доп. картинки внутри карточки при клике (массив путей, можно пустой [])
// link        — ссылка "смотреть проект" (необязательно, можно убрать строку)
// linkLabel   — подпись на кнопке ссылки (необязательно)

const PROJECTS = [
  {
      title: "Название проекта 2",
    tagline: "Одна строка о том, что это за проект",
    cover: "assets/Best/4qeoB_.png",
    description: "Полное описание проекта — сколько угодно текста.",
    tags: ["Animation", "Characters"],
    gallery: [],
    link: "",
    linkLabel: "",
  },
  {
    title: "Beat Paws Odyssey",
    tagline: "Pixel art idle game that accompanies you at work.",
    cover: "assets/Best/1234.PNG",
    description: "A large-scale project where I served as the lead pixel artist, creating nearly all of the game's visual assets, including characters, environments, and background art.",
    gallery: ["assets/Best/12.PNG", "assets/Best/3 (2).png", "assets/Best/buttons.png"],
    tags: ["Pixel Art", "Game Assets"],
    
    gallery: [],
    link: "https://quipinny.itch.io/",
    linkLabel: "Смотреть на itch.io",
  },
  {
    title: "Название проекта 3",
    tagline: "Одна строка о том, что это за проект",
    cover: "assets/Best/houses2.gif",
    description: "Полное описание проекта — сколько угодно текста.",
    tags: ["Tilesets", "Environment"],
    gallery: [],
    link: "",
    linkLabel: "",
  },
];
