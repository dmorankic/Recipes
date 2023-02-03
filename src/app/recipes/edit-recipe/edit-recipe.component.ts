import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/data-storage.service';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css'],
})
export class EditRecipeComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  form: FormGroup;
  recipe: Recipe;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipesService,
    private router: Router,
    private dataStorage:DataStorageService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      console.log(this.editMode);
      this.initForm();
    });
  }
  onCancel() {
    this.router.navigate(['/recipes']);
  }
  initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.recipe = this.recipeService.getRecipe(this.id);
      recipeName = this.recipe.name;
      recipeImagePath = this.recipe.imagePath;
      recipeDesc = this.recipe.description;
      if (this.recipe.ingredients) {
        this.recipe.ingredients.forEach((ingredient) => {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        });
      }
    }
    this.form = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDesc, Validators.required),
      ingredients: recipeIngredients,
    });
  }
  getIngs() {
    return <FormArray>this.form.get('ingredients');
  }
  onSubmit() {
    if (!this.editMode) {
      this.recipeService.addRecipe(this.form.value);
      this.form.reset();
    } else {
      this.recipeService.updateRecipe(this.id, this.form.value);
      this.editMode = false;
      this.form.reset();
    }
    this.dataStorage.storeData()
    this.onCancel();
  }
  addIngredient() {
    this.getIngs().push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
      })
    );
  }
  removeIng(index:number){
    (<FormArray>this.form.get('ingredients')).removeAt(index)
  }
}
