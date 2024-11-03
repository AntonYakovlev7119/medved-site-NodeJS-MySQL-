const introBackground = document.querySelector(".intro__background");
const treeClearingImg = document.querySelector(".tree-clearing__background");
const headerNavigation = document.querySelector(".header__navigation");

const animationDuration = 0.5;
let scrollY = this.scrollY || document.documentElement.scrollTop;
let scrollYBefore = scrollY;

// Проверка положения на странице для задания состояния навигации

if(scrollY === 0) headerNavigation.classList.add(".header__navigation--scrolled-top");
else headerNavigation.classList.add("header__navigation--scrolled-down");

  // Отслеживание скролла

  window.addEventListener("scroll", (e) => {
    scrollYBefore = scrollY;
    scrollY = this.scrollY || document.documentElement.scrollTop;
  
    // Прокрутка в верх страницы
    if((scrollY === 0) && (scrollYBefore > 0)) {
      headerNavigation.style.cssText = ""
      headerNavigation.classList.add("header__navigation--scrolled-top");
      headerNavigation.classList.remove("header__navigation--scrolled-down");
      headerNavigation.style.cssText = `animation: ${animationDuration}s nav-color-to-gradient linear`;
      
    };
    // Прокрутка в низ страницы
    if((scrollY > 0) && (scrollYBefore < scrollY)) {
      headerNavigation.style.cssText = ""
      headerNavigation.classList.remove("header__navigation--scrolled-top");
      headerNavigation.classList.add("header__navigation--scrolled-down");
      headerNavigation.style.cssText = `animation: ${animationDuration}s nav-color-to-flat linear`;
    }

    treeClearingImg.style.cssText = `--scrollTop: ${scrollY}px`;
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

const animatedObjects = document.querySelectorAll(
    ".wood, .wood-products, .order, .transportation"
  );
  
  const showObjects = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(`${entry.target.classList[0]}--show`);
        observer.unobserve(entry.target);
      }
    });
  };
  
  const options = { threshold: 0.5 };
  
  const observer = new IntersectionObserver(showObjects, options);
  
  animatedObjects.forEach((object) => observer.observe(object));
  
