const navContainer = document.querySelector(".header__navigation");
const toggleMenu = document.querySelector(".header__toggle-menu");
const scrollTopButton = document.querySelector(".scroll-top-button");

toggleMenu.addEventListener("click", () => {
  navContainer.classList.toggle(".header__mobile-navigation--active");
});

window.addEventListener("scroll", (e) => {
  // Проверка прокрутки страницы для изменения навигации
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 64) {
    navContainer.classList.add("header__navigation--scrolled");
  }
  if (scrollTop < 64) {
    navContainer.classList.remove("header__navigation--scrolled");
  }

  // Отслеживание прокрутки для появления кнопки "В верх страницы"
  const scrollY = this.scrollY || document.documentElement.scrollTop;
  if (scrollY >= 800) {
    scrollTopButton.classList.add("scroll-top-button--show");
  } else {
    scrollTopButton.classList.remove("scroll-top-button--show");
  }
});

// Нажатие кнопки скролла на верх сайта

scrollTopButton.addEventListener("click", () => {
  // scrollTopButton.style.cssText = "animation: 0.5s scroll-top-button linear;"
  scrollTopButton.classList.add("scroll-top-button--clicked");
  setTimeout(() => {
    scrollTopButton.classList.remove("scroll-top-button--clicked");
    scrollTopButton.classList.remove("scroll-top-button--show");
  }, 500);
});
