
document.addEventListener("DOMContentLoaded", () => {
  // Плавное появление блоков во время прокрутки
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // Мягкое свечение за курсором на компьютере
  const glow = document.querySelector(".cursor-glow");

  if (glow && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
      },
      { passive: true }
    );
  }

  // Переключение цен: будни и выходные
  const priceSwitch = document.querySelector(".price-switch");
  const switchButtons = document.querySelectorAll(".switch-button");
  const pricePeriod = document.querySelector(".price-period");

  const prices = {
    weekdays: {
      4: 1100,
      6: 1170,
      8: 1270
    },
    weekend: {
      4: 1330,
      6: 1440,
      8: 1500
    }
  };

  function updatePrices(period) {
    const isWeekend = period === "weekend";

    priceSwitch.classList.toggle("is-weekend", isWeekend);

    switchButtons.forEach((button) => {
      const active = button.dataset.period === period;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    pricePeriod.textContent = isWeekend
      ? "ПЯТНИЦА — СУББОТА"
      : "ВОСКРЕСЕНЬЕ — ЧЕТВЕРГ";

    document.querySelectorAll(".price-value").forEach((element) => {
      const guests = element.dataset.guests;
      const price = prices[period][guests];

      element.style.opacity = "0";

      window.setTimeout(() => {
        element.innerHTML = `${price} <small>BYN</small>`;
        element.style.opacity = "1";
      }, 160);
    });
  }

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updatePrices(button.dataset.period);
    });
  });

  // Мобильное меню
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Не запускаем анимации, если пользователь отключил их в системе
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("visible");
    });
  }
});
