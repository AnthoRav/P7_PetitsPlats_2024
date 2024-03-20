// @ts-nocheck
import { recipes } from "../data/recipes.js";
import { createRecipeCards, recipesTotal } from "./page/index.js";
import { setSearchTerm } from "./utils/searchState.js";
import { filterAndDisplayUpdate } from "./utils/searchByTag.js";
import { resetRecipesAndTags } from "./page/index.js";

const searchRecipeInput = document.getElementById("search-recipe");
const form = document.querySelector(".header-search");
const results = [];

searchRecipeInput.addEventListener("input", function (e) {
  const searchValue = e.target.value,
    value = searchValue.toLowerCase(); //conversion en minuscule pour normaliser les chaines de caractères
  if (value.length >= 3) {
    // Vérifie si la longueur du terme de recherche est supérieure ou égale à trois caractères
    // Effectue la recherche automatiquement
    searchRecipesByLoop(value);
  }
  if (value.length <= 2) {
    resetRecipesAndTags(recipes);
    setSearchTerm("");
    filterAndDisplayUpdate("");
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le formulaire de se soumettre normalement
  const searchTerm = searchRecipeInput.value.toLowerCase();

  if (searchTerm.length >= 3) {
    searchRecipesByLoop(searchTerm);
  }
  if (searchTerm.length <= 2) {
    resetRecipesAndTags(recipes);
    setSearchTerm("");
    filterAndDisplayUpdate("");
  }
});
/*
export function searchRecipesByLoop(term) {
  const recipeCardSection = document.querySelector(".recipes_section");
  term = term.toLowerCase().trim();
  const searchTerms = term.split(" "); // Divise le terme de recherche en mots individuels
  results.length = 0;
  // Boucle à travers les recettes
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const { name, ingredients, description } = recipe;

    // Vérifie si le terme de recherche est présent dans le titre, les ingrédients ou la description
    if (
      name.toLowerCase().includes(searchTerms) ||
      ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(searchTerms)
      ) ||
      description.toLowerCase().includes(searchTerms)
    ) {
      results.push(recipe); // met le resultat des correspondance dans le tableau results
    }
  }
  recipeCardSection.innerHTML = " "; // Vide la section des cartes de recettes

  // Affiche la ou les recettes corrspondant à la recherche et affiche le nombre de recette
  if (results.length > 0) {
    setSearchTerm(term);
    filterAndDisplayUpdate(term); //mise a jour des recettes, tags et total
  } else {
    recipesTotal(results);
    const noResultMsg = `<span class="no-result">Aucune recette ne contient "${term}" vous pouvez chercher «tarte aux pommes », « poisson », etc.</span> `;
    recipeCardSection.innerHTML = noResultMsg;
  }
  //recupération de la recherche
  setSearchTerm(term);

  //console.log(results);
}
*/
export function searchRecipesByLoop(term) {
  const searchTerms = term.toLowerCase().trim().split(" "); // Divise le terme de recherche en mots individuels
  results.length = 0; // S'assure que le tableau de résultats est réinitialisé

  // Boucle à travers toutes les recettes
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    // Concatène le nom, la description et les ingrédients en une seule chaîne
    const recipeData = [
      recipe.name,
      ...recipe.ingredients.map((ing) => ing.ingredient),
      recipe.description,
    ]
      .join(" ")
      .toLowerCase();

    // Vérifie si chaque terme de recherche est présent individuellement
    let allTermsFound = searchTerms.every((searchTerm) =>
      recipeData.includes(searchTerm)
    );

    if (allTermsFound) {
      results.push(recipe);
    }
  }

  // Utilisation de filterAndDisplayUpdate pour mettre à jour l'affichage en fonction des résultats
  if (results.length > 0) {
    // Si des recettes correspondent aux critères de recherche
    filterAndDisplayUpdate(term);
  } else {
    // Si aucun résultat n'est trouvé, affiche un message d'erreur et réinitialise l'affichage
    recipesTotal(results); // Met à jour les recettes et les tags selon les résultats trouvés
    const recipeCardSection = document.querySelector(".recipes_section");
    recipeCardSection.innerHTML = `<span class="no-result">Aucune recette ne correspond à votre recherche "${term}". Essayez "tarte aux pommes", "poisson", etc.</span>`;
    //filterAndDisplayUpdate(""); // Réinitialise les recettes et les tags affichés
  }
  setSearchTerm(term);
}
