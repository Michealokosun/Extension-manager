let extensionData = [];
const cards = document.getElementById("cards");
const tabButtons = document.querySelectorAll(".buttons button");
let currentfilter = "All";

/**
 *
 *
 * TODO
 *  ADD A MODAL
 * ADD AN ALLERT WHEN USER DELETE
 * TOGGLE BETWEEN LIGH AND DARK MODE
 */

/**
 * DARK THEME TOGGLE
 */
const darkBtn = document.getElementById("dark");
const lightBtn = document.getElementById("light");
const storedTheme = localStorage.getItem("theme");
let currentTheme = "dark";
const html = document.documentElement;
if (storedTheme !== null) {
  html.setAttribute("theme", storedTheme);
  // keeps the buttons inline with the theme
  if (storedTheme == "dark") {
    darkBtn.classList.add("hidden");
    lightBtn.classList.remove("hidden");
  } else {
    lightBtn.classList.add("hidden");
    darkBtn.classList.remove("hidden");
  }
} else {
  html.setAttribute("theme", currentTheme);
}

lightBtn.addEventListener("click", () => {
  currentTheme = "light";
  localStorage.setItem("theme", currentTheme);
  html.setAttribute("theme", currentTheme);
  lightBtn.classList.add("hidden");
  darkBtn.classList.remove("hidden");
});
darkBtn.addEventListener("click", () => {
  currentTheme = "dark";
  html.setAttribute("theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  darkBtn.classList.add("hidden");
  lightBtn.classList.remove("hidden");
});
/**
 *
 * FETCH EXTENSION DATA
 *
 */
async function fetchData() {
  const res = await fetch("../data.json");
  extensionData = await res.json();
  applyfilter(currentfilter);
}

function applyfilter(filter) {
  currentfilter = filter;

  tabButtons.forEach((btn) => {
    const btnName = btn.dataset.tab.toLowerCase();
    btn.classList.toggle("active", btnName === filter.toLowerCase());
  });

  let filterData;
  switch (filter) {
    case "All":
      filterData = extensionData;

      break;
    case "Active":
      filterData = extensionData.filter((item) => item.isActive === true);
      break;
    case "Inactive":
      filterData = extensionData.filter((item) => item.isActive === false);
      break;

    default:
      break;
  }

  displayData(filterData);
}

function displayData(extensiondata) {
  cards.innerHTML = "";
  if (extensiondata.length === 0) {
    cards.innerHTML = `<div class="no-data">No Data Found</div>`;
  }
  extensiondata.forEach((element) => {
    const item = document.createElement("div");
    item.dataset.name = element.name;
    item.classList.add("card");
    item.innerHTML = `<div class="card-body">
            <div class="card_img">
              <img src="${element.logo}" alt="" />
            </div>
            <div class="card_content">
              <h1 class="card_title">${element.name}</h1>
              <p class="subtitle">
                ${element.description}
              </p>
            </div>
          </div>
          <div class="card-footer">
            <button class="remove-btn"  id="remove">remove</button>
            <div class="custom_checkbox">
              <label>
                <input class="input-checkbox"  ${
                  element.isActive && "checked"
                } type="checkbox" />
                <div class="checkbox"></div>
              </label>
            </div>
          </div>`;

    cards.appendChild(item);
  });
}

/**
 *
 * HANDLE ENVENTS
 */
// FILTER WHEN USER CLICK ON THE TAB BUTTONS
tabButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const filter = e.target.dataset.tab;
    applyfilter(filter);
  });
});

/// REMOVE CARD FROM THE LIST
// when user click on the remove button
cards.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    confirm("are you sure you amn to delete"); // TODO:
    const name = e.target.closest(".card").dataset.name;

    let filterDelete = extensionData.filter((item) => item.name !== name);
    extensionData = filterDelete;
    applyfilter(currentfilter); /// this renders the page
    Toastify({
      text: "Deleted!",
      duration: 800,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background:
          "linear-gradient(to right,rgb(231, 61, 39),rgb(228, 161, 98))",
        borderRadius: "10px",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
});

/// CHECKBOX TOGGLE
// when user click on the checkbox
cards.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox")) {
    const name = e.target.closest(".card").dataset.name;
    const checkbox = e.target.closest(".checkbox").previousElementSibling;
    checkbox.addEventListener("change", (e) => {
      const extentionCard = extensionData.find((item) => item.name === name);

      if (extentionCard) {
        extentionCard.isActive = e.target.checked;
        applyfilter(currentfilter); /// this renders the page
        if (extentionCard.isActive) {
          Toastify({
            text: "Activated!",
            duration: 800,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background:
                "linear-gradient(to right,rgb(11, 139, 7),rgb(82, 187, 91))",
              borderRadius: "10px",
            },
            onClick: function () {}, // Callback after click
          }).showToast();
        } else {
          Toastify({
            text: "Deactivated!",
            duration: 800,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background:
                "linear-gradient(to right,rgb(226, 87, 52),rgb(206, 35, 5))",
              borderRadius: "10px",
            },
            onClick: function () {}, // Callback after click
          }).showToast();
        }
      }
    });
  }
});
///  ENTRY FUNCTION (MAIN FUNCTION)
fetchData();
