const catalog = document.querySelector(".catalog");

document.addEventListener("DOMContentLoaded", ()=>{
    catalog.classList.add(`${catalog.classList[0]}--show`);
       setTimeout(()=>{
        catalog.classList.add(`${catalog.classList[0]}--visible`);
    }, 1100)
});
