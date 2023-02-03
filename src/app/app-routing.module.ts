import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthInterceptorInterceptor } from './auth/auth-interceptor.interceptor';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { RecipeResolver } from './recipe.resolver';
import { EditRecipeComponent } from './recipes/edit-recipe/edit-recipe.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate:[AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: EditRecipeComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipeResolver],
      },
      {
        path: ':id/edit',
        component: EditRecipeComponent,
        resolve: [RecipeResolver],
      },
    ],
  },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  // imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
  ],
})
export class AppRoutingModule {}
