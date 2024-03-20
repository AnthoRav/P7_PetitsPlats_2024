// @ts-nocheck
import { recipes } from "../../data/recipes.js";
import { createRecipeCards, recipesTotal } from "../page/index.js";
import { createTag, addTagToSection } from "./Tags.js";
import { getSearchTerm } from "./searchState.js";

let filteredRecipes = recipes;
// Initialisez des tableaux vides pour les valeurs sélectionnées de chaque type de tag
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];

// Met à jour les options des listes déroulantes avec les ingrédients, appareils et ustensiles uniques
export function updateDropdownOptions(filteredRecipes) {
  // Récupère les éléments des listes déroulantes
  const ingredientsDropdown = document.getElementById("ingredients-drop");
  const applianceDropdown = document.getElementById("appliances-drop");
  const ustensilsDropdown = document.getElementById("ustensils-drop");

  const ingredientsSet = new Set();
  const appliancesSet = new Set();
  const ustensilsSet = new Set();

  // Collecter les tags uniques des recettes filtrées
  filteredRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) =>
      ingredientsSet.add(ingredient.ingredient)
    );
    appliancesSet.add(recipe.appliance);
    recipe.ustensils.forEach((ustensil) => ustensilsSet.add(ustensil));
  });

  // Mise à jour des listes déroulantes
  updateDropdown(ingredientsDropdown, ingredientsSet);
  updateDropdown(applianceDropdown, appliancesSet);
  updateDropdown(ustensilsDropdown, ustensilsSet);
}

updateDropdownOptions(filteredRecipes);

// Met à jour une liste déroulante avec les options fournies
function updateDropdown(dropdown, options) {
  dropdown.innerHTML = ""; // Supprimez le contenu actuel du dropdown
  options.forEach((option) => {
    const tagElement = createTag(option);
    dropdown.appendChild(tagElement);
  });
}

// Sélectionnez tous les éléments de liste déroulante
const dropdowns = document.querySelectorAll(".option-list");

