// Корзина

const product_cards = document.querySelectorAll(".catalog__product-card");
const cart_icon = document.querySelector(".cart-icon");
const cart = document.querySelector(".cart");
const cart_container = document.querySelector(".cart-container");
const cart_dark_canvas = document.querySelector(".cart-dark-canvas");
const cart_close_cross = document.querySelector(".cart__close-cross");
const product_to_cart_button = document.querySelectorAll(
  ".buy-product__button"
);
const cart_count_indicator = document.querySelector(
  ".cart-products-count-indicator"
);

window.onload = addProductToCart();

// Настройка карточек товаров

product_cards.forEach((elem) => {
  if (!localStorage.cart) return;

  const cart = JSON.parse(localStorage.cart);

  if (cart.hasOwnProperty(elem.dataset.id)) {
    const product_card_button = elem.querySelector(".buy-product__button");
    product_card_button.style.cssText =
      "pointer-events: none; background: grey";
    product_card_button.innerHTML = "В корзине";
  }
});

// Открытие корзины

cart_icon.addEventListener("click", () => {
  cart.classList.add("active");
  cart_dark_canvas.classList.add("active");
});

// Закрытие корзины

[cart_dark_canvas, cart_close_cross].forEach((elem) => {
  elem.addEventListener("click", () => {
    cart.classList.remove("active");
    cart_dark_canvas.classList.remove("active");
    client_info.classList.remove("active");
  });
});

// Настройка кнопки товарной карточки

product_to_cart_button.forEach((elem) => {
  elem.addEventListener("click", async (element) => {
    const product_id = element.target.parentElement.parentElement.dataset.id;
    const product_img =
      element.target.parentElement.previousElementSibling.src.split("/")[4];
    const product_title =
      element.target.parentElement.firstElementChild.innerHTML;
    const product_price =
      element.target.previousElementSibling.childNodes[2].textContent.split(
        "р."
      )[0];

    element.target.style.cssText = "pointer-events: none; background: grey";
    element.target.innerHTML = "В корзине";

    const product = {
      id: product_id,
      img: product_img,
      title: product_title,
      price: product_price,
      count: 1,
    };

    if (!localStorage.cart) {
      localStorage.cart = JSON.stringify({ [product_id]: product });
    } else {
      const cart = JSON.parse(localStorage.cart);
      cart[product_id] = product;
      localStorage.cart = JSON.stringify(cart);
    }

    addProductToCart();
  });
});

async function addProductToCart() {
  const response = await fetch("/get_cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: localStorage.cart,
  });

  const result = await response.text();

  cart_container.innerHTML = result;

  cartControl();

  const cart_increase_product_button = cart_container.querySelectorAll(
    ".cart-product__increase-count"
  );
  const cart_decrease_product_button = cart_container.querySelectorAll(
    ".cart-product__decrease-count"
  );
  const cart_delete_product_button = cart_container.querySelectorAll(
    ".cart-product__delete"
  );

  cart_increase_product_button.forEach((elem) => {
    elem.addEventListener("click", (element) => {
      let product_count = Number.parseInt(
        element.target.previousElementSibling.innerHTML
      );
      const cart = JSON.parse(localStorage.cart);
      const product_id =
        element.target.parentElement.parentElement.parentElement.dataset.id;

      cart[product_id].count = ++product_count;
      localStorage.cart = JSON.stringify(cart);
      element.target.previousElementSibling.innerHTML = product_count;
    });
  });

  cart_decrease_product_button.forEach((elem) => {
    elem.addEventListener("click", (element) => {
      let product_count = Number.parseInt(
        element.target.nextElementSibling.innerHTML
      );
      const cart = JSON.parse(localStorage.cart);
      const product_id =
        element.target.parentElement.parentElement.parentElement.dataset.id;

      if (product_count > 1) cart[product_id].count = --product_count;

      localStorage.cart = JSON.stringify(cart);
      element.target.nextElementSibling.innerHTML = product_count;
    });
  });

  cart_delete_product_button.forEach((elem) => {
    elem.addEventListener("click", (element) => {
      const product_id = element.target.parentElement.parentElement.dataset.id;
      const cart_product_card = document.querySelector(
        `.cart__product[data-id="${product_id}"]`
      );
      const product_card = document.querySelector(
        `.product[data-id="${product_id}"]`
      );
      try{
        const product_card_button = product_card.querySelector(
          ".buy-product__button"
        );
        product_card_button.style.cssText =
        "pointer-events: auto; background: var(--btn-bg-color);";
      product_card_button.innerHTML = "В корзину";
      }
      catch(err){}
      const cart = JSON.parse(localStorage.cart);

      cart_product_card.remove();
      if (Object.keys(cart).length === 1) {
        delete localStorage.cart;
      } else {
        delete cart[product_id];
        localStorage.cart = JSON.stringify(cart);
      }
      
      cartControl();
    });
  });
}

function cartControl() {
  if (!localStorage.cart) {
    cart_icon.classList.remove("active");
  } else {
    const cart = JSON.parse(localStorage.cart);
    cart_icon.classList.add("active");
    cart_count_indicator.innerHTML = Object.keys(cart).length;
  }
}

// Нажатие кнопки "Оформить заказ"

const cart_button = document.querySelector(".cart-button");
const confirm_cart_button = document.querySelector(".confirm-cart__button");
const client_info = document.querySelector(".client-info");
const client_info_form = document.forms.client_info_form;

cart_button.addEventListener("click", () => {
  cart.classList.remove("active");
  client_info.classList.add("active");
});

confirm_cart_button.addEventListener("click", async (event) => {
  event.preventDefault();
  const client_form_inputs = Array.from(client_info_form);
  client_form_inputs.length = 2;
  const [client_name, client_telephone] = client_form_inputs.map(
    (elem) => elem.value
  );
  const cart = JSON.parse(localStorage.cart);
  let cart_count = 0;
  Object.values(cart).forEach((elem) => {
    cart_count += elem.count;
  });

  const client_cart_data_json = {
    name: client_name,
    telephone: client_telephone,
    order_notes: "dfdfdfdfd",
    cart: Object.values(cart),
    cart_count: cart_count,
  };
  const client_cart_data = JSON.stringify(client_cart_data_json);

  Object.keys(cart).forEach((elem) => {
    const product_card = document.querySelector(`.product[data-id="${elem}"]`);
    const product_card_button = product_card.querySelector(
      ".buy-product__button"
    );

    product_card_button.style.cssText =
      "pointer-events: auto; background: var(--btn-bg-color);";
  });
  delete localStorage.cart;

  cart_dark_canvas.classList.remove("active");
  client_info.classList.remove("active");
  cart_icon.classList.remove("active");

  await fetch("/create_cart_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: client_cart_data,
  });
});
