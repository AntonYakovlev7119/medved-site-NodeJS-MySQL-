const introBackground = document.querySelector(".intro__background");
const treeClearingImg = document.querySelector(".tree-clearing__background");
const treeClearingSection = document.querySelector(".tree-clearing");
const headerNavigation = document.querySelector(".header__navigation");

const animationDuration = 0.5;
let scrollY = this.scrollY || document.documentElement.scrollTop;
let scrollYBefore = scrollY;
let offsetY = document.documentElement.clientHeight;
let scrolledOffsetY = 0;
let isTreeClearingIntersecting = false;

// Проверка положения на странице для задания состояния навигации

if (scrollY === 0)
  headerNavigation.classList.add(".header__navigation--scrolled-top");
else headerNavigation.classList.add("header__navigation--scrolled-down");

// Отслеживание скролла

window.addEventListener("scroll", (e) => {
  // console.log(document.documentElement.clientHeight);
  scrollYBefore = scrollY;
  scrollY = this.scrollY || document.documentElement.scrollTop;

  if (scrollY - scrollYBefore < 0 && isTreeClearingIntersecting)
    if (isTreeClearingIntersecting)
      // scrolledOffsetY -= offsetY / 100;
      scrolledOffsetY -= 1;

  // Прокрутка в верх страницы
  if (scrollY === 0 && scrollYBefore > 0) {
    // if (isTreeClearingIntersecting) scrolledOffsetY -= offsetY / 50;

    headerNavigation.style.cssText = "";
    headerNavigation.classList.add("header__navigation--scrolled-top");
    headerNavigation.classList.remove("header__navigation--scrolled-down");
    headerNavigation.style.cssText = `animation: ${animationDuration}s nav-color-to-gradient linear`;
  }
  // Прокрутка в низ страницы
  if (scrollY > 0 && scrollYBefore < scrollY) {
    // if (isTreeClearingIntersecting) scrolledOffsetY += offsetY / 100;
    if (isTreeClearingIntersecting) scrolledOffsetY += 1;

    headerNavigation.style.cssText = "";
    headerNavigation.classList.remove("header__navigation--scrolled-top");
    headerNavigation.classList.add("header__navigation--scrolled-down");
    headerNavigation.style.cssText = `animation: ${animationDuration}s nav-color-to-flat linear`;
  }

  treeClearingImg.style.cssText = `--scrollTop: ${scrollY}px; --offsetY: ${scrolledOffsetY}px`;
});

// Отслеживание курсора

document.addEventListener("mousemove", (e) => {
  Object.assign(introBackground, {
    style: `
        --move-x: ${(e.clientX - window.innerWidth / 2) * 0.05}px;
        --move-y: ${(e.clientY - window.innerHeight / 2) * 0.025}px;
        `,
  });
});

// Отслеживание появления объектов на экране при скролле

const mainAnimatedSections = document.querySelectorAll(
  ".wood, .wood-products, .transportation"
);
const orderAnimatedSection = document.querySelector(".order");

const showObjects = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add(`${entry.target.classList[0]}--show`);
      observer.unobserve(entry.target);
    }
  });
};

const mainObserver = new IntersectionObserver(showObjects, { threshold: 0.1 });
const orderObserver = new IntersectionObserver(showObjects, {
  threshold: 0.3,
});

mainAnimatedSections.forEach((object) => mainObserver.observe(object));
orderObserver.observe(orderAnimatedSection);

// Отслеживание повяления картинки из секции "расчистка древесных насаждений"

const treeClearingImgMove = (entry, observer) => {
  if (entry[0].isIntersecting) {
    isTreeClearingIntersecting = true;

    treeClearingImg.classList.add("tree-clearing__background--move");
    // console.log(1);
  } else {
    isTreeClearingIntersecting = false;
    // treeClearingImg.classList.remove("tree-clearing__background--move");
  }
};

const treeClearingObserver = new IntersectionObserver(treeClearingImgMove, {
  rootMargin: "100px 0px",
  threshold: 0.1,
});

treeClearingObserver.observe(treeClearingImg);
