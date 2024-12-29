// ============= Админ панель/управление содержимым страниц =============

// const { body } = require("express-validator");

const sectionSelect = document.querySelector("#section_select");
const cmsForm = document.querySelector("form.cms_managment");
const sectionTitle = document.querySelector("h2.title");
const textArea = document.querySelector("#cms_text_area");
const formButton = document.querySelector(".save_changes_button");

let cmsData;
let cmsDataChanges = {};
let defaultCmsData = {};

(async function () {
  sectionSelect.options[0].innerHTML = "Загрузка";
  sectionSelect.setAttribute("disabled", "disabled");

  try {
    await fetch("/admin/get_cms_list_content")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status) {
          const error = new Error(data.message);
          error.status = data.status;
          throw error;
        } else {
          Object.entries(data).forEach((elem) => {
            sectionSelect.innerHTML += `<option value="${elem[0]}">${elem[1].title}</option>`;
          });

          return (cmsData = data);
        }
      });

    sectionSelect.options[0].innerHTML = "-- Выбор секции --";

    sectionSelect.removeAttribute("disabled", "disabled");
  } catch (err) {
    console.error(err);
  }
})();

sectionSelect.addEventListener("change", (elem) => {
  if (elem.target.value !== "") {
    const content = cmsData[elem.target.value];

    sectionTitle.innerHTML = content.title;
    textArea.value = content.content;
  }
});

textArea.addEventListener("change", formContentChanged);
// textArea.addEventListener("keyup", formContentChanged);

cmsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  submitChanges();
});

async function submitChanges() {
  const data = JSON.stringify(cmsDataChanges);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: data,
  };

  await fetch("/admin/cms_data_update", options)
    .then((res) => {
      if (!res.ok) throw new Error("Не удалось загрузить изменения...");
      else {
        return res.json();
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

function formContentChanged() {
  if (sectionSelect.value !== "") {
    if (textArea.value === defaultCmsData[sectionSelect.value]) {
      delete cmsDataChanges[sectionSelect.value];
      delete defaultCmsData[sectionSelect.value];
    } else {
      if (!defaultCmsData.hasOwnProperty(sectionSelect.value)) {
        defaultCmsData[sectionSelect.value] =
          cmsData[sectionSelect.value].content;
      }

      cmsDataChanges[sectionSelect.value] = textArea.value;
    }

    cmsData[sectionSelect.value].content = textArea.value;
  }
  console.log("Измен ", cmsDataChanges);
  // console.log("Кэш ", cmsData);
}
