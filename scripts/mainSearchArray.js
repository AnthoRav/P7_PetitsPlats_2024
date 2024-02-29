import { recipes } from "../data/recipes.js";
import { createRecipeCards, recipesTotal } from "./page/index.js";
import { setSearchTerm } from "./utils/searchState.js";
import { filterAndDisplayUpdate } from "./utils/searchByTag.js";
import { resetRecipesAndTags } from "./page/index.js";

const searchRecipeInput = document.getElementById("search-recipe");
const form = document.querySelector(".header-search");

searchRecipeInput.addEventListener("input", function (e) {
  const searchValue = e.target.value,
    value = searchValue.toLowerCase(); //conversion en minuscule pour normaliser les chaines de caractères
  if (value.length >= 3) {
    // Vérifie si la longueur du terme de recherche est supérieure ou égale à trois caractères
    searchRecipes(value);
  }
  if (value.length <= 2) {
    resetRecipesAndTags(recipes);
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le formulaire de se soumettre normalement
  const searchTerm = searchRecipeInput.value.toLowerCase();

  if (searchTerm.length >= 3) {
    searchRecipes(searchTerm);
  }
  if (searchTerm.length <= 2) {
    resetRecipesAndTags(recipes);
  }
});

export function searchRecipes(term) {
  const recipeCardSection = document.querySelector(".recipes_section");
  term = term.toLowerCase().trim();

  const recipeFiltered = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(term) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(term)
      ) ||
      recipe.description.toLowerCase().includes(term)
  );
  recipeCardSection.innerHTML = " "; // Vide la section des cartes de recettes

  if (recipeFiltered.length === 0) {
    const noResultMsg = `<span class="no-result">Aucune recette ne contient "${term}" vous pouvez chercher «tarte aux pommes », « poisson », etc.</span> `;
    recipeCardSection.innerHTML = noResultMsg;
  }
  console.log(recipeFiltered);
  createRecipeCards(recipeFiltered); // affichage des cartes du nouveau tableau
  recipesTotal(recipeFiltered);
  setSearchTerm(term);
  filterAndDisplayUpdate(term);
}
