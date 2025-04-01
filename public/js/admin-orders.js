// ============= Админ панель/управление заявками =============

const orders = document.querySelectorAll(".order");
const order_title = document.querySelector(".order-title");
const order_content = document.querySelector(".order-content");
const order_content_container = document.querySelector(
  ".order-content-container"
);
const dark_canvas = document.querySelector(".dark-canvas");
const close_order_cross = document.querySelector(".order__close-cross");

orders.forEach((elem) => {
  elem.addEventListener("click", (elem) => {
    orders.forEach((elem) => {
      elem.style.cssText = "background: inherit; color: black";
    });
    elem.target.parentElement.style.cssText =
      "background: rgb(69, 58, 218); color: white";
  });
});

orders.forEach((elem) => {
  elem.addEventListener("dblclick", async (element) => {
    const order_id = element.target.parentElement.firstElementChild.innerHTML;
    order_title;
    const response = await fetch(`/get_order?id=${order_id}`);
    const order = await response.text();

    order_content_container.innerHTML = order;
    order_title.innerHTML = `Заказ №${order_id}`;
    order_content.classList.add("active");
    close_order_cross.classList.add("active");
    dark_canvas.classList.add("active");
  });
});

[dark_canvas, close_order_cross].forEach((elem) => {
  elem.addEventListener("click", () => {
    order_content.classList.remove("active");
    close_order_cross.remove("active");
    dark_canvas.classList.remove("active");
  });
});