// Ajoutez un gestionnaire d'événements "click" à chaque élément de liste déroulante
dropdowns.forEach(function (dropdown) {
  dropdown.addEventListener("click", function (event) {
    if (event.target.classList.contains("tag")) {
      const selectedValue = event.target.textContent.toLowerCase();
      const tag = dropdown.id.split("-")[0]; // Récupérez le tag à partir de l'ID de l'élément de liste déroulante

      // Ajoutez ou supprimez la valeur sélectionnée du tableau correspondant au type de tag
      if (dropdown.id.includes("ingredient")) {
        toggleSelection(selectedIngredients, selectedValue);
      } else if (dropdown.id.includes("appliance")) {
        toggleSelection(selectedAppliances, selectedValue);
      } else if (dropdown.id.includes("ustensils")) {
        toggleSelection(selectedUstensils, selectedValue);
      }
      selectedIngredients.forEach((tagName) => addTagToSection(tagName));
      selectedAppliances.forEach((tagName) => addTagToSection(tagName));
      selectedUstensils.forEach((tagName) => addTagToSection(tagName));
      const currentSearchTerm = getSearchTerm(); // Récupérez le terme de recherche actuel
      filterAndDisplayUpdate(currentSearchTerm);
    }
  });
});
/*
export function filterAndDisplayUpdate(searchTerm = "") {
  // Utilisez searchTerm pour effectuer une pré-filtration des recettes
  if (searchTerm) {
    filteredRecipes = recipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(searchTerm)
        ) ||
        recipe.description.toLowerCase().includes(searchTerm)
    );
  }
  // Filtrer les recettes en fonction des valeurs sélectionnées et mettre à jour les recettes sur la page
  filteredRecipes = filterRecipesByMultipleTags(
    selectedIngredients,
    selectedAppliances,
    selectedUstensils,
    filteredRecipes
  );
  const recipeCardSection = document.querySelector(".recipes_section");
  recipeCardSection.innerHTML = " "; // Vide la section des cartes de recettes
  // Mettez à jour les recettes sur la page en fonction du filtre
  createRecipeCards(filteredRecipes);
  recipesTotal(filteredRecipes);
  updateDropdownOptions(filteredRecipes);
}
*/
export function filterAndDisplayUpdate(searchTerm = "") {
  let searchTerms = searchTerm.toLowerCase().trim().split(" ");
  console.log("Terme de recherche actuel:", getSearchTerm());
  console.log(
    "Tags sélectionnés:",
    selectedIngredients,
    selectedAppliances,
    selectedUstensils
  );
  filteredRecipes = recipes.filter((recipe) => {
    // Concatène toutes les données de la recette en une chaîne de caractères pour la recherche
    let recipeData =
      recipe.name +
      " " +
      recipe.description +
      " " +
      recipe.ingredients.map((ing) => ing.ingredient).join(" ");
    recipeData = recipeData.toLowerCase();

    // Assure que chaque terme de recherche est présent dans les données de la recette
    return searchTerms.every((searchTerm) => recipeData.includes(searchTerm));
  });

  // Applique les filtres supplémentaires basés sur les tags sélectionnés ici, si nécessaire
  filteredRecipes = filterRecipesByMultipleTags(
    selectedIngredients,
    selectedAppliances,
    selectedUstensils,
    filteredRecipes
  );
  // Mise à jour de l'affichage en fonction des recettes filtrées
  const recipeCardSection = document.querySelector(".recipes_section");
  recipeCardSection.innerHTML = ""; // Nettoie la section avant d'afficher les résultats

  if (filteredRecipes.length > 0) {
    console.log(filteredRecipes);
    createRecipeCards(filteredRecipes); // Affiche les cartes de recettes
    recipesTotal(filteredRecipes); // Affiche le total des recettes trouvées
    updateDropdownOptions(filteredRecipes);
  } else {
    recipeCardSection.innerHTML = `<span class="no-result">Aucune recette ne correspond à votre recherche "${searchTerm}". Essayez autre chose.</span>`;
    recipesTotal(0); // Assurez-vous que cette fonction gère correctement le cas de 0 résultat.
  }
}
// Fonction pour ajouter ou supprimer une valeur du tableau de sélection en fonction de son état actuel
export function toggleSelection(selectedArray, value) {
  const index = selectedArray.indexOf(value);
  if (index === -1) {
    selectedArray.push(value);
  } else {
    selectedArray.splice(index, 1);
    document.querySelector(`.tag[tag-name="${value}"]`).closest("li").remove();
  }
  const currentSearchTerm = getSearchTerm(); // Récupérez le terme de recherche actuel
  filterAndDisplayUpdate(currentSearchTerm);
  console.log(currentSearchTerm);
}

// Fonction pour filtrer les recettes en fonction des valeurs sélectionnées de chaque type de tag
export function filterRecipesByMultipleTags(
  selectedIngredients,
  selectedAppliances,
  selectedUstensils,
  filteredRecipes
) {
  return filteredRecipes.filter((recipe) => {
    const ingredientsMatch = selectedIngredients.every((ingredient) =>
      recipe.ingredients.some(
        (recipeIngredient) =>
          recipeIngredient.ingredient.toLowerCase() === ingredient.toLowerCase()
      )
    );

    const applianceMatch = selectedAppliances.every(
      (appliance) => recipe.appliance.toLowerCase() === appliance.toLowerCase()
    );

    const ustensilsMatch = selectedUstensils.every((ustensil) =>
      recipe.ustensils.some(
        (recipeUstensil) =>
          recipeUstensil.toLowerCase() === ustensil.toLowerCase()
      )
    );

    return ingredientsMatch && applianceMatch && ustensilsMatch;
  });
}

// Fonction pour mettre à jour l'état des tags sélectionnés après suppression
export function updateSelectedTagsState(tagName) {
  selectedIngredients = selectedIngredients.filter((name) => name !== tagName);
  selectedAppliances = selectedAppliances.filter((name) => name !== tagName);
  selectedUstensils = selectedUstensils.filter((name) => name !== tagName);
}
