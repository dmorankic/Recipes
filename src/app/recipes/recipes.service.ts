import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/models/ingredient.model';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  recipesChanged: Subject<Recipe[]> = new Subject<Recipe[]>();
  recipes: Recipe[] = [
    // new Recipe(
    //   0,
    //   'Tasty Schnitzel',
    //   'This is new recipes description',
    //   'https://www.thespruceeats.com/thmb/nteUBdi6fqaWt4GImZjUc-yCB98=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/shortcut-recipe-for-demi-glace-996076-hero-01-829a250d5a8d4be28bdfe697cde9bfb1.jpg',
    //   [new Ingredient('Meat', 1), new Ingredient('French fires', 20)]
    // ),
    // new Recipe(
    //   1,
    //   'Big fat burger',
    //   'This is new recipes 2 description',
    //   'https://assets.bonappetit.com/photos/5b919cb83d923e31d08fed17/1:1/w_2560%2Cc_limit/basically-burger-1.jpg',
    //   [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
    // ),
  ];
  constructor() {}

  getRecipes() {
    return this.recipes.slice();
  }
  getRecipe(id: number) {
    const recipe = this.recipes.find((rec) => {
      return rec.id === id;
    });
    return recipe;
  }
  addRecipe(recipe: Recipe) {
    recipe.id = this.recipes.length;
    this.recipes.push(recipe);
    this.recipesUpdated();
  }
  updateRecipe(id: number, recipe: Recipe) {
    recipe.id = id;
    this.recipes[id] = recipe;
    this.recipesUpdated();
  }
  removeRecipe(id: number) {
    this.recipes = this.recipes.filter((x) => {
      return x.id !== id;
    });
    this.recipesUpdated();
  }
  recipesUpdated() {
    this.recipesChanged.next(this.recipes);
  }
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes);
  }
}
