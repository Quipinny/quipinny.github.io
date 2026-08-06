// ===== ИЗБРАННЫЕ ПРОЕКТЫ (чередующиеся блоки картинка/текст вверху портфолио) =====
// Чтобы добавить/изменить проект — скопируй один блок { ... }, поменяй поля.
// Порядок в этом списке = порядок блоков на странице (чередуются местами
// картинка/текст автоматически, ничего для этого делать не нужно).
//
// Обязательные поля:
// title       — название проекта
// tagline     — короткое подзаголовок-описание (1 строка)
// cover       — обложка (путь к файлу, как в works.js)
// description — полное описание, показывается при клике (можно длинный текст)
//
// Необязательные поля (можно убрать строку, если не нужно — просто не покажется):
// role        — твоя роль в проекте, например "Lead Pixel Artist"
// tools       — инструменты, например "Aseprite, Godot"
// year        — год, например "2025"
// platform    — платформа, например "Steam, itch.io"
// tags        — список меток-тегов (массив строк)
// gallery     — доп. картинки внутри карточки при клике (массив путей)
// link        — ссылка "смотреть проект"
// linkLabel   — подпись на кнопке ссылки

const PROJECTS = [
  {
      title: "Big Pixel Art Fish Pack",
    tagline: "A pixel art asset pack for game development.",
    cover: "assets/Best/ww.PNG",
    description: "A successful commercial pixel art asset pack featuring over 500 fish sprites, ranging from real-world species to original fantasy creatures of my own design. The asset pack was created and published by me on my itch.io page, where it has received several thousand views and hundreds of downloads. The collection includes a wide variety of fish, from realistic aquatic species to unique fantasy designs, making it suitable for games across multiple genres.",
    tags: ["Icons", "Game Assets"],
    gallery: ["assets/Best/aaaaa.PNG", "assets/Best/asq.png", "assets/Best/qwer.png"],
    link: "https://quipinny.itch.io/very-big-fish-pack",
    linkLabel: "Look at itch.io!",
  },
  {
    title: "Beat Paws Odyssey",
    tagline: "Pixel art idle game that accompanies you at work.",
    cover: "assets/Best/1234.PNG",
    description: "A large-scale project where I served as the lead pixel artist, creating nearly all of the game's visual assets, including characters, environments, and background art.",
    gallery: ["assets/Best/12.PNG", "assets/Best/3 (2).png", "assets/Best/buttons.png", "assets/Best/dog_walk.gif", "assets/Best/1w.PNG",],
    tags: ["Pixel Art", "Game Assets", "Animations"],

    link: "https://store.steampowered.com/app/3947470/Beat_Paws_Odyssey/",
    linkLabel: "Look at Steam!",
  },
  {
    title: "MineEngineer",
    tagline: "Space Survival Simulator",
    cover: "assets/Best/header capsule.png",
    description: "In this project, I developed the design for Steam, the assets for the space environment, and the design and animations for the main character.",
    tags: ["Tilesets", "Environment", "Animation"],
    gallery: ["assets/Best/1QW.jpg", "assets/Best/SN.PNG", "assets/Animations/run.gif", "assets/Best/1222.PNG" ],
    link: "https://store.steampowered.com/app/4059710/MineEngineer/",
    linkLabel: "Look at Steam!",
  },
];
