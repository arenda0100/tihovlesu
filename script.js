
const menuToggle = document.querySelector("#menuToggle");
const navigation = document.querySelector("#navigation");

// МОБИЛЬНОЕ МЕНЮ

function closeMenu() {
  menuToggle.classList.remove("active");
  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Открыть меню");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Закрыть меню" : "Открыть меню"
  );
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) closeMenu();
});

// ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
}

// ГАЛЕРЕИ КАРТОЧЕК

const galleries = {
  house: {
    title: "Black House",
    description: "Дом для отдыха среди природы",
    photos: [
      "images/house-1.jpg",
      "images/house-2.jpg",
      "images/house-3.jpg"
    ]
  },

  bath: {
    title: "Баня на дровах",
    description: "Живой огонь, тепло и отдых",
    photos: [
      "images/bath-1.jpg",
      "images/bath-2.jpg",
      "images/bath-3.jpg"
    ]
  },

  furako: {
    title: "Фурако",
    description: "Горячая вода под открытым небом",
    photos: [
      "images/furako-1.jpg",
      "images/furako-2.jpg",
      "images/furako-3.jpg"
    ]
  }
};

const modal = document.querySelector("#galleryModal");
const modalClose = document.querySelector("#modalClose");
const galleryTitle = document.querySelector("#galleryTitle");
const galleryDescription = document.querySelector("#galleryDescription");
const galleryGrid = document.querySelector("#galleryGrid");
const galleryCounter = document.querySelector("#galleryCounter");
const galleryPrev = document.querySelector("#galleryPrev");
const galleryNext = document.querySelector("#galleryNext");

let activeGallery = null;
let activePhotoIndex = 0;
let previousFocus = null;

function renderGallery() {
  if (!activeGallery) return;

  const gallery = galleries[activeGallery];

  galleryTitle.textContent = gallery.title;
  galleryDescription.textContent = gallery.description;
  galleryCounter.textContent =
    `${String(activePhotoIndex + 1).padStart(2, "0")} / 03`;

  galleryGrid.innerHTML = "";

  // На телефоне активное фото показывается первым.
  const mobile = window.matchMedia("(max-width: 700px)").matches;

  const indices = mobile
    ? [
        activePhotoIndex,
        (activePhotoIndex + 1) % 3,
        (activePhotoIndex + 2) % 3
      ]
    : [0, 1, 2];

  indices.forEach(index => {
    const photoPath = gallery.photos[index];

    const photo = document.createElement("div");
    photo.className = "gallery-photo";
    photo.dataset.index = String(index);

    if (index === activePhotoIndex) {
      photo.classList.add("is-active");
    }

    const label = document.createElement("span");
    label.textContent = `ФОТО ${String(index + 1).padStart(2, "0")}`;

    const filename = document.createElement("small");
    filename.textContent = photoPath;

    const number = document.createElement("span");
    number.className = "photo-number";
    number.textContent = `${String(index + 1).padStart(2, "0")} / 03`;

    photo.append(label, filename, number);

    // Пустые места остаются заглушками, пока фото не добавлены.
    // Если файл появится, он загрузится автоматически.
    const img = new Image();
    img.alt = `${gallery.title} — фотография ${index + 1}`;

    img.addEventListener("load", () => {
      photo.querySelector("span").remove();
      photo.querySelector("small").remove();
      photo.prepend(img);
    });

    img.addEventListener("error", () => {
      img.remove();
    });

    img.src = photoPath;

    photo.addEventListener("click", () => {
      activePhotoIndex = index;
      renderGallery();
    });

    galleryGrid.appendChild(photo);
  });
}

function openGallery(galleryName) {
  if (!galleries[galleryName]) return;

  activeGallery = galleryName;
  activePhotoIndex = 0;
  previousFocus = document.activeElement;

  renderGallery();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  modalClose.focus();
}

function closeGallery() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  activeGallery = null;

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

document.querySelectorAll("[data-gallery]").forEach(card => {
  card.addEventListener("click", () => {
    openGallery(card.dataset.gallery);
  });
});

modalClose.addEventListener("click", closeGallery);

modal.querySelector("[data-close]").addEventListener(
  "click",
  closeGallery
);

galleryPrev.addEventListener("click", () => {
  if (!activeGallery) return;

  activePhotoIndex =
    (activePhotoIndex + 2) % 3;

  renderGallery();
});

galleryNext.addEventListener("click", () => {
  if (!activeGallery) return;

  activePhotoIndex =
    (activePhotoIndex + 1) % 3;

  renderGallery();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (modal.classList.contains("open")) {
      closeGallery();
    } else {
      closeMenu();
    }
  }

  if (modal.classList.contains("open")) {
    if (event.key === "ArrowRight") {
      activePhotoIndex = (activePhotoIndex + 1) % 3;
      renderGallery();
    }

    if (event.key === "ArrowLeft") {
      activePhotoIndex = (activePhotoIndex + 2) % 3;
      renderGallery();
    }
  }
});

// ПРИ ИЗМЕНЕНИИ РАЗМЕРА ЭКРАНА ОБНОВЛЯЕМ ГАЛЕРЕЮ

window.addEventListener("resize", () => {
  if (activeGallery) renderGallery();
});

