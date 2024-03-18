// @ts-nocheck
export const openCloseDropdown = () => {
  const dropdownButtons = document.querySelectorAll(".select-button");
  let chevron;

  function toggleDropdown(btn) {
    const dropdownContent = btn.nextElementSibling;
    chevron = btn.querySelector(".fa-chevron-down");
    chevron.classList.toggle("rotate");
    dropdownContent.classList.toggle("active");
  }

  function closeOtherDropdowns(clickedButton) {
    dropdownButtons.forEach((btn) => {
      chevron = btn.querySelector(".fa-chevron-down");
      if (btn !== clickedButton) {
        chevron.classList.remove("rotate");
        btn.nextElementSibling.classList.remove("active");
      }
    });
  }

  dropdownButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleDropdown(btn);
      closeOtherDropdowns(btn);
    });
  });
};

//recherche dans chaque input de dropdown
export const addSearchToDropdowns = () => {
  const searchInputs = document.querySelectorAll(
    ".select-search-section input"
  );

  searchInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const filter = this.value.toLowerCase();
      // Trouver le ul spécifique qui suit directement ce champ de saisie
      const ul = this.closest(".select-dropdown").querySelector(".option-list");

      Array.from(ul.getElementsByTagName("li")).forEach((li) => {
        let txtValue = li.textContent || li.innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          li.style.display = "";
        } else {
          li.style.display = "none";
        }
      });
    });
  });
};

openCloseDropdown();
addSearchToDropdowns();
