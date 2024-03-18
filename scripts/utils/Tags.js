// @ts-nocheck
import {
  updateSelectedTagsState,
  filterAndDisplayUpdate,
} from "./searchByTag.js";
import { getSearchTerm } from "./searchState.js";

export function createTag(tagName) {
  const listItem = document.createElement("li");
  // Créez un élément span contenant le nom de l'option
  const spanElement = document.createElement("span");
  spanElement.classList.add("tag");
  spanElement.setAttribute("tag-name", tagName);
  spanElement.textContent = tagName;

  // Créez un bouton pour supprimer l'option sélectionnée
  const removeBtn = document.createElement("i");
  removeBtn.classList.add("remove-tag", "fa", "fa-times");
  // Ajoutez le span et le bouton à l'élément <li>
  listItem.appendChild(spanElement);
  listItem.appendChild(removeBtn);

  return listItem;
}

export function addTagToSection(tagName) {
  const tag = document.querySelector(`.tag[tag-name="${tagName}"]`);
  if (!tag) {
    const tagElement = createTag(tagName);
    const removeBtn = tagElement.querySelector(".remove-tag");
    removeBtn.style.display = "inline-block"; // Afficher le bouton de suppression
    document.querySelector(".tags_section").appendChild(tagElement);
    removeBtn.addEventListener("click", () => {
      tagElement.remove();
      updateSelectedTagsState(tagName);
      let searchTerm = getSearchTerm(); // Récupérez le terme de recherche actuel
      filterAndDisplayUpdate(searchTerm);
    });
  }
}
/*
function formatTag(tag) {
  if (!tag) return "";
  return tag.toLowerCase();
}
/*
// Quand vous ajoutez un tag à tags_section
const formattedTag = formatTag(tagName); // tagName est le nom du tag avant la modification
addTagToSection(formattedTag); // Utilisez le tag formaté pour l'ajout
*/
