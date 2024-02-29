import { recipes } from "../../data/recipes.js";
import { updateDropdownOptions } from "../utils/searchByTag.js";

const recipeCardSection = document.querySelector(".recipes_section");

export function createRecipeCards(recipes) {
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const recipeCard = document.createElement("figure");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
            <div class="card-img">
                <img src="assets/Photos/${recipes[i].image}" alt="${
      recipes[i].name
    }">
                <span class="card-time">${recipes[i].time} mn</span>
            </div>
            <figcaption class="card-text">
                <div>
                    <h3 class="title">${recipes[i].name}</h3>
                    <h4 class="title-info">RECETTE</h4>
                    <p class="recipe-description">${recipes[i].description}</p>
                </div>
                <div>
                    <h4 class="title-info">INGREDIENTS</h4>
                    <ul class="recipe-ingredients">
                        ${recipes[i].ingredients
                          .map(
                            (ingredient) => `
                                    <li>
                                        <span class="ingredients">${
                                          ingredient.ingredient
                                        }</span>
                                        ${
                                          ingredient.quantity && ingredient.unit
                                            ? `<span class="quantity">${ingredient.quantity} <span class="unit">${ingredient.unit}</span></span>`
                                            : ingredient.quantity
                                            ? `<span class="quantity">${ingredient.quantity}</span>`
                                            : "-"
                                        }
                                    </li>
                                        `
                          )
                          .join("")} 
                    </ul>
                </div>
            </figcaption>
        
            `;

    recipeCardSection.appendChild(recipeCard);
  }
}
createRecipeCards(recipes);
recipesTotal(recipes);

//Affichage du total de recette
export function recipesTotal(results) {
  const totalRecipe = document.querySelector(".recipe_total");
  totalRecipe.innerHTML = ` ${results.length} recettes `;
}

//Remet toutes les recettes et tags lorsque le champ de recherche à moins de 3 caractères
export function resetRecipesAndTags(recipes) {
  recipeCardSection.innerHTML = "";
  createRecipeCards(recipes);
  recipesTotal(recipes);
  updateDropdownOptions(recipes);
}
