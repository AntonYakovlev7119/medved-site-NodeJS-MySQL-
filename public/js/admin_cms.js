// ============= Админ панель/управление содержимым страниц =============

const sectionSelect = document.querySelector("#section_select");
const cmsForm = document.querySelector("form.cms_managment");
const sectionTitle = document.querySelector("h2.title");
const textArea = document.querySelector("#cms_text_area");
const formButton = document.querySelector(".save_changes_button");

let cmsData = null;
let defaultCmsData = null;
let cmsDataChanges = {};

(async function () {
  sectionSelect.options[0].innerHTML = "Загрузка";
  sectionSelect.setAttribute("disabled", "disabled");

  try {
    await fetch("/admin/get_cms_list_content")
      .then((res) => {
        if (!res.ok) {
          const error = new Error("Не удалось получить данные с сервера");
          error.status = 500;
          sectionSelect.options[0].innerHTML = "-- Данные не загружены --";
          alert("-- Ошибка загрузки данных --");

          throw error;
        }

        return res.json();
      })
      .then((data) => {
        Object.entries(data).forEach((elem) => {
          sectionSelect.innerHTML += `<option value="${elem[0]}">${elem[1].title}</option>`;
        });

        cmsData = data;
        defaultCmsData = defaultCmsData = JSON.parse(JSON.stringify(data));

        sectionSelect.options[0].innerHTML = "-- Выбор секции --";
        sectionSelect.removeAttribute("disabled", "disabled");
      });
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
      if (!res.ok) throw new Error();
      else {
        cmsDataChanges = {};
        defaultCmsData = JSON.parse(JSON.stringify(cmsData));

        alert("Изменения применены");

        return res.json();
      }
    })
    .catch((err) => {
      console.error(err);
      alert("ОШИБКА! Не удалось применить изменения...");
    });
}

function formContentChanged() {
  if (sectionSelect.value !== "") {
    if (textArea.value === defaultCmsData[sectionSelect.value].content) {
      delete cmsDataChanges[sectionSelect.value];
    } else {
      cmsDataChanges[sectionSelect.value] = textArea.value;
    }

    cmsData[sectionSelect.value].content = textArea.value;
  }
  // console.log("Изменения: ", cmsDataChanges);

  // console.log("textArea: ", textArea.value);
  // console.log("defaultCmsData: ", defaultCmsData[sectionSelect.value].content);
}
