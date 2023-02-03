import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { Recipe } from './recipes/recipe.model';
import { RecipesService } from './recipes/recipes.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipesService,
    private authService: AuthService
  ) {}

  storeData() {
    let recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://course-project-backend-5d3da-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchData() {
    return this.http
      .get(
        'https://course-project-backend-5d3da-default-rtdb.europe-west1.firebasedatabase.app/recipes.json?'
      )
      .pipe(
        map((response: Recipe[]) => {
          return response.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
