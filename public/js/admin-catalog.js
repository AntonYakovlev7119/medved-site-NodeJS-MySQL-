// ============= Админ панель/управление товарами =============

const product_managment_menu = document.querySelectorAll(
  ".managment-menu button"
);

function selectAction(action) {
  const product_managment_form = document.querySelector(
    "#product-characteristics"
  );
  const product_select = document.querySelector("#product-select");
  const product_name = document.querySelector("#product__name");
  const product__img_view = document.querySelector("#product__img-view");
  const product_img = document.querySelector("#img_file");
  const product_desc = document.querySelector("#product__description");
  const product_price = document.querySelector("#product__price");
  const product_button_submit = document.querySelector(
    "#product-characteristics button[type='submit']"
  );

  function clearForm() {
    product_select[0].selected = true;
    product__img_view.src = "../img/no_img.jpg";
    product_name.value = null;
    product_desc.value = null;
    product_price.value = null;
  }

  switch (action) {
    case "add":
      clearForm();
      product_select.style.display = "none";
      product_managment_form.style.display = "flex";
      product_img.removeAttribute("disabled");
      product_managment_form.action = "/admin/catalog_management/add_product";
      product_button_submit.innerHTML = "Добавить товар";
      break;

    case "edit":
      clearForm();
      product_managment_form.style.display = "none";
      product_select.style.display = "block";
      product_button_submit.innerHTML = "Сохранить изменения";

      product_select.addEventListener("change", async (elem) => {
        const data = await fetch(
          `/admin/catalog_management?product_id=${elem.target.value}`
        ).then((response) => {
          return response.json();
        });

        product__img_view.src = `../product_images/${data.img}`;
        product_name.value = data.title;
        product_desc.value = data.desc;
        product_price.value = data.price;
        product_managment_form.style.display = "flex";
        product_img.removeAttribute("disabled");

        product_managment_form.action = `/admin/catalog_management/edit_product/${elem.target.value}`;
      });
      break;

    case "delete":
      clearForm();

      product_managment_form.style.display = "none";
      product_select.style.display = "block";
      product_button_submit.innerHTML = "Удалить товар";

      product_select.addEventListener("change", async (elem) => {
        const data = await fetch(
          `/admin/catalog_management?product_id=${elem.target.value}`
        ).then((response) => {
          return response.json();
        });

        product__img_view.src = `../product_images/${data.img}`;

        product_name.value = data.title;
        product_desc.value = data.desc;
        product_price.value = data.price;
        product_managment_form.style.display = "flex";
        product_img.setAttribute("disabled", "disabled");
        product_managment_form.action = `/admin/catalog_management/delete_product/${elem.target.value}?img=${data.img}`;
      });

      break;
  }
}

function getImage() {
  const product__img_view = document.querySelector("#product__img-view");
  const product__img_text = document.querySelector(".product__img-text");
  let img = img_file.files[0];
  if (img) {
    product__img_view.src = URL.createObjectURL(img);
    product__img_text.innerHTML = img.name;
    localStorage.setItem("myImage", product__img_view.src);
    product__img_view.src = localStorage.getItem("myImage");
  }
}

function createProduct() {}
